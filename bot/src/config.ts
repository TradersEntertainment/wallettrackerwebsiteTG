import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || '',
    WALLETS_FILE_PATH: process.env.WALLETS_FILE_PATH || '../shared/wallets.json',
    CHECK_INTERVAL_MS: parseInt(process.env.CHECK_INTERVAL_MS || '60000', 10),
};
