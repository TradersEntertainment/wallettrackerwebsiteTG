import { Monitor } from './monitor';
import { startBot, sendAlert } from './telegram';
import { CONFIG } from './config';
import * as path from 'path';

async function main() {
    console.log('Starting Hyperliquid Bot...');
    startBot();

    // Fix path resolution for wallets.json
    // If running from bot/src, we need to go up to shared/wallets.json
    // Config default is '../shared/wallets.json'
    const walletsPath = path.resolve(__dirname, '..', CONFIG.WALLETS_FILE_PATH);
    console.log(`Using wallets file at: ${walletsPath}`);

    const monitor = new Monitor(walletsPath);

    setInterval(async () => {
        console.log('Checking for updates...');
        const updates = await monitor.checkUpdates();

        for (const update of updates) {
            console.log(`Found updates for ${update.address}: ${update.changes.length} changes`);
            for (const change of update.changes) {
                await sendAlert(change, update.address, update.state.marginSummary.accountValue);
            }
        }
    }, CONFIG.CHECK_INTERVAL_MS);

    // Initial check
    console.log('Performing initial check...');
    await monitor.checkUpdates(); // Just to populate cache, or we can inhibit alerts on first run
}

main().catch(console.error);
