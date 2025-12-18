import React from 'react';

export default function TelegramPreview() {
    return (
        <div className="border border-card-border rounded-lg overflow-hidden bg-[#0E1625]">
            <div className="bg-[#17212B] px-4 py-2 flex items-center justify-between border-b border-black/20">
                <span className="text-xs font-bold text-gray-400">TELEGRAM PREVIEW</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <div className="p-4 space-y-4 font-mono text-xs md:text-sm h-full bg-[url('/tg-bg-pattern.png')] bg-opacity-5">
                {/* Message 1 */}
                <div className="bg-[#182533] p-3 rounded-lg border border-[#2B5278] shadow-sm max-w-[90%]">
                    <div className="text-primary font-bold mb-1 flex items-center gap-2">
                        <span>🐳 MSTR Whale Update</span>
                    </div>
                    <div className="space-y-1 text-gray-300">
                        <div className="flex justify-between">
                            <span className="text-red-400 font-bold">BTC SHORT</span>
                            <span className="text-gray-500">Just now</span>
                        </div>
                        <div>Size: <span className="text-white font-bold">$16.95M</span> (40x)</div>
                        <div>Entry: <span className="text-white">87,987.4</span></div>
                        <div>Dist. to Liq: <span className="text-orange-400">5.2%</span></div>
                        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between text-xs text-gray-500">
                            <span>Equity: $1.10M</span>
                        </div>
                    </div>
                </div>

                {/* Message 2 */}
                <div className="bg-[#182533] p-3 rounded-lg border border-[#2B5278] shadow-sm max-w-[90%] opacity-60">
                    <div className="text-primary font-bold mb-1 flex items-center gap-2">
                        <span>🐳 Whale #4 Update</span>
                    </div>
                    <div className="space-y-1 text-gray-300">
                        <div className="flex justify-between">
                            <span className="text-green-400 font-bold">ETH LONG</span>
                            <span className="text-gray-500">12m ago</span>
                        </div>
                        <div>Size: <span className="text-white font-bold">$2.1M</span> (10x)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
