'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import WalletList from '../components/dashboard/WalletList';
import AddWalletWizard from '../components/wallet/AddWalletWizard';
import AlertConfig from '../components/settings/AlertConfig';
import TelegramPreview from '../components/telegram/TelegramPreview';
import PositionDetailModal from '../components/dashboard/PositionDetailModal';
import RiskRulesPage from '../components/dashboard/RiskRulesPage';
import LogsPage from '../components/dashboard/LogsPage';

interface Wallet {
  address: string;
  name?: string;
}

type ViewState = 'dashboard' | 'wallets' | 'alerts' | 'add-wallet' | 'risk' | 'logs' | 'api' | 'telegram';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Position Detail Modal
  const [detailedWallet, setDetailedWallet] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/wallets');
      const data = await res.json();
      if (Array.isArray(data)) setWallets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async (data: { address: string; name: string; password?: string }) => {
    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchWallets();
        setCurrentView('dashboard');
      } else if (res.status === 401) {
        alert('Incorrect password! Ask admin for access.');
      } else {
        alert('Failed to add wallet');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWallet = async (address: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/wallets?address=${address}`, { method: 'DELETE' });
      fetchWallets();
    } catch (e) { console.error(e); }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
      case 'wallets':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <WalletList
                wallets={wallets}
                loading={loading}
                onView={(addr) => setDetailedWallet(addr)}
                onCheck={(addr) => fetch('/api/wallets', { method: 'PATCH', body: JSON.stringify({ address: addr, forceUpdate: true }) })}
                onDelete={handleDeleteWallet}
                onAddClick={() => setCurrentView('add-wallet')}
              />
            </div>
            <div className="xl:col-span-1">
              <h3 className="text-xl font-bold mb-6">Live Activity</h3>
              <TelegramPreview />
            </div>

            {/* Modal */}
            {detailedWallet && (
              <PositionDetailModal
                address={detailedWallet}
                onClose={() => setDetailedWallet(null)}
              />
            )}
          </div>
        );
      case 'add-wallet':
        return (
          <AddWalletWizard
            onCancel={() => setCurrentView('dashboard')}
            onComplete={handleAddWallet}
          />
        );
      case 'alerts':
        return <AlertConfig />;
      case 'risk':
        return <RiskRulesPage />;
      case 'logs':
        return <LogsPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-text-secondary">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-bold">Module Under Construction</h2>
            <p>This feature will be available in the next release.</p>
          </div>
        );
    }
  };

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      onSettingsClick={() => setCurrentView('alerts')}
    >
      {renderContent()}
    </MainLayout>
  );
}
