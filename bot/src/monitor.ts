import { ClearinghouseState, Position, PositionChange, AssetCtx } from './types';
import { getClearinghouseState } from './hyperliquid';
import * as fs from 'fs';
import * as path from 'path';

export class Monitor {
    private lastStates: Map<string, ClearinghouseState> = new Map();
    private walletsPath: string;

    constructor(walletsPath: string) {
        this.walletsPath = walletsPath;
    }

    private loadWallets(): { address: string; name?: string }[] {
        try {
            const data = fs.readFileSync(this.walletsPath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.error("Error loading wallets:", e);
            return [];
        }
    }

    public async checkUpdates(): Promise<{ address: string; changes: PositionChange[], state: ClearinghouseState }[]> {
        const wallets = this.loadWallets();
        const results: { address: string; changes: PositionChange[], state: ClearinghouseState }[] = [];

        for (const wallet of wallets) {
            try {
                const currentState = await getClearinghouseState(wallet.address);
                const lastState = this.lastStates.get(wallet.address);

                if (lastState) {
                    const changes = this.detectChanges(lastState, currentState);
                    if (changes.length > 0) {
                        results.push({ address: wallet.address, changes, state: currentState });
                    }
                }

                // Update last state
                this.lastStates.set(wallet.address, currentState);
            } catch (error) {
                console.error(`Failed to check updates for ${wallet.address}`, error);
            }
        }

        return results;
    }

    private detectChanges(oldState: ClearinghouseState, newState: ClearinghouseState): PositionChange[] {
        const changes: PositionChange[] = [];
        const newPositionsMap = new Map<string, Position>();

        newState.assetPositions.forEach(p => newPositionsMap.set(p.position.coin, p.position));

        // Check for modified or closed positions
        oldState.assetPositions.forEach(oldP => {
            const coin = oldP.position.coin;
            const newP = newPositionsMap.get(coin);

            if (!newP) {
                // Position Closed
                changes.push({
                    type: 'CLOSE',
                    coin: coin,
                    oldPosition: oldP.position,
                    pnl: parseFloat(oldP.position.unrealizedPnl) // Approximation
                });
            } else {
                // Position Modified?
                const oldSz = parseFloat(oldP.position.szi);
                const newSz = parseFloat(newP.szi);

                if (Math.abs(newSz) > Math.abs(oldSz)) {
                    changes.push({
                        type: 'INCREASE',
                        coin: coin,
                        oldPosition: oldP.position,
                        newPosition: newP,
                        deltaSize: Math.abs(newSz) - Math.abs(oldSz)
                    });
                } else if (Math.abs(newSz) < Math.abs(oldSz)) {
                    changes.push({
                        type: 'DECREASE',
                        coin: coin,
                        oldPosition: oldP.position,
                        newPosition: newP,
                        deltaSize: Math.abs(oldSz) - Math.abs(newSz)
                    });
                }
            }
        });

        // Check for NEW positions
        newState.assetPositions.forEach(newP => {
            const coin = newP.position.coin;
            const oldP = oldState.assetPositions.find(p => p.position.coin === coin);
            if (!oldP) {
                changes.push({
                    type: 'NEW',
                    coin: coin,
                    newPosition: newP.position
                });
            }
        });

        return changes;
    }
}
