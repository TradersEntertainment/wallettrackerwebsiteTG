import React, { useState } from 'react';

interface AddWalletWizardProps {
    onCancel: () => void;
    onComplete: (data: { address: string; name: string; alerts: any; password?: string }) => void;
}

export default function AddWalletWizard({ onCancel, onComplete }: AddWalletWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: '',
        name: '',
        tags: '',
        alerts: {
            newPos: true,
            sizeChange: 5, // %
            leverage: 10,
            liqDist: 10 // %
        },
        password: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            {/* Stepper Header */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-card-border -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-background px-2 transition-colors ${step >= s ? 'text-primary' : 'text-text-secondary'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= s ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-card-bg border-card-border'}`}>
                            {s}
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            {s === 1 && 'Address'}
                            {s === 2 && 'Label'}
                            {s === 3 && 'Alerts'}
                            {s === 4 && 'Preview'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-8 rounded-xl border border-card-border shadow-2xl min-h-[400px] flex flex-col justify-between">

                {/* Step 1: Address */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Target Wallet</h2>
                        <div className="space-y-4">
                            <label className="block text-sm text-text-secondary uppercase tracking-wider">Wallet Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-black/30 border border-card-border rounded p-4 text-lg font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="0x..."
                                autoFocus
                            />
                            <p className="text-sm text-text-secondary">Enter the Hyperliquid address you want to track.</p>
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Identification</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-text-secondary uppercase tracking-wider mb-2">Label / Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/30 border border-card-border rounded p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="e.g. MSTR Whale"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Rules */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Alert Configuration</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded border border-card-border">
                                <span className="font-medium">New Position Opened</span>
                                <input
                                    type="checkbox"
                                    checked={formData.alerts.newPos}
                                    onChange={e => setFormData({ ...formData, alerts: { ...formData.alerts, newPos: e.target.checked } })}
                                    className="w-5 h-5 accent-primary"
                                />
                            </div>

                            <div className="p-4 bg-black/20 rounded border border-card-border">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Position Size Change {'>'} {formData.alerts.sizeChange}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="50" step="1"
                                    value={formData.alerts.sizeChange}
                                    onChange={e => setFormData({ ...formData, alerts: { ...formData.alerts, sizeChange: parseInt(e.target.value) } })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="p-4 bg-black/20 rounded border border-card-border">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Distance to Liq {'<'} {formData.alerts.liqDist}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="20" step="0.5"
                                    value={formData.alerts.liqDist}
                                    onChange={e => setFormData({ ...formData, alerts: { ...formData.alerts, liqDist: parseFloat(e.target.value) } })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Preview */}
                {step === 4 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Confirm setup</h2>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Target</div>
                                <div className="text-xl font-bold">{formData.name || 'Unnamed'}</div>
                                <div className="text-sm font-mono text-text-secondary break-all">{formData.address}</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Active Rules</div>
                                <ul className="text-sm space-y-1">
                                    {formData.alerts.newPos && <li className="text-success">✓ New Position</li>}
                                    <li className="text-success">✓ Size Change &gt; {formData.alerts.sizeChange}%</li>
                                    <li className="text-success">✓ Dist to Liq &lt; {formData.alerts.liqDist}%</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-black/40 p-4 rounded border border-card-border mb-6">
                            <div className="text-xs text-text-secondary uppercase mb-2">Telegram Preview</div>
                            <div className="font-mono text-sm">
                                <div className="text-primary font-bold">🐳 {formData.name || 'Whale'} Update</div>
                                <div className="mt-1">BTC SHORT Opened</div>
                                <div>Size: $2.5M</div>
                            </div>
                        </div>

                        <div className="border-t border-card-border pt-6 mt-6">
                            <h3 className="text-lg font-bold mb-4">Security verification</h3>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 mb-4">
                                <p className="text-sm text-yellow-200">
                                    ⚠️ If you wanna add wallet you need to know the password. To learn the password you can write to the admin on telegram.
                                </p>
                            </div>

                            <label className="block text-sm text-text-secondary uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-black/30 border border-card-border rounded p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
                                placeholder="Enter password..."
                            />
                        </div>
                    </div>
                )}


                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t border-card-border mt-auto">
                    {step > 1 ? (
                        <button onClick={prevStep} className="px-6 py-2 text-text-secondary hover:text-white font-medium transition-colors">
                            ← Back
                        </button>
                    ) : (
                        <button onClick={onCancel} className="px-6 py-2 text-text-secondary hover:text-white font-medium transition-colors">
                            Cancel
                        </button>
                    )}

                    {step < 4 ? (
                        <button onClick={nextStep} disabled={step === 1 && !formData.address} className="px-8 py-2 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-bold shadow-lg shadow-blue-500/30 transition-all">
                            Next Step →
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="px-8 py-2 bg-success hover:bg-green-600 text-white rounded font-bold shadow-lg shadow-green-500/30 transition-all">
                            Start Tracking
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
