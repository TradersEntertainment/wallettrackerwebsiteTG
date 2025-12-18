import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    name: { type: String },
    group: { type: String },
    forceUpdate: { type: Boolean, default: false },
}, { timestamps: true });

// Prevent overwrite model error in hot reload
export const WalletModel = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);

const SettingsSchema = new mongoose.Schema({
    minPositionValueUsd: { type: Number, default: 10 },
    minPositionChangePercent: { type: Number, default: 0.01 }, // 1%
    notifyOnClose: { type: Boolean, default: true },
    notifyOnLiq: { type: Boolean, default: true },
}, { timestamps: true });

export const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined");
    }

    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
