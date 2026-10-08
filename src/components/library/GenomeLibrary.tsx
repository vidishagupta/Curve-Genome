'use client';

import React, { useState } from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import {
  FolderGit2,
  GitFork,
  GitBranch,
  GitCompare,
  Search,
  Plus,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { GenomeDiffModal } from './GenomeDiffModal';
import { ForkModal } from './ForkModal';

interface GenomeLibraryProps {
  genomes: GenomeConfig[];
  activeGenome: GenomeConfig;
  onSelectGenome: (g: GenomeConfig) => void;
  onGenomeCreated: (g: GenomeConfig) => void;
  onDeleteGenome: (id: string) => void;
}

export const GenomeLibrary: React.FC<GenomeLibraryProps> = ({
  genomes,
  activeGenome,
  onSelectGenome,
  onGenomeCreated,
  onDeleteGenome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [diffTarget, setDiffTarget] = useState<GenomeConfig | null>(null);
  const [forkTarget, setForkTarget] = useState<GenomeConfig | null>(null);

  // All unique tags
  const allTags = Array.from(new Set(genomes.flatMap((g) => g.tags)));

  const filteredGenomes = genomes.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? g.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-border bg-gradient-to-r from-surface-100 to-surface-200 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-xs font-mono font-bold text-brand-cyan border border-brand-cyan/20">
              GENOME REGISTRY
            </span>
            <h2 className="text-lg font-black text-white">
              The GitHub for Bonding Curves
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Browse verified bonding curve topologies, inspect parent-child forks, compare parameter diffs, and fork configurations in 1-click.
          </p>
        </div>

        <button
          onClick={() => setForkTarget(activeGenome)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition-all"
        >
          <GitFork className="h-4 w-4" />
          <span>Fork Current ({activeGenome.symbol})</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search genomes by name, symbol, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-surface-100 pl-9 pr-4 py-2 text-xs text-white border border-surface-border focus:border-brand-cyan focus:outline-none"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              selectedTag === null
                ? 'bg-surface-50 text-brand-cyan border border-brand-cyan/30'
                : 'bg-surface-100 text-gray-400 border border-surface-border hover:text-white'
            }`}
          >
            All Topologies
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/40'
                  : 'bg-surface-100 text-gray-400 border border-surface-border hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Genome Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGenomes.map((g) => {
          const isActive = g.id === activeGenome.id;
          return (
            <div
              key={g.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all shadow-md ${
                isActive
                  ? 'bg-surface-100/95 border-brand-cyan shadow-brand-cyan/5 ring-1 ring-brand-cyan/30'
                  : 'bg-surface-100 border-surface-border hover:border-gray-600'
              }`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{g.name}</span>
                    <span className="rounded bg-surface-200 px-1.5 py-0.5 text-[10px] font-mono text-brand-cyan border border-surface-border">
                      {g.symbol}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-500">
                    #{g.hash.substring(0, 6)}
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">
                  {g.description}
                </p>

                {/* Lineage indicator */}
                {g.parentGenomeId && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-purple bg-brand-purple/5 p-1.5 rounded border border-brand-purple/20 mb-3">
                    <GitBranch className="h-3 w-3" />
                    <span className="truncate">Forked with: "{g.forkMessage}"</span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {g.tags.map((t, i) => (
                    <span
                      key={i}
                      className="rounded bg-surface-200 px-2 py-0.5 text-[9px] font-mono text-gray-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Quick specs grid */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-surface-border/60 text-[11px] font-mono">
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase">Shape</div>
                    <div className="text-gray-200 font-bold capitalize truncate">
                      {g.shape}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase">Virtual SOL</div>
                    <div className="text-brand-cyan font-bold">{g.virtualSolReserve} SOL</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase">Target</div>
                    <div className="text-brand-green font-bold">{g.graduationSolThreshold} SOL</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-3">
                <div className="flex items-center gap-2">
                  {/* Compare Diff */}
                  {!isActive && (
                    <button
                      onClick={() => setDiffTarget(g)}
                      className="flex items-center gap-1 rounded bg-surface-50 p-1.5 text-[11px] text-gray-300 hover:text-brand-cyan border border-surface-border"
                      title="Compare parameter diff against active"
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Diff</span>
                    </button>
                  )}

                  {/* Fork Button */}
                  <button
                    onClick={() => setForkTarget(g)}
                    className="flex items-center gap-1 rounded bg-surface-50 p-1.5 text-[11px] text-gray-300 hover:text-brand-purple border border-surface-border"
                    title="Fork this genome"
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Fork</span>
                  </button>
                </div>

                {/* Switch Active or Active Badge */}
                {isActive ? (
                  <span className="rounded-full bg-brand-cyan/10 px-2.5 py-1 text-xs font-bold text-brand-cyan border border-brand-cyan/30">
                    Active Curve
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectGenome(g)}
                    className="flex items-center gap-1 rounded-lg bg-surface-50 px-3 py-1.5 text-xs font-bold text-white hover:bg-surface-200 border border-surface-border"
                  >
                    <span>Load Genome</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Diff Modal */}
      {diffTarget && (
        <GenomeDiffModal
          genomeA={activeGenome}
          genomeB={diffTarget}
          onClose={() => setDiffTarget(null)}
          onSelectGenome={onSelectGenome}
        />
      )}

      {/* Fork Modal */}
      {forkTarget && (
        <ForkModal
          parentGenome={forkTarget}
          onClose={() => setForkTarget(null)}
          onForkCreated={onGenomeCreated}
        />
      )}
    </div>
  );
};
