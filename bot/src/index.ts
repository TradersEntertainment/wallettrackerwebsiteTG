import { Monitor } from './monitor';
import { startBot, sendAlert } from './telegram';
import { CONFIG } from './config';
import * as path from 'path';

async function main() {
    console.log('Starting Hyperliquid Bot...');
    startBot();

    // Fix path resolution for wallets.json - DEPRECATED
    // Using MongoDB

    const monitor = new Monitor();

    setInterval(async () => {
        console.log('Checking for updates...');
        const updates = await monitor.checkUpdates();

        for (const update of updates) {
            console.log(`Found updates for ${update.address}: ${update.changes.length} changes`);
            for (const change of update.changes) {
                await sendAlert(change, update.address, update.state.marginSummary.accountValue, update.name);
            }
        }
    }, CONFIG.CHECK_INTERVAL_MS);

    // Initial check
    console.log('Performing initial check...');
    await monitor.checkUpdates(); // Just to populate cache, or we can inhibit alerts on first run
}

main().catch(console.error);
