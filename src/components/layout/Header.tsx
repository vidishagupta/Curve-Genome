'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import {
  GitBranch,
  GitFork,
  Rocket,
  Share2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

interface HeaderProps {
  activeGenome: GenomeConfig;
  onFork: () => void;
  onDeploy: () => void;
  onExport: () => void;
  network: 'devnet' | 'mainnet-beta';
  onToggleNetwork: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGenome,
  onFork,
  onDeploy,
  onExport,
  network,
  onToggleNetwork,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-300/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Active Genome */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-purple shadow-lg shadow-brand-cyan/20">
              <Zap className="h-5 w-5 text-black font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white">
                  CURVE<span className="text-brand-cyan">GENOME</span>
                </span>
                <span className="rounded bg-surface-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-cyan border border-brand-cyan/30">
                  METEORA DBC
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
                Dynamic Bonding Curve Engine & Lab
              </p>
            </div>
          </div>

          <div className="hidden h-6 w-px bg-surface-border md:block" />

          {/* Current Genome Lineage Badge */}
          <div className="hidden items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 border border-surface-border md:flex">
            <GitBranch className="h-3.5 w-3.5 text-brand-purple" />
            <span className="text-xs font-medium text-white max-w-[130px] truncate">
              {activeGenome.name}
            </span>
            <span className="rounded bg-surface-200 px-1.5 py-0.2 text-[10px] font-mono text-gray-400">
              v{activeGenome.version}
            </span>
            <span className="font-mono text-[10px] text-brand-cyan">
              #{activeGenome.hash.substring(0, 6)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Devnet/Mainnet toggle */}
          <button
            onClick={onToggleNetwork}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium border transition-colors ${
              network === 'devnet'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-green/20'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span className="capitalize">{network}</span>
          </button>

          {/* Fork Genome */}
          <button
            onClick={onFork}
            className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-gray-200 border border-surface-border hover:bg-surface-50 hover:border-brand-purple hover:text-white transition-all shadow-sm"
          >
            <GitFork className="h-3.5 w-3.5 text-brand-purple" />
            <span className="hidden sm:inline">Fork</span>
          </button>

          {/* Export / Share */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-gray-200 border border-surface-border hover:bg-surface-50 hover:text-white transition-all"
            title="Export Manifest / SDK Snippet"
          >
            <Share2 className="h-3.5 w-3.5 text-brand-teal" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Launch / Deploy to Meteora */}
          <button
            onClick={onDeploy}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-3.5 py-1.5 text-xs font-bold text-black shadow-md hover:opacity-95 hover:shadow-brand-cyan/25 transition-all"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Launch DBC</span>
          </button>

          {/* Solana Wallet Button */}
          <div className="scale-90 origin-right">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </header>
  );
};
