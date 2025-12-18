'use client';

import { useState, useEffect } from 'react';

interface Wallet {
  address: string;
  name?: string;
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    minPositionValueUsd: 10,
    minPositionChangePercent: 0.01,
    notifyOnClose: true,
    notifyOnLiq: true
  });

  // Position Viewer State
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [accountValue, setAccountValue] = useState<number>(0);
  const [loadingPositions, setLoadingPositions] = useState(false);

  useEffect(() => {
    fetchWallets();
    fetchSettings();
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

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && !data.error) {
        setSettings({
          minPositionValueUsd: data.minPositionValueUsd ?? 10,
          minPositionChangePercent: data.minPositionChangePercent ?? 0.01,
          notifyOnClose: data.notifyOnClose ?? true,
          notifyOnLiq: data.notifyOnLiq ?? true
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved!');
        setShowSettings(false);
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    }
  }


  const viewPositions = async (address: string) => {
    setSelectedWallet(address);
    setLoadingPositions(true);
    setPositions([]);
    try {
      const res = await fetch(`/api/positions?address=${address}`);
      const data = await res.json();
      if (data.positions) {
        setPositions(data.positions);
        setAccountValue(data.accountValue);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to fetch positions');
    } finally {
      setLoadingPositions(false);
    }
  };

  const addWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;

    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress, name: newName }),
      });
      if (res.ok) {
        setNewAddress('');
        setNewName('');
        fetchWallets();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add wallet');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWallet = async (address: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;
    try {
      const res = await fetch(`/api/wallets?address=${address}`, { method: 'DELETE' });
      if (res.ok) fetchWallets();
    } catch (e) {
      console.error(e);
    }
  }

  const checkUpdate = async (address: string) => {
    try {
      const res = await fetch('/api/wallets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, forceUpdate: true }),
      });
      if (res.ok) {
        alert('Check triggered! Bot will send a report momentarily.');
      } else {
        alert('Failed to trigger check.');
      }
    } catch (e) {
      console.error(e);
      alert('Error triggering check.');
    }
  }


  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Hyperliquid Watcher 🐳</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
          >
            ⚙️ Settings
          </button>
        </div>

        {showSettings && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4">Global Settings</h2>
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Min Position Value ($)</label>
                <input
                  type="number"
                  value={settings.minPositionValueUsd}
                  onChange={e => setSettings({ ...settings, minPositionValueUsd: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Ignore positions smaller than this value.</p>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Min Position Change (%)</label>
                <input
                  type="number"
                  step="0.001"
                  value={settings.minPositionChangePercent}
                  onChange={e => setSettings({ ...settings, minPositionChangePercent: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Example: 0.05 = 5%. Ignore small size changes.</p>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnClose}
                    onChange={e => setSettings({ ...settings, notifyOnClose: e.target.checked })}
                  />
                  Notify on Close
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnLiq}
                    onChange={e => setSettings({ ...settings, notifyOnLiq: e.target.checked })}
                  />
                  Notify on Liquidation
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Save Settings</button>
              </div>
            </form>
          </div>
        )}

        {selectedWallet && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Open Positions</h2>
                <button onClick={() => setSelectedWallet(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>

              <div className="mb-4 text-gray-300">
                <span className="text-sm">Wallet: </span><code className="bg-gray-700 px-2 py-1 rounded text-xs">{selectedWallet}</code>
                {accountValue > 0 && <span className="ml-4 font-semibold text-green-400">Equity: ${accountValue.toLocaleString()}</span>}
              </div>

              {loadingPositions ? (
                <p className="text-center py-8">Loading positions...</p>
              ) : positions.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No open positions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-4 py-2">Coin</th>
                        <th className="px-4 py-2">Side</th>
                        <th className="px-4 py-2">Size</th>
                        <th className="px-4 py-2">Value</th>
                        <th className="px-4 py-2">Entry</th>
                        <th className="px-4 py-2">PnL</th>
                        <th className="px-4 py-2">Liq</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="px-4 py-2 font-bold text-white">{pos.coin}</td>
                          <td className={`px-4 py-2 font-bold ${pos.side === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>{pos.side}</td>
                          <td className="px-4 py-2">{pos.size.toFixed(2)}</td>
                          <td className="px-4 py-2">${pos.positionValue.toLocaleString()}</td>
                          <td className="px-4 py-2">{pos.entryPx.toFixed(4)}</td>
                          <td className={`px-4 py-2 font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">{pos.liquidationPx ? pos.liquidationPx.toFixed(4) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Monitored Wallets</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {wallets.length === 0 && <p className="text-gray-400">No wallets added yet.</p>}
              {wallets.map((w) => (
                <div key={w.address} className="flex justify-between items-center bg-gray-700 p-4 rounded border border-gray-600">
                  <div>
                    <p className="font-bold text-lg">{w.name || 'Unnamed'}</p>
                    <a
                      href={`https://hypurrscan.io/address/${w.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-300 hover:underline font-mono"
                    >
                      {w.address}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewPositions(w.address)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => checkUpdate(w.address)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Check
                    </button>
                    <button
                      onClick={() => deleteWallet(w.address)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Wallet</h2>
          <form onSubmit={addWallet} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Wallet Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Name (Optional)</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Whale #3"
              />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition mt-2">
              Add to Watchlist
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
