'use client';

import React, { useMemo } from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { generateAICurveAnalysis } from '@/lib/ai/rule-engine';
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Sliders,
  Wrench,
} from 'lucide-react';

interface AICurveAnalystProps {
  genome: GenomeConfig;
  onApplyPresetPatch: (patch: Partial<GenomeConfig>) => void;
}

export const AICurveAnalyst: React.FC<AICurveAnalystProps> = ({
  genome,
  onApplyPresetPatch,
}) => {
  const analysis = useMemo(() => {
    return generateAICurveAnalysis(genome);
  }, [genome]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-border bg-gradient-to-r from-surface-100 via-surface-100 to-surface-200 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-purple/10 px-2 py-0.5 text-xs font-mono font-bold text-brand-purple border border-brand-purple/20">
              AI CURVE INTELLIGENCE
            </span>
            <h2 className="text-lg font-black text-white">
              {analysis.summaryTitle}
            </h2>
          </div>
          <p className="text-xs text-gray-300 mt-1.5 max-w-3xl leading-relaxed">
            {analysis.executiveSummary}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface-50 px-3 py-1 text-xs font-mono font-bold text-brand-cyan border border-surface-border">
            {analysis.tokenomicProfile.archetype}
          </span>
        </div>
      </div>

      {/* Quantitative Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
          <span className="text-[10px] font-mono uppercase text-gray-400">
            Capital Utilization
          </span>
          <div className="font-mono text-base font-bold text-brand-cyan mt-1">
            {analysis.tokenomicProfile.capitalEfficiencyRating}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Ratio of real capital locked vs total curve capacity.
          </p>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
          <span className="text-[10px] font-mono uppercase text-gray-400">
            Sniper Risk Index
          </span>
          <div
            className={`font-mono text-base font-bold mt-1 ${
              analysis.tokenomicProfile.sniperRiskIndex === 'LOW'
                ? 'text-brand-green'
                : analysis.tokenomicProfile.sniperRiskIndex === 'MODERATE'
                ? 'text-amber-400'
                : 'text-brand-rose'
            }`}
          >
            {analysis.tokenomicProfile.sniperRiskIndex} RISK
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Block 0 vulnerability to bot sweeping.
          </p>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
          <span className="text-[10px] font-mono uppercase text-gray-400">
            Liquidity Depth
          </span>
          <div className="font-mono text-base font-bold text-brand-teal mt-1">
            {analysis.tokenomicProfile.liquidityDepthGrade}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Slippage resistance on large buy tickets.
          </p>
        </div>
      </div>

      {/* Behavioral Diagnostics: "Why it behaves this way" */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand-purple" />
          <span>Behavioral Diagnostics: Mechanics Explained</span>
        </h3>

        <div className="space-y-3">
          {analysis.behavioralDiagnostics.map((diag, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-cyan">{diag.phase}</h4>
                <span className="text-[10px] font-mono text-gray-400">
                  {diag.description}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed bg-surface-200/50 p-3 rounded-lg border border-surface-border">
                {diag.mechanicsWhy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Fixes & 1-Click Parameter Optimizations */}
      {analysis.recommendedFixes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-cyan" />
            <span>AI Suggested Parameter Optimizations</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendedFixes.map((fix, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{fix.actionName}</span>
                    <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-cyan border border-brand-cyan/20">
                      Recommendation
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {fix.rationale}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-brand-purple bg-surface-200 p-2 rounded border border-surface-border">
                    🔧 {fix.parameterChange}
                  </div>
                </div>

                <button
                  onClick={() => onApplyPresetPatch(fix.presetPatch)}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-surface-50 py-2 text-xs font-bold text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan hover:text-black transition-all shadow-sm"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Apply This Optimization</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
