
import { NextResponse } from 'next/server';
import { getClearinghouseState } from '@/lib/hyperliquid';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const state = await getClearinghouseState(address);

        // Format positions for easier consumption
        const positions = state.assetPositions.map(p => {
            const pos = p.position;
            return {
                coin: pos.coin,
                size: parseFloat(pos.szi),
                side: parseFloat(pos.szi) > 0 ? 'LONG' : 'SHORT',
                entryPx: parseFloat(pos.entryPx),
                positionValue: parseFloat(pos.positionValue),
                pnl: parseFloat(pos.unrealizedPnl),
                leverage: pos.leverage.value,
                liquidationPx: pos.liquidationPx ? parseFloat(pos.liquidationPx) : null
            };
        });

        // Calculate total stats
        const accountValue = parseFloat(state.crossMarginSummary.accountValue);

        return NextResponse.json({
            accountValue,
            positions
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 });
    }
}
