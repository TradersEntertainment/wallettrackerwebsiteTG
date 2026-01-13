import React from 'react';

interface TopBarProps {
    onSettingsClick: () => void;
    onMenuClick: () => void;
}

export default function TopBar({ onSettingsClick, onMenuClick }: TopBarProps) {
    return (
        <header className="h-16 bg-background/95 backdrop-blur border-b border-card-border flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 md:left-64 right-0 z-20 transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Mobile Hamburger */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-1 text-text-secondary hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-2xl">🐳</span>
                    <span className="font-bold text-lg tracking-tight hidden sm:inline">Hyperliquid <span className="text-text-secondary font-normal">Watcher</span></span>
                    <span className="font-bold text-lg tracking-tight sm:hidden">HL <span className="text-text-secondary font-normal">Watcher</span></span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="text-[10px] md:text-xs font-semibold text-primary tracking-wide">MAINNET</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-sm text-success bg-success/10 px-3 py-1 rounded border border-success/20">
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
