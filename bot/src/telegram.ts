import { Telegraf } from 'telegraf';
import { PositionChange, Position } from './types';
import { CONFIG } from './config';

const bot = new Telegraf(CONFIG.TELEGRAM_BOT_TOKEN);

export function startBot() {
    bot.launch().then(() => {
        console.log('Telegram bot started');
    }).catch(err => {
        console.error('Failed to start Telegram bot:', err);
    });
}

function formatCurrency(value: string | number): string {
    const v = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(v)) return '$0.00';
    if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(2)}M`;
    if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(2)}K`;
    return `$${v.toFixed(2)}`;
}

function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
}

function shortenAddress(address: string): string {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export async function sendAlert(change: PositionChange, address: string, equity: string, name?: string) {
    if (!CONFIG.TELEGRAM_CHANNEL_ID) return;

    let message = '';
    const coin = change.coin;
    const pos = change.newPosition || change.oldPosition; // fallback
    if (!pos) return;

    const sizeVal = parseFloat(pos.positionValue);
    const side = parseFloat(pos.szi) > 0 ? 'LONG' : 'SHORT';
    const isWin = parseFloat(pos.unrealizedPnl) >= 0;
    const pnlEmoji = isWin ? '🤑' : '😭';

    // Distance to Liq
    let distToLiq = 0;
    if (pos.liquidationPx) {
        // Approximate mark price from position value / size (if available) or assume user knows logic
        // For accurate dist, we need Mark Price. We can infer it or fetch it.
        // positionValue approx = abs(szi) * markPx.
        const markPx = parseFloat(pos.positionValue) / Math.abs(parseFloat(pos.szi));
        distToLiq = Math.abs(markPx - parseFloat(pos.liquidationPx)) / markPx;
    }
    const distStr = pos.liquidationPx ? formatPercentage(distToLiq) : 'N/A';

    // Header based on event type
    switch (change.type) {
        case 'NEW':
            message += `🚨 NEW ${side} POSITION OPENED 🚀\n`;
            break;
        case 'INCREASE':
            message += `📈 POSITION INCREASED FOR ${coin} ${side}\n`;
            break;
        case 'DECREASE':
            message += `📉 POSITION DECREASED FOR ${coin} ${side}\n`;
            break;
        case 'CLOSE':
            message += `🚪 POSITION CLOSED FOR ${coin} ${side}\n`;
            break;
        case 'LIQUIDATION':
            message += `☠️ LIQUIDATION ALERT FOR ${coin} ${side} 💀\n`;
            break;
        default:
            message += `⚠️ POSITION UPDATE FOR ${coin}\n`;
    }

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `👑 Whale: ${name ? `**${name}**` : ''} \`${shortenAddress(address)}\`\n`;
    if (change.newPosition) {
        message += `💎 Size: ${formatCurrency(change.newPosition.positionValue)}\n`;
        message += `⚡ Leverage: ${change.newPosition.leverage.value}x\n`;
        message += `💰 uPnL: ${pnlEmoji} ${formatCurrency(change.newPosition.unrealizedPnl)}\n`;
        message += `🏦 Equity: ${formatCurrency(equity)}\n`;
        message += `📊 Entry: ${parseFloat(change.newPosition.entryPx).toFixed(2)}\n`;
        message += `💀 Liquidation: ${change.newPosition.liquidationPx ? parseFloat(change.newPosition.liquidationPx).toFixed(2) : 'None'}\n`;
        message += `🎯 Distance to Liq: ${distStr}\n`;
    } else if (change.oldPosition) {
        // Reviewing closed position
        message += `💎 Closed Size: ${formatCurrency(change.oldPosition.positionValue)}\n`;
        message += `💰 Final PnL: ${formatCurrency(change.pnl || 0)}\n`;
    }

    message += `🔗 [View on Hypurrscan](https://hypurrscan.io/address/${address})\n`;
    message += `#${coin}`;

    try {
        await bot.telegram.sendMessage(CONFIG.TELEGRAM_CHANNEL_ID, message, { parse_mode: 'Markdown' });
    } catch (e) {
        console.error("Failed to send telegram message:", e);
    }
}

export async function sendStatusReport(state: any, address: string, name?: string) {
    if (!CONFIG.TELEGRAM_CHANNEL_ID) return;

    let message = `📋 **MANUAL STATUS REPORT** 📋\n`;
    message += `👑 Whale: ${name ? `**${name}**` : ''} \`${shortenAddress(address)}\`\n`;
    message += `🏦 Equity: ${formatCurrency(state.crossMarginSummary.accountValue)}\n`;
    message += `━━━━━━━━━━━━━━━━\n`;

    if (state.assetPositions.length === 0) {
        message += `💤 No open positions.\n`;
    } else {
        for (const p of state.assetPositions) {
            const pos = p.position;
            const sizeVal = parseFloat(pos.positionValue);
            if (sizeVal <= 1) continue; // Ignore dust

            const side = parseFloat(pos.szi) > 0 ? 'LONG' : 'SHORT';
            const isWin = parseFloat(pos.unrealizedPnl) >= 0;
            const pnlEmoji = isWin ? '🤑' : '😭';

            // Distance to Liq
            let distToLiq = 0;
            let distStr = 'N/A';
            if (pos.liquidationPx) {
                const markPx = parseFloat(pos.positionValue) / Math.abs(parseFloat(pos.szi));
                distToLiq = Math.abs(markPx - parseFloat(pos.liquidationPx)) / markPx;
                distStr = formatPercentage(distToLiq);
            }

            message += `🔹 **${pos.coin} ${side}**\n`;
            message += `   💎 Size: ${formatCurrency(pos.positionValue)} (${pos.leverage.value}x)\n`;
            message += `   💰 uPnL: ${pnlEmoji} ${formatCurrency(pos.unrealizedPnl)}\n`;
            message += `   📊 Entry: ${parseFloat(pos.entryPx).toFixed(4)}\n`;
            message += `   🎯 Dist. to Liq: ${distStr}\n\n`;
        }
    }

    message += `🔗 [View on Hypurrscan](https://hypurrscan.io/address/${address})`;

    try {
        await bot.telegram.sendMessage(CONFIG.TELEGRAM_CHANNEL_ID, message, { parse_mode: 'Markdown' });
    } catch (e) {
        console.error("Failed to send telegram message:", e);
    }
}

