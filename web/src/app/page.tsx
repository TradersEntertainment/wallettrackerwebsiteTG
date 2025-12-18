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
        alert('Failed to add wallet');
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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Hyperliquid Watcher 🐳</h1>

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
                  <button
                    onClick={() => deleteWallet(w.address)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Remove
                  </button>
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
