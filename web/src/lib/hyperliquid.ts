
import axios from 'axios';

const INFO_API_URL = 'https://api.hyperliquid.xyz/info';

export interface Position {
    coin: string;
    szi: string;
    leverage: { type: string; value: number };
    entryPx: string;
    positionValue: string;
    unrealizedPnl: string;
    liquidationPx: string | null;
}

export interface ClearinghouseState {
    assetPositions: { position: Position }[];
    crossMarginSummary: { accountValue: string };
}

export async function getClearinghouseState(user: string): Promise<ClearinghouseState> {
    try {
        const response = await axios.post(INFO_API_URL, {
            type: "clearinghouseState",
            user: user
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching clearinghouse state for ${user}:`, error);
        throw error;
    }
}
