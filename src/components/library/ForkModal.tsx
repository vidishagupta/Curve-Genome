'use client';

import React, { useState } from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { forkGenome } from '@/lib/genome/storage';
import { GitFork, X } from 'lucide-react';

interface ForkModalProps {
  parentGenome: GenomeConfig;
  onClose: () => void;
  onForkCreated: (newGenome: GenomeConfig) => void;
}

export const ForkModal: React.FC<ForkModalProps> = ({
  parentGenome,
  onClose,
  onForkCreated,
}) => {
  const [name, setName] = useState(`${parentGenome.name} (Custom Fork)`);
  const [symbol, setSymbol] = useState(`${parentGenome.symbol}_F`);
  const [forkMessage, setForkMessage] = useState('Optimized virtual reserves and dynamic fee shield');
  const [author, setAuthor] = useState('Solana Dev');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const forked = forkGenome(
      parentGenome,
      {
        name,
        symbol,
        author,
      },
      forkMessage
    );
    onForkCreated(forked);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-border bg-surface-200/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple/20 text-brand-purple">
              <GitFork className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Fork Bonding Curve Genome
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                From: {parentGenome.name} (v{parentGenome.version})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-surface-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Forked Genome Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded bg-surface-200 px-3 py-2 text-xs text-white border border-surface-border focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Token Symbol
            </label>
            <input
              type="text"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded bg-surface-200 px-3 py-2 text-xs text-white border border-surface-border focus:border-brand-purple focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Fork Commit Message / Rationale
            </label>
            <input
              type="text"
              value={forkMessage}
              onChange={(e) => setForkMessage(e.target.value)}
              placeholder="e.g. Higher virtual liquidity for anti-snipe"
              className="w-full rounded bg-surface-200 px-3 py-2 text-xs text-white border border-surface-border focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Author Handle
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded bg-surface-200 px-3 py-2 text-xs text-white border border-surface-border focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-surface-50 px-4 py-2 text-xs font-medium text-gray-300 hover:text-white border border-surface-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-all shadow"
            >
              <GitFork className="h-3.5 w-3.5" />
              <span>Create Fork</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
