import React from 'react';

interface Wallet {
    address: string;
    name?: string;
}

interface WalletCardProps {
    wallet: Wallet;
    onView: () => void;
    onCheck: () => void;
    onDelete: () => void;
}

export default function WalletCard({ wallet, onView, onCheck, onDelete }: WalletCardProps) {
    // Mock data for UI demo - in real app this would come from props or a hook
    const equity = Math.random() * 1000000 + 500000;
    const positionsCount = Math.floor(Math.random() * 5);
    const distToLiq = (Math.random() * 20 + 2).toFixed(1);
    const isDanger = parseFloat(distToLiq) < 5;

    return (
        <div className="glass-panel rounded-lg p-5 mb-4 hover:border-primary/40 transition-all duration-200 group relative overflow-hidden">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center relative z-10 gap-4 md:gap-0">

                {/* Left Section: Identity */}
                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground tracking-wide">{wallet.name || 'Unknown Whale'}</h3>
                        {isDanger && <span className="text-xs bg-danger/20 text-danger border border-danger/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">High Risk</span>}
                        {!isDanger && <span className="text-xs bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Healthy</span>}
                    </div>
                    <div className="font-mono text-sm text-text-secondary break-all md:break-normal">{wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}</div>
                </div>

                {/* Middle Section: Metrics */}
                <div className="flex-1 grid grid-cols-3 gap-2 md:flex md:gap-8 md:justify-center border-t md:border-t-0 border-b md:border-b-0 border-l-0 md:border-l md:border-r border-card-border py-4 md:py-0 md:px-8 my-2 md:my-0">
                    <div className="text-center">
                        <div className="text-[10px] md:text-xs text-text-secondary uppercase tracking-wider mb-1">Equity</div>
                        <div className="text-lg md:text-xl font-mono font-semibold text-foreground">${(equity / 1000000).toFixed(2)}M</div>
                    </div>
                    <div className="text-center border-l md:border-l-0 border-card-border md:border-0 pl-2 md:pl-0">
                        <div className="text-[10px] md:text-xs text-text-secondary uppercase tracking-wider mb-1">Positions</div>
                        <div className="text-lg md:text-xl font-mono font-semibold text-foreground">{positionsCount}</div>
                    </div>
                    <div className="text-center border-l md:border-l-0 border-card-border md:border-0 pl-2 md:pl-0">
                        <div className="text-[10px] md:text-xs text-text-secondary uppercase tracking-wider mb-1">Liq Dist</div>
                        <div className={`text-lg md:text-xl font-mono font-bold ${isDanger ? 'text-danger' : 'text-success'}`}>{distToLiq}%</div>
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex-1 flex justify-end gap-3 min-w-[200px] w-full md:w-auto">
                    <button onClick={onView} className="flex-1 md:flex-none px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded text-sm font-medium transition-colors text-center">
                        View
                    </button>
                    <button onClick={onCheck} className="flex-1 md:flex-none px-4 py-2 bg-card-bg hover:bg-card-border text-text-secondary border border-card-border rounded text-sm font-medium transition-colors text-center whitespace-nowrap">
                        Manual Check
                    </button>
                    <button onClick={onDelete} className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors" title="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Bottom Risk Bar / Sparkline Placeholder */}
            <div className="mt-4 pt-4 border-t border-card-border flex items-center gap-4">
                <div className="text-xs text-text-secondary">Risk Load:</div>
                <div className="h-1.5 flex-1 bg-card-border rounded-full overflow-hidden">
                    <div className={`h-full ${isDanger ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                </div>
                <div className="text-xs font-mono text-text-secondary">Last checked: 12s ago</div>
            </div>
        </div>
    );
}
