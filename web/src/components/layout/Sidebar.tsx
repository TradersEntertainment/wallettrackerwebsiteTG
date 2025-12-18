import React from 'react';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
    const items: { id: string; label: string; icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'wallets', label: 'Wallets', icon: '💳' },
        { id: 'alerts', label: 'Alerts', icon: '🔔' },
        { id: 'risk', label: 'Risk Rules', icon: '⚡' },
        { id: 'logs', label: 'Logs', icon: '📝' },
        { id: 'api', label: 'API', icon: '🔌' },
        { id: 'telegram', label: 'Telegram Preview', icon: '✈️' },
    ];

    return (
        <aside className="w-64 bg-card-bg border-r border-card-border flex flex-col h-screen fixed left-0 top-0 z-30">
            <div className="p-6 border-b border-card-border">
                <h2 className="text-xl font-bold tracking-wider text-primary">HL WATCHER</h2>
                <div className="text-xs text-text-secondary mt-1">INSTITUTIONAL GRADE</div>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                {items.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                                    : 'text-text-secondary hover:bg-white/5 hover:text-foreground'
                                }
              `}
                        >
                            <span className="text-lg opacity-80">{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-card-border">
                <div className="bg-black/20 p-3 rounded text-xs text-text-secondary">
                    <div className="flex justify-between mb-1">
                        <span>Status</span>
                        <span className="text-success">Operational</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Latency</span>
                        <span className="text-primary">24ms</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
