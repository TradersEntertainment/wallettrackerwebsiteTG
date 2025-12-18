import React from 'react';

export default function RiskRulesPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-danger">⚡</span> Risk Management Rules
            </h2>

            <div className="glass-panel p-6 rounded-lg border border-card-border mb-6">
                <h3 className="text-lg font-bold mb-4">Portfolio Protection</h3>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Max Account Drawdown (Daily)</label>
                            <span className="font-mono text-danger font-bold">5.0%</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-danger" defaultValue={50} />
                        <p className="text-xs text-text-secondary mt-1">If equity drops by this amount in 24h, all positions will be closed.</p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Max Leverage Cap</label>
                            <span className="font-mono text-primary font-bold">20x</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" defaultValue={40} />
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-lg border border-card-border">
                <h3 className="text-lg font-bold mb-4">Emergency Controls</h3>
                <div className="flex items-center justify-between bg-danger/10 p-4 rounded border border-danger/30">
                    <div>
                        <h4 className="font-bold text-danger">⚠️ Emergency Flatten</h4>
                        <p className="text-sm text-text-secondary">Immediately close all positions across all tracked wallets.</p>
                    </div>
                    <button onClick={() => alert('Emergency Protocol Triggered!')} className="px-4 py-2 bg-danger hover:bg-red-600 text-white font-bold rounded shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                        EXECUTE
                    </button>
                </div>
            </div>
        </div>
    );
}
