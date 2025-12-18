import React, { useEffect, useState } from 'react';

interface Position {
    coin: string;
    side: 'LONG' | 'SHORT';
    size: number;
    positionValue: number;
    entryPx: number;
    markPx: number;
    liquidationPx: number | null;
    pnl: number;
    returnOnEquity: number;
}

interface PositionDetailModalProps {
    address: string;
    onClose: () => void;
}

export default function PositionDetailModal({ address, onClose }: PositionDetailModalProps) {
    const [positions, setPositions] = useState<Position[]>([]);
    const [accountValue, setAccountValue] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Ensure we handle potential errors gracefully
                const res = await fetch(`/api/positions?address=${address}`);
                if (!res.ok) throw new Error('Failed to fetch positions');

                const data = await res.json();
                if (data.positions) {
                    setPositions(data.positions);
                    setAccountValue(data.accountValue || 0);
                } else {
                    setPositions([]);
                }
            } catch (err) {
                console.error(err);
                setError('Could not load position data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [address]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl flex flex-col shadow-2xl border border-card-border animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-card-border flex justify-between items-center bg-black/20">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Wallet Positions</h2>
                        <div className="font-mono text-sm text-text-secondary mt-1">{address}</div>
                    </div>
                    <div className="flex items-center gap-6">
                        {accountValue > 0 && (
                            <div className="text-right hidden sm:block">
                                <div className="text-xs text-text-secondary uppercase tracking-wider">Total Equity</div>
                                <div className="text-xl font-mono font-bold text-success">${accountValue.toLocaleString()}</div>
                            </div>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-text-secondary animate-pulse">Scanning chain data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="text-danger text-4xl mb-4">⚠️</div>
                            <p className="text-white font-medium">{error}</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm">Close</button>
                        </div>
                    ) : positions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-card-border rounded-lg bg-white/5">
                            <div className="text-text-secondary text-4xl mb-4">🧊</div>
                            <h3 className="text-lg font-medium text-white">No Open Positions</h3>
                            <p className="text-sm text-text-secondary mt-1">This wallet is currently flat.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-text-secondary uppercase tracking-wider border-b border-card-border">
                                        <th className="p-4 font-medium">Asset</th>
                                        <th className="p-4 font-medium">Side</th>
                                        <th className="p-4 font-medium">Size (USD)</th>
                                        <th className="p-4 font-medium">Entry Price</th>
                                        <th className="p-4 font-medium">Mark Price</th>
                                        <th className="p-4 font-medium">Liq. Price</th>
                                        <th className="p-4 font-medium text-right">PnL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-card-border">
                                    {positions.map((pos, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 font-bold text-white group-hover:text-primary transition-colors">{pos.coin}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${pos.side === 'LONG' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                                                    {pos.side}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-white">${pos.positionValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="p-4 font-mono text-text-secondary">{pos.entryPx.toLocaleString()}</td>
                                            <td className="p-4 font-mono text-text-secondary">{pos.markPx?.toLocaleString() || '-'}</td>
                                            <td className="p-4 font-mono text-orange-400">{pos.liquidationPx ? pos.liquidationPx.toLocaleString() : '∞'}</td>
                                            <td className={`p-4 font-mono font-bold text-right ${pos.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                <div className="text-xs opacity-70">
                                                    ({(pos.returnOnEquity * 100).toFixed(2)}%)
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-card-border text-center text-xs text-text-secondary">
                    Data provided by Hyperliquid • Auto-refreshes every 60s (impl.)
                </div>
            </div>
        </div>
    );
}
