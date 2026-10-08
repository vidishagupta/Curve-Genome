'use client';

import React, { useMemo } from 'react';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { generateCurvePoints } from '@/lib/bonding-curve/math';
import { CurveChart } from './CurveChart';
import { ParameterEditor } from './ParameterEditor';
import { DynamicFeeConfigPanel } from './DynamicFeeConfig';
import { PiecewiseEditor } from './PiecewiseEditor';
import { CurveMetricsHUD } from './CurveMetricsHUD';
import { Sliders, Sparkles, Play, ShieldAlert, Cpu } from 'lucide-react';

interface CurveStudioProps {
  genome: GenomeConfig;
  onChangeGenome: (updated: GenomeConfig) => void;
  onGoToSim: () => void;
  onGoToStress: () => void;
}

export const CurveStudio: React.FC<CurveStudioProps> = ({
  genome,
  onChangeGenome,
  onGoToSim,
  onGoToStress,
}) => {
  const curvePoints = useMemo(() => {
    return generateCurvePoints(genome, 90);
  }, [genome]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-border bg-gradient-to-r from-surface-100 via-surface-100 to-surface-200 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-xs font-mono font-bold text-brand-cyan border border-brand-cyan/20">
              STUDIO
            </span>
            <h1 className="text-lg font-black text-white">
              {genome.name} ({genome.symbol})
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            {genome.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoToSim}
            className="flex items-center gap-1.5 rounded-lg bg-surface-50 px-3.5 py-2 text-xs font-bold text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/10 transition-all shadow-sm"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Simulate Demand</span>
          </button>
          <button
            onClick={onGoToStress}
            className="flex items-center gap-1.5 rounded-lg bg-surface-50 px-3.5 py-2 text-xs font-bold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-all shadow-sm"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Stress Test Curve</span>
          </button>
        </div>
      </div>

      {/* Real-time Mathematical HUD */}
      <CurveMetricsHUD genome={genome} curvePoints={curvePoints} />

      {/* Main Workspace: Left Column (Chart + Multi-segment) & Right Column (Parameters & Fees) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CurveChart points={curvePoints} genome={genome} />

          {/* Piecewise Editor when multi-segment shape is selected */}
          {genome.shape === 'multi_segment' && (
            <PiecewiseEditor
              segments={genome.segments || []}
              onChange={(segments) => onChangeGenome({ ...genome, segments })}
              graduationPriceSol={genome.graduationPriceSol}
            />
          )}
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ParameterEditor genome={genome} onChange={onChangeGenome} />

          <DynamicFeeConfigPanel
            dynamicFees={genome.dynamicFees}
            dlmmConfig={genome.dlmmConfig}
            migrationTarget={genome.migrationTarget}
            onChangeFees={(dynamicFees) => onChangeGenome({ ...genome, dynamicFees })}
            onChangeDLMM={(dlmmConfig) => onChangeGenome({ ...genome, dlmmConfig })}
            onChangeTarget={(migrationTarget) => onChangeGenome({ ...genome, migrationTarget })}
          />
        </div>
      </div>
    </div>
  );
};
