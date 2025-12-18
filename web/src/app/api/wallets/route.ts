import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define path relative to where Next.js runs (root of 'web')
const SHARE_DB_PATH = path.join(process.cwd(), '../shared/wallets.json');

function getWallets() {
    if (!fs.existsSync(SHARE_DB_PATH)) return [];
    const data = fs.readFileSync(SHARE_DB_PATH, 'utf-8');
    return JSON.parse(data);
}

function saveWallets(wallets: any[]) {
    fs.writeFileSync(SHARE_DB_PATH, JSON.stringify(wallets, null, 2));
}

export async function GET() {
    try {
        const wallets = getWallets();
        return NextResponse.json(wallets);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to load wallets' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { address, name } = body;
        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        const wallets = getWallets();
        if (wallets.some((w: any) => w.address === address)) {
            return NextResponse.json({ error: 'Wallet already exists' }, { status: 400 });
        }

        wallets.push({ address, name: name || 'Unnamed' });
        saveWallets(wallets);
        return NextResponse.json(wallets);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to save wallet' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');
        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        let wallets = getWallets();
        wallets = wallets.filter((w: any) => w.address !== address);
        saveWallets(wallets);
        return NextResponse.json(wallets);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete wallet' }, { status: 500 });
    }
}
