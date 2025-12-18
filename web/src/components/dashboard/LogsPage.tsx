import React, { useEffect, useState } from 'react';

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    source: string;
    message: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'ERROR'>('ALL');

    useEffect(() => {
        fetch('/api/logs')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === 'ERROR');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">System Logs</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'ALL' ? 'bg-primary text-white' : 'bg-card-bg text-text-secondary'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('ERROR')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'ERROR' ? 'bg-danger text-white' : 'bg-card-bg text-text-secondary'}`}
                    >
                        Errors Only
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-lg overflow-hidden border border-card-border">
                <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-black/20 text-text-secondary text-xs uppercase">
                        <tr>
                            <th className="p-3">Time</th>
                            <th className="p-3">Level</th>
                            <th className="p-3">Source</th>
                            <th className="p-3 w-1/2">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center">Loading logs...</td></tr>
                        ) : filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 text-text-secondary">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.level === 'ERROR' ? 'bg-danger/20 text-danger' :
                                            log.level === 'WARN' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {log.level}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-300">{log.source}</td>
                                <td className="p-3 text-gray-400">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
