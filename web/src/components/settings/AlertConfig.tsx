import React from 'react';

export default function AlertConfig() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Global Alert Rules</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-lg border border-card-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Position Monitoring</h3>
                        <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">ACTIVE</div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">New Position Opened</span>
                            <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Position Closed</span>
                            <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-text-secondary">Min Size Change</span>
                                <span className="font-mono text-primary">5%</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg border border-card-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Risk & PnL</h3>
                        <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">ACTIVE</div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-text-secondary">Liquidation Proximity</span>
                                <span className="font-mono text-danger">&lt; 10%</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-text-secondary">Leverage Alert</span>
                                <span className="font-mono text-orange-400">&gt; 20x</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
