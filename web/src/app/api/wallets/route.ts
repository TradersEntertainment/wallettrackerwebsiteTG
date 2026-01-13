import { NextResponse } from 'next/server';
import { connectDB, WalletModel } from '@/lib/db';
import { sendSystemAlert } from '@/lib/telegram';

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

const ADMIN_PASSWORD = 'allah';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { address, name, password } = body;

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        const existing = await WalletModel.findOne({ address });
        if (existing) {
            return NextResponse.json({ error: 'Wallet already exists' }, { status: 400 });
        }

        const newWallet = await WalletModel.create({ address, name: name || 'Unnamed' });

        // Notify
        await sendSystemAlert(`🔭 **New Wallet Added**\n\n📌 Address: \`${address}\`\n🏷️ Name: ${name || 'Unnamed'}`);

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
        const password = req.headers.get('x-admin-password');

        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existing = await WalletModel.findOneAndDelete({ address });

        if (existing) {
            await sendSystemAlert(`🗑️ **Wallet Removed**\n\n📌 Address: \`${address}\`\n🏷️ Name: ${existing.name || 'Unnamed'}`);
        }

        const wallets = await WalletModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json(wallets);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete wallet' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { address, forceUpdate } = body;
        const password = req.headers.get('x-admin-password');

        if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await WalletModel.findOneAndUpdate({ address }, { forceUpdate });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
    }
}
