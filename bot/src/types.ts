
export interface Position {
    coin: string;
    szi: string; // Size (e.g., "18.17")
    leverage: {
        type: "cross" | "isolated";
        value: number;
    };
    entryPx: string;
    positionValue: string;
    unrealizedPnl: string;
    returnOnEquity: string;
    liquidationPx: string | null;
    marginUsed: string;
    maxLeverage: number;
    cumFunding: {
        allTime: string;
        sinceOpen: string;
        sinceChange: string;
    };
}

export interface AssetCtx {
    coin: string;
    markPx: string;
    midPx: string;
    dayNtlVlm: string;
    prevDayPx: string;
    funding: string;
    openInterest: string;
    oraclePx: string;
}

export interface ClearinghouseState {
    marginSummary: {
        accountValue: string;
        totalMarginUsed: string;
        totalNtlPos: string;
        totalRawUsd: string;
    };
    crossMarginSummary: {
        accountValue: string;
        totalMarginUsed: string;
        totalNtlPos: string;
        totalRawUsd: string;
    };
    crossMaintenanceMarginUsed: string;
    withdrawable: string;
    assetPositions: {
        position: Position;
        type: string;
    }[];
    time: number;
}

export interface WalletWatch {
    address: string;
    name?: string;
    group?: string;
}

export interface PositionChange {
    type: 'NEW' | 'INCREASE' | 'DECREASE' | 'CLOSE' | 'LIQUIDATION' | 'RISK_CHANGE';
    coin: string;
    oldPosition?: Position;
    newPosition?: Position;
    pnl?: number;
    deltaSize?: number;
    roi?: number;
}
