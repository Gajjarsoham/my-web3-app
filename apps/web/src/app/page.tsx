
'use client';

import { useState } from 'react';
import { WalletButton } from '@/components/wallet-button';
import { SetupWizard } from '@/components/setup-wizard';
import { TradingDashboard } from '@/components/trading-dashboard';
import { CreateAgentResponse } from '@/types';
import { LayoutDashboard, Zap } from 'lucide-react';

export default function Home() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [agentResult, setAgentResult] = useState<CreateAgentResponse | null>(null);

  const handleSetupComplete = (result: CreateAgentResponse) => {
    setAgentResult(result);
    setIsSetupComplete(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center relative">
      {/* Top Navigation Bar */}
      <nav className="w-full h-20 border-b border-forge-border/50 bg-forge-bg/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-xl flex items-center justify-center shadow-lg shadow-accent-cyan/20">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Ostium <span className="text-forge-muted font-normal">Trading</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-forge-muted">
            <a href="#" className="hover:text-white transition-colors">Markets</a>
            <a href="#" className="hover:text-white transition-colors">Governance</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="h-6 w-px bg-forge-border hidden md:block"></div>
          <WalletButton />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {!isSetupComplete ? (
          <div className="w-full max-w-5xl animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight">
                Trade Intelligent.
              </h1>
              <p className="text-xl text-forge-muted max-w-2xl mx-auto leading-relaxed">
                Deploy AI-powered trading agents on Ostium. Automate your strategy with decentralized execution and real-time Telegram integration.
              </p>
            </div>

            <SetupWizard onComplete={(res) => handleSetupComplete(res)} />
          </div>
        ) : (
          <TradingDashboard agentResult={agentResult} />
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-forge-border/30 text-center text-forge-muted text-sm relative z-10 bg-forge-bg">
        <p>© 2024 Ostium Trading. Decentralized & Non-Custodial.</p>
      </footer>
    </main>
  );
}
