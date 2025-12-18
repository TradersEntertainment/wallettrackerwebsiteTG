import axios from 'axios';
import { ClearinghouseState, AssetCtx } from './types';

const INFO_API_URL = 'https://api.hyperliquid.xyz/info';

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

export async function getMeta(): Promise<any> {
    try {
        const response = await axios.post(INFO_API_URL, {
            type: "meta"
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching meta:", error);
        throw error;
    }
}
