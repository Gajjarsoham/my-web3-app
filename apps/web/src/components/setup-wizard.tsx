
'use client';

import React from 'react';
import { useLazyTraderSetup } from '@/hooks/useLazyTraderSetup';
import { useAccount } from 'wagmi';
import { Loader2, CheckCircle, Smartphone, Bot, Settings, Rocket } from 'lucide-react';
import { clsx } from 'clsx';

import { CreateAgentResponse } from '@/types';

export function SetupWizard({ onComplete }: { onComplete: (result: CreateAgentResponse) => void }) {
    const { address } = useAccount();
    const setup = useLazyTraderSetup({
        userWallet: address,
        onComplete: (data) => onComplete(data),
    });

    const steps = [
        { id: 'agent', label: 'Generate Agent', icon: Bot },
        { id: 'telegram', label: 'Connect Telegram', icon: Smartphone },
        { id: 'preferences', label: 'Strategy', icon: Settings },
        { id: 'deploy', label: 'Deploy', icon: Rocket },
    ];

    if (!address) {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center max-w-md mx-auto animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 font-sans text-white">Connect Wallet</h2>
                <p className="text-forge-muted mb-6">Connect your wallet to start your journey with Ostium.</p>
                {/* Wallet button is external to this component usually, but we can hint at it */}
                <div className="animate-pulse-glow h-2 w-2 rounded-full bg-accent-cyan mx-auto"></div>
            </div>
        );
    }

    // Helper to determine active view based on setup state
    const getCurrentView = () => {
        if (setup.currentStep === 'idle') return 'start';
        if (setup.currentStep === 'agent') return 'link';
        if (setup.currentStep === 'telegram-link' || setup.currentStep === 'telegram-connect') return 'telegram-wait';
        if (setup.currentStep === 'create-agent') return 'config'; // 'create-agent' in hook means "ready to create", usually implies preferences next
        return 'loading';
    };

    // Note: The hook state machine is a bit implicit. 
    // idle -> (generateAgent) -> agent -> (generateLink) -> telegram-link -> (startPolling) -> create-agent -> (createAgent) -> complete

    return (
        <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
            {/* Progress Bar */}
            <div className="flex justify-between mb-12 relative px-10">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-forge-border -z-10 rounded-full"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-purple -z-10 rounded-full transition-all duration-500"
                    style={{ width: `${setup.currentStep === 'complete' ? 100 : (['idle', 'agent', 'telegram-link', 'telegram-connect', 'create-agent'].indexOf(setup.currentStep) + 1) * 20}%` }}
                ></div>

                {steps.map((s, i) => {
                    const isActive = i <= ['idle', 'agent', 'telegram-link', 'telegram-connect', 'create-agent', 'complete'].indexOf(setup.currentStep);

                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-forge-bg px-2">
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                isActive ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan shadow-[0_0_15px_rgba(0,212,255,0.3)]" : "border-forge-border text-forge-muted"
                            )}>
                                <s.icon size={18} />
                            </div>
                            <span className={clsx("text-xs font-mono uppercase tracking-wider", isActive ? "text-white" : "text-forge-muted")}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background ambient effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-cyan/5 to-accent-purple/5 pointer-events-none"></div>

                {setup.isCheckingSetup && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <Loader2 className="w-12 h-12 text-accent-cyan animate-spin mb-4" />
                        <p className="text-forge-text font-mono">Restoring session...</p>
                    </div>
                )}

                {!setup.isCheckingSetup && setup.currentStep === 'idle' && (
                    <div className="text-center max-w-lg animate-slide-up">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple mx-auto mb-6 flex items-center justify-center shadow-2xl">
                            <Bot className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Initialize Your AI Trader</h2>
                        <p className="text-forge-muted mb-8 leading-relaxed">
                            Deploy a specialized AI agent on Ostium. It will execute trades based on your preferences and Telegram signals.
                        </p>
                        <button
                            onClick={setup.generateAgent}
                            disabled={setup.isGeneratingAgent}
                            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {setup.isGeneratingAgent ? <Loader2 className="animate-spin" /> : 'Generate Agent Identity'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                )}

                {!setup.isCheckingSetup && setup.currentStep === 'agent' && (
                    <div className="text-center max-w-lg animate-slide-up">
                        <h2 className="text-2xl font-bold text-white mb-2">Agent Identity Created</h2>
                        <div className="bg-forge-elevated p-4 rounded-xl border border-forge-border font-mono text-sm text-accent-cyan mb-8 break-all">
                            {setup.agentAddress}
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-forge-muted">Next, link your Telegram account to control your agent remotely.</p>
                            <button
                                onClick={setup.generateLink}
                                disabled={setup.isGeneratingLink}
                                className="w-full py-4 bg-accent-cyan/10 border border-accent-cyan text-accent-cyan rounded-xl hover:bg-accent-cyan/20 transition-all font-bold"
                            >
                                {setup.isGeneratingLink ? <Loader2 className="animate-spin mx-auto" /> : 'Generate Telegram Link'}
                            </button>
                        </div>
                    </div>
                )}

                {!setup.isCheckingSetup && (setup.currentStep === 'telegram-link' || setup.currentStep === 'telegram-connect') && (
                    <div className="text-center max-w-lg animate-slide-up w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Connect Telegram</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-forge-elevated p-6 rounded-xl border border-forge-border flex flex-col items-center justify-center">
                                <p className="text-sm text-forge-muted mb-2">Verification Code</p>
                                <div className="text-4xl font-mono font-bold text-white tracking-[0.2em]">{setup.linkCode}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <a
                                    href={setup.deepLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setup.startPolling()}
                                    className="bg-[#229ED9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1f8dbf] transition-all flex items-center gap-2 w-full justify-center"
                                >
                                    <Smartphone size={20} />
                                    Open Telegram Bot
                                </a>
                                <p className="text-xs text-forge-muted">Click to open bot and start.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-sm text-forge-muted">
                            {setup.isPolling ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-accent-cyan" />
                                    Waiting for connection...
                                </>
                            ) : (
                                <button onClick={setup.startPolling} className="text-accent-cyan hover:underline">
                                    Check Connection Status
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!setup.isCheckingSetup && setup.currentStep === 'create-agent' && (
                    <div className="text-center max-w-lg animate-slide-up w-full">
                        <div className="flex items-center justify-center gap-2 mb-6 text-green-400">
                            <CheckCircle />
                            <span className="font-bold">Connected as @{setup.telegramUser?.username}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6">Strategy Configuration</h2>

                        <div className="space-y-6 mb-8 text-left">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm text-forge-text">Risk Tolerance</label>
                                    <span className="text-sm text-accent-cyan">{setup.tradingPreferences.risk_tolerance}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full h-2 bg-forge-elevated rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                                    min="0" max="100"
                                    value={setup.tradingPreferences.risk_tolerance}
                                    onChange={(e) => setup.setTradingPreferences({ ...setup.tradingPreferences, risk_tolerance: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm text-forge-text">Trade Frequency</label>
                                    <span className="text-sm text-accent-cyan">{setup.tradingPreferences.trade_frequency}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full h-2 bg-forge-elevated rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                                    min="0" max="100"
                                    value={setup.tradingPreferences.trade_frequency}
                                    onChange={(e) => setup.setTradingPreferences({ ...setup.tradingPreferences, trade_frequency: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={setup.createAgent}
                            disabled={setup.isCreatingAgent}
                            className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all hover:translate-y-[-2px]"
                        >
                            {setup.isCreatingAgent ? <Loader2 className="animate-spin mx-auto" /> : 'Deploy Agent'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
