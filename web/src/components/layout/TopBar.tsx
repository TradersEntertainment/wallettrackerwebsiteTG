import React from 'react';

interface TopBarProps {
    onSettingsClick: () => void;
}

export default function TopBar({ onSettingsClick }: TopBarProps) {
    return (
        <header className="h-16 bg-background/95 backdrop-blur border-b border-card-border flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-20">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🐳</span>
                    <span className="font-bold text-lg tracking-tight">Hyperliquid <span className="text-text-secondary font-normal">Watcher</span></span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="text-xs font-semibold text-primary tracking-wide">MAINNET</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-success bg-success/10 px-3 py-1 rounded border border-success/20">
                    <span>Telegram Connected</span>
                    <span>✓</span>
                </div>

                <button
                    onClick={onSettingsClick}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-text-secondary hover:text-foreground"
                    title="Settings"
                >
                    ⚙️
                </button>
            </div>
        </header>
    );
}
