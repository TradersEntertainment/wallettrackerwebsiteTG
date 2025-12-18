import { NextResponse } from 'next/server';
import { connectDB, WalletModel } from '@/lib/db';

export async function GET() {
    try {
        await connectDB();
        const wallets = await WalletModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(wallets);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to load wallets' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { address, name } = body;

        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        const existing = await WalletModel.findOne({ address });
        if (existing) {
            return NextResponse.json({ error: 'Wallet already exists' }, { status: 400 });
        }

        const newWallet = await WalletModel.create({ address, name: name || 'Unnamed' });
        const wallets = await WalletModel.find({}).sort({ createdAt: -1 }); // Return full list
        return NextResponse.json(wallets);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save wallet' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');
        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        await WalletModel.findOneAndDelete({ address });
        const wallets = await WalletModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(wallets);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete wallet' }, { status: 500 });
    }
}
