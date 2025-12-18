import mongoose from 'mongoose';
import { CONFIG } from './config';

const WalletSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    name: { type: String },
    group: { type: String },
    forceUpdate: { type: Boolean, default: false },
}, { timestamps: true });

export const WalletModel = mongoose.model('Wallet', WalletSchema);

const SettingsSchema = new mongoose.Schema({
    minPositionValueUsd: { type: Number, default: 10 },
    minPositionChangePercent: { type: Number, default: 0.01 }, // 1%
    notifyOnClose: { type: Boolean, default: true },
    notifyOnLiq: { type: Boolean, default: true },
}, { timestamps: true });

export const SettingsModel = mongoose.model('Settings', SettingsSchema);

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not defined in environment variables.");
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}
