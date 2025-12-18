import React from 'react';
import WalletCard from './WalletCard';

interface Wallet {
    address: string;
    name?: string;
}

interface WalletListProps {
    wallets: Wallet[];
    loading: boolean;
    onView: (address: string) => void;
    onCheck: (address: string) => void;
    onDelete: (address: string) => void;
    onAddClick: () => void;
}

export default function WalletList({ wallets, loading, onView, onCheck, onDelete, onAddClick }: WalletListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-card-bg/50 animate-pulse rounded-lg border border-card-border"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Active Watchlist</h2>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded font-medium shadow-lg shadow-blue-500/20 transition-all border border-blue-400"
                >
                    <span>+</span> Add Wallet
                </button>
            </div>

            {wallets.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-card-border rounded-lg bg-card-bg/30">
                    <div className="text-4xl mb-4">🐳</div>
                    <h3 className="text-lg font-medium text-text-secondary">No wallets tracked yet</h3>
                    <p className="text-sm text-gray-500 mt-2">Add a wallet to start monitoring positions and risk.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {wallets.map(wallet => (
                        <WalletCard
                            key={wallet.address}
                            wallet={wallet}
                            onView={() => onView(wallet.address)}
                            onCheck={() => onCheck(wallet.address)}
                            onDelete={() => onDelete(wallet.address)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
