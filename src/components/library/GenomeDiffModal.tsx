'use client';

import React from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { compareGenomes } from '@/lib/genome/storage';
import { X, GitCompare, ArrowRight } from 'lucide-react';

interface GenomeDiffModalProps {
  genomeA: GenomeConfig;
  genomeB: GenomeConfig;
  onClose: () => void;
  onSelectGenome: (g: GenomeConfig) => void;
}

export const GenomeDiffModal: React.FC<GenomeDiffModalProps> = ({
  genomeA,
  genomeB,
  onClose,
  onSelectGenome,
}) => {
  const diffs = compareGenomes(genomeA, genomeB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl border border-surface-border bg-surface-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-border bg-surface-200/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple/20 text-brand-purple">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Genome Parameter Diff Comparison
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {genomeA.name} <span className="text-gray-500">vs</span> {genomeB.name}
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

        {/* Diff Table */}
        <div className="p-5 overflow-y-auto space-y-4">
          {diffs.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs font-mono">
              These two genomes are mathematically identical in all DBC parameters.
            </div>
          ) : (
            <div className="space-y-3">
              {diffs.map((d, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-surface-border bg-surface-200/50 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">{d.label}</span>
                    {d.delta && (
                      <span className="font-mono text-[10px] text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                        Delta: {d.delta}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="rounded bg-surface-300 p-2 border border-surface-border">
                      <div className="text-[10px] text-gray-400 truncate mb-0.5">{genomeA.name}</div>
                      <div className="text-brand-purple font-bold">{d.valA}</div>
                    </div>
                    <div className="rounded bg-surface-300 p-2 border border-surface-border">
                      <div className="text-[10px] text-gray-400 truncate mb-0.5">{genomeB.name}</div>
                      <div className="text-brand-cyan font-bold">{d.valB}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                    ℹ️ {d.impactExplanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-surface-border bg-surface-200/60">
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-50 px-4 py-2 text-xs font-medium text-gray-300 hover:text-white border border-surface-border"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelectGenome(genomeB);
              onClose();
            }}
            className="rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-4 py-2 text-xs font-bold text-black hover:opacity-90"
          >
            Switch to {genomeB.name}
          </button>
        </div>
      </div>
    </div>
  );
};
