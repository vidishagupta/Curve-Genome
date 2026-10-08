'use client';

import React from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { Award, CheckCircle2, ChevronRight, Layers, Lock } from 'lucide-react';

interface GraduationMeterProps {
  currentSolRaised: number;
  genome: GenomeConfig;
}

export const GraduationMeter: React.FC<GraduationMeterProps> = ({
  currentSolRaised,
  genome,
}) => {
  const target = Math.max(genome.graduationSolThreshold, 1);
  const progressPct = Math.min((currentSolRaised / target) * 100, 100);
  const remainingSol = Math.max(0, target - currentSolRaised);
  const isGraduated = progressPct >= 100;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className={`h-4 w-4 ${isGraduated ? 'text-brand-green' : 'text-brand-cyan'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Meteora DBC Graduation Radar
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-gray-400">Target:</span>
          <span className="font-bold text-brand-green">{target} SOL</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="text-brand-cyan font-bold">
            {currentSolRaised.toFixed(2)} SOL Raised ({progressPct.toFixed(1)}%)
          </span>
          <span className="text-gray-400">
            {isGraduated ? 'Threshold Met' : `${remainingSol.toFixed(2)} SOL to DLMM`}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-surface-200 overflow-hidden p-0.5 border border-surface-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isGraduated
                ? 'bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-green animate-pulse'
                : 'bg-gradient-to-r from-brand-cyan to-brand-purple'
            }`}
            style={{ width: `${Math.max(progressPct, 2)}%` }}
          />
        </div>
      </div>

      {/* Graduation Target Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-surface-border/60 text-[11px] font-mono">
        <div className="rounded bg-surface-200/60 p-2 border border-surface-border">
          <div className="text-gray-400 text-[10px]">MIGRATION TARGET</div>
          <div className="text-brand-cyan font-bold">
            {genome.migrationTarget === 'meteora_dlmm' ? 'Meteora DLMM' : 'DAMM v2 Pool'}
          </div>
        </div>

        <div className="rounded bg-surface-200/60 p-2 border border-surface-border">
          <div className="text-gray-400 text-[10px]">ACTIVE BIN STEP</div>
          <div className="text-brand-purple font-bold">
            {genome.dlmmConfig.binStep} bps ({genome.dlmmConfig.binStep / 100}%)
          </div>
        </div>

        <div className="rounded bg-surface-200/60 p-2 border border-surface-border">
          <div className="text-gray-400 text-[10px]">LIQUIDITY LOCK</div>
          <div className="text-brand-green font-bold flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>{genome.dlmmConfig.lockedDurationDays === 0 ? '100% Burn' : `${genome.dlmmConfig.lockedDurationDays}d Lock`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
