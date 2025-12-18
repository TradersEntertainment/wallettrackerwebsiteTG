import { NextResponse } from 'next/server';

export async function GET() {
    // Mock logs for now - in production this would fetch from MongoDB or a file
    const logs = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        timestamp: new Date(Date.now() - i * 1000 * 60 * Math.random() * 10).toISOString(),
        level: Math.random() > 0.9 ? 'ERROR' : Math.random() > 0.7 ? 'WARN' : 'INFO',
        source: Math.random() > 0.5 ? 'Bot Engine' : 'Risk Manager',
        message: [
            'Checked wallet 0x49c... (OK)',
            'Position size increased for MSTR',
            'Latency spike detected (250ms)',
            'Database connection refreshed',
            'New block processed: 1829384',
            'Alert sent to Telegram',
            'Liquidation proximity warning for ETH-USD'
        ][Math.floor(Math.random() * 7)]
    }));

    return NextResponse.json(logs);
}
