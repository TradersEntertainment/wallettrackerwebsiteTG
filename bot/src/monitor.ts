import { ClearinghouseState, Position, PositionChange, AssetCtx } from './types';
import { getClearinghouseState } from './hyperliquid';
import { WalletModel, SettingsModel, connectDB } from './db';

export class Monitor {
    private lastStates: Map<string, ClearinghouseState> = new Map();

    constructor() {
        connectDB();
    }

    private async loadWallets(): Promise<{ address: string; name?: string }[]> {
        try {
            const wallets = await WalletModel.find({});
            return wallets.map(w => ({
                address: w.address,
                name: w.name || undefined,
                forceUpdate: w.forceUpdate,
                _id: w._id
            }));
        } catch (e) {
            console.error("Error loading wallets from DB:", e);
            return [];
        }
    }

    public async checkUpdates(): Promise<{ address: string; name?: string; changes: PositionChange[], state: ClearinghouseState }[]> {
        const wallets = await this.loadWallets();
        const results: { address: string; name?: string; changes: PositionChange[], state: ClearinghouseState }[] = [];

        // Fetch settings
        const settings = await SettingsModel.findOne({});
        const minVal = settings?.minPositionValueUsd ?? 10;
        const minPct = settings?.minPositionChangePercent ?? 0.01;
        const notifyClose = settings?.notifyOnClose ?? true;

        for (const wallet of wallets) {

            try {
                const currentState = await getClearinghouseState(wallet.address);

                // Manual Check Logic
                if ((wallet as any).forceUpdate) {
                    console.log(`Force update triggered for ${wallet.address}`);
                    const telegram = require('./telegram'); // Lazy load to avoid circular dep if any
                    await telegram.sendStatusReport(currentState, wallet.address, wallet.name);

                    // Reset flag
                    await WalletModel.updateOne({ _id: (wallet as any)._id }, { forceUpdate: false });
                }

                const lastState = this.lastStates.get(wallet.address);

                if (lastState) {
                    const changes = this.detectChanges(lastState, currentState, minVal, minPct, notifyClose);
                    if (changes.length > 0) {
                        results.push({ address: wallet.address, name: wallet.name, changes, state: currentState });
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

    private detectChanges(oldState: ClearinghouseState, newState: ClearinghouseState, minVal: number, minPct: number, notifyClose: boolean): PositionChange[] {
        const changes: PositionChange[] = [];
        const newPositionsMap = new Map<string, Position>();

        newState.assetPositions.forEach(p => newPositionsMap.set(p.position.coin, p.position));

        // Check for modified or closed positions
        oldState.assetPositions.forEach(oldP => {
            const coin = oldP.position.coin;
            const newP = newPositionsMap.get(coin);

            if (!newP) {
                // Position Closed
                if (notifyClose) {
                    changes.push({
                        type: 'CLOSE',
                        coin: coin,
                        oldPosition: oldP.position,
                        pnl: parseFloat(oldP.position.unrealizedPnl)
                    });
                }
            } else {
                // Position Modified?
                const oldSz = parseFloat(oldP.position.szi);
                const newSz = parseFloat(newP.szi);
                const rawVal = parseFloat(newP.positionValue);

                if (rawVal < minVal) return; // Skip small positions

                // Calculate % change relative to old size
                const sizeDiff = Math.abs(newSz) - Math.abs(oldSz);
                const pctChange = Math.abs(sizeDiff) / Math.abs(oldSz);

                if (pctChange < minPct) return; // Skip small changes

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
                const rawVal = parseFloat(newP.position.positionValue);
                if (rawVal >= minVal) {
                    changes.push({
                        type: 'NEW',
                        coin: coin,
                        newPosition: newP.position
                    });
                }
            }
        });

        return changes;
    }
}
