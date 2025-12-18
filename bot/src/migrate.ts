import { WalletModel, connectDB } from './db';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG } from './config';

// Temporary type
interface JsonWallet {
    address: string;
    name?: string;
}

async function migrate() {
    await connectDB();

    const jsonPath = path.resolve(__dirname, '../../shared/wallets.json');
    if (!fs.existsSync(jsonPath)) {
        console.log('No wallets.json found, skipping migration.');
        process.exit(0);
    }

    const data = fs.readFileSync(jsonPath, 'utf-8');
    const wallets: JsonWallet[] = JSON.parse(data);

    console.log(`Found ${wallets.length} wallets to migrate.`);

    for (const w of wallets) {
        try {
            const exists = await WalletModel.findOne({ address: w.address });
            if (!exists) {
                await WalletModel.create({ address: w.address, name: w.name });
                console.log(`Migrated: ${w.address}`);
            } else {
                console.log(`Skipped (exists): ${w.address}`);
            }
        } catch (e) {
            console.error(`Failed to migrate ${w.address}:`, e);
        }
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate();
