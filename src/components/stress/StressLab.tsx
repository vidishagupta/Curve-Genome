'use client';

import React, { useMemo } from 'react';
import { GenomeConfig, StressAuditReport } from '@/lib/bonding-curve/types';
import { runStressAudit } from '@/lib/bonding-curve/stress-tester';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Sparkles,
  Zap,
} from 'lucide-react';

interface StressLabProps {
  genome: GenomeConfig;
  onApplyPatch: (patch: Partial<GenomeConfig>) => void;
  onGoToStudio: () => void;
}

export const StressLab: React.FC<StressLabProps> = ({
  genome,
  onApplyPatch,
  onGoToStudio,
}) => {
  const audit: StressAuditReport = useMemo(() => {
    return runStressAudit(genome);
  }, [genome]);

  const getSeverityBadge = (severity: 'PASS' | 'WARNING' | 'CRITICAL') => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 rounded bg-brand-rose/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-rose border border-brand-rose/30">
            <XCircle className="h-3 w-3" /> CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" /> WARNING
          </span>
        );
      case 'PASS':
      default:
        return (
          <span className="flex items-center gap-1 rounded bg-brand-green/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-green border border-brand-green/30">
            <CheckCircle2 className="h-3 w-3" /> PASS
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Resilience Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Banner Left */}
        <div className="lg:col-span-8 rounded-xl border border-surface-border bg-gradient-to-r from-surface-100 to-surface-200 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-bold text-amber-400 border border-amber-500/20">
                STRESS LAB
              </span>
              <h2 className="text-lg font-black text-white">
                Battle-Test Audit: 5 Core Attack Vectors
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Transparent resilience report evaluating T0 sniper sweeps, 50 SOL whale dumps, MEV sandwich arbitrage, and near-graduation cliff stall risk.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center gap-4 text-xs font-mono">
            <span className="text-gray-400">
              Vulnerabilities Detected:{' '}
              <strong className={audit.vulnerabilitiesFound > 0 ? 'text-amber-400' : 'text-brand-green'}>
                {audit.vulnerabilitiesFound}
              </strong>
            </span>
            <span className="text-gray-400">
              Meteora Dynamic Shield:{' '}
              <strong className={genome.dynamicFees.enabled ? 'text-brand-cyan' : 'text-brand-rose'}>
                {genome.dynamicFees.enabled ? 'ACTIVE' : 'OFF'}
              </strong>
            </span>
          </div>
        </div>

        {/* Resilience Grade Score (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-surface-border bg-surface-100 p-5 shadow-lg flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono font-semibold uppercase text-gray-400 mb-1">
            Overall Resilience Score
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-black font-mono tracking-tight ${
                audit.overallResilienceScore >= 80
                  ? 'text-brand-green'
                  : audit.overallResilienceScore >= 60
                  ? 'text-amber-400'
                  : 'text-brand-rose'
              }`}
            >
              {audit.overallResilienceScore}
            </span>
            <span className="text-base text-gray-500 font-mono">/100</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-200 px-3 py-1 border border-surface-border">
            <span className="text-xs font-bold text-white font-mono">Grade: {audit.grade}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 px-2">
            {audit.summary}
          </p>
        </div>
      </div>

      {/* 5 Attack Vector Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-brand-cyan" />
          <span>Detailed Vulnerability Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audit.vectors.map((vec) => (
            <div
              key={vec.id}
              className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md hover:border-gray-600 transition-all space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white truncate">{vec.name}</span>
                  {getSeverityBadge(vec.severity)}
                </div>
                <div className="text-[10px] font-mono text-gray-400 mb-2">
                  {vec.category}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {vec.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border/60">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">{vec.metricLabel}:</span>
                  <span className="font-bold text-brand-cyan">{vec.metricValue}</span>
                </div>
                <div className="text-[11px] text-brand-teal/90 bg-brand-teal/5 p-2 rounded border border-brand-teal/20 mt-2">
                  💡 <strong>Fix:</strong> {vec.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Parameter Optimization Recommendations */}
      {audit.mitigationTips.length > 0 && (
        <div className="rounded-xl border border-brand-cyan/30 bg-surface-100/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Resilience Optimizations
              </h3>
            </div>
            <button
              onClick={() => {
                onApplyPatch({
                  virtualSolReserve: Math.max(genome.virtualSolReserve, 35),
                  dynamicFees: {
                    ...genome.dynamicFees,
                    enabled: true,
                    maxFeeBps: 450,
                    surgeMultiplier: 2.8,
                  },
                });
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-3 py-1.5 text-xs font-bold text-black shadow hover:opacity-90 transition-all"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Auto-Fix Vulnerabilities</span>
            </button>
          </div>

          <ul className="space-y-2 text-xs text-gray-300">
            {audit.mitigationTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
