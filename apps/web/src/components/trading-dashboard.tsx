
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight, Activity, Wallet, History, Radio } from 'lucide-react';
import { clsx } from 'clsx';
import { CreateAgentResponse } from '@/types';

interface TradingDashboardProps {
    agentResult: CreateAgentResponse | null;
}

export function TradingDashboard({ agentResult }: TradingDashboardProps) {
    const [activeTab, setActiveTab] = useState<'markets' | 'positions'>('markets');

    // Mock data for markets
    const markets = [
        { pair: 'BTC/USD', price: 64231.45, change: 2.34, volume: '1.2B' },
        { pair: 'ETH/USD', price: 3452.12, change: -1.12, volume: '800M' },
        { pair: 'SOL/USD', price: 145.67, change: 5.45, volume: '250M' },
        { pair: 'ARB/USD', price: 1.12, change: 0.56, volume: '45M' },
    ];

    // Mock data for positions (simulated real-time updates)
    const [positions, setPositions] = useState([
        { id: 1, pair: 'ETH/USD', type: 'Long', entry: 3420.00, size: 5000, pnl: 125.45, pnlPercent: 2.5 },
        { id: 2, pair: 'BTC/USD', type: 'Short', entry: 65100.00, size: 2000, pnl: -45.20, pnlPercent: -0.8 },
    ]);

    // Simulate price ticks
    useEffect(() => {
        const interval = setInterval(() => {
            setPositions(prev => prev.map(p => ({
                ...p,
                pnl: p.pnl + (Math.random() - 0.5) * 10,
                pnlPercent: p.pnlPercent + (Math.random() - 0.5) * 0.1
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
            {/* Header containing Agent Status */}
            <div className="glass-panel rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="text-accent-cyan" />
                        Agent Status: <span className="text-green-400">Active</span>
                    </h2>
                    <p className="text-forge-muted text-sm font-mono mt-1">
                        {agentResult?.ostiumAgentAddress || '0x...'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-forge-elevated p-3 rounded-lg border border-forge-border">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-forge-muted uppercase">P&L (24h)</span>
                        <span className="text-lg font-bold text-green-400">+$124.50</span>
                    </div>
                    <div className="w-px h-8 bg-forge-border"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-forge-muted uppercase">Open Positions</span>
                        <span className="text-lg font-bold text-white">2</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market List */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Markets</h3>
                        <div className="flex gap-2">
                            <button
                                className={clsx("px-4 py-2 rounded-lg text-sm transition-colors", activeTab === 'markets' ? "bg-accent-cyan/20 text-accent-cyan" : "text-forge-muted hover:bg-forge-elevated")}
                                onClick={() => setActiveTab('markets')}
                            >
                                Oracles
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-forge-muted text-xs uppercase tracking-wider border-b border-forge-border">
                                    <th className="pb-4 pl-4">Pair</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">24h Change</th>
                                    <th className="pb-4">Volume</th>
                                    <th className="pb-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {markets.map((m, i) => (
                                    <tr key={i} className="border-b border-forge-border/50 group hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 font-bold">{m.pair}</td>
                                        <td className="py-4 font-mono">${m.price.toLocaleString()}</td>
                                        <td className={clsx("py-4 flex items-center gap-1", m.change >= 0 ? "text-green-400" : "text-red-400")}>
                                            {m.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            {Math.abs(m.change)}%
                                        </td>
                                        <td className="py-4 text-forge-muted">{m.volume}</td>
                                        <td className="py-4">
                                            <button className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-xs rounded hover:bg-accent-cyan/20 transition-colors">
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Positions / Recent Activity */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <History size={20} />
                        Active Positions
                    </h3>

                    <div className="space-y-4">
                        {positions.map((p) => (
                            <div key={p.id} className="bg-forge-elevated p-4 rounded-xl border border-forge-border hover:border-accent-cyan/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white">{p.pair}</span>
                                    <span className={clsx("text-xs px-2 py-0.5 rounded", p.type === 'Long' ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400")}>
                                        {p.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-forge-muted">Entry: ${p.entry}</div>
                                        <div className="text-xs text-forge-muted">Size: ${p.size}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={clsx("font-bold font-mono", p.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                                            {p.pnl >= 0 ? '+' : ''}{p.pnl.toFixed(2)}
                                        </div>
                                        <div className={clsx("text-xs", p.pnlPercent >= 0 ? "text-green-400" : "text-red-400")}>
                                            {p.pnlPercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {positions.length === 0 && (
                            <div className="text-center py-8 text-forge-muted text-sm">
                                No active positions.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-forge-border">
                        <h4 className="text-sm font-bold text-forge-text mb-4">Recent Signals (Telegram)</h4>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-accent-purple mt-1.5 shrink-0"></div>
                                <p className="text-xs text-forge-muted leading-relaxed">
                                    <span className="text-accent-purple font-bold">@OstiumBot</span> detected bullish divergence on ETH/USD. Executing long entry.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-accent-cyan mt-1.5 shrink-0"></div>
                                <p className="text-xs text-forge-muted leading-relaxed">
                                    Strategy rebalanced: Reduced risk exposure due to high volatility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
