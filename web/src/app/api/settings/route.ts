
import { NextResponse } from 'next/server';
import { connectDB, SettingsModel } from '@/lib/db';

export async function GET() {
    try {
        await connectDB();
        let settings = await SettingsModel.findOne();
        if (!settings) {
            // Create default
            settings = await SettingsModel.create({});
        }
        return NextResponse.json(settings);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Upsert settings (update if exists, create if not)
        // Since it's a singleton, we can just findOneAndUpdate or similar logic
        // But to be safe, we check if one exists
        let settings = await SettingsModel.findOne();
        if (settings) {
            Object.assign(settings, body);
            await settings.save();
        } else {
            settings = await SettingsModel.create(body);
        }

        return NextResponse.json(settings);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
