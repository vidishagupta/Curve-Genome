'use client';

import React from 'react';
import { GenomeConfig, CurvePoint } from '@/lib/bonding-curve/types';
import { SOL_PRICE_USD } from '@/lib/bonding-curve/math';
import {
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CurveMetricsHUDProps {
  genome: GenomeConfig;
  curvePoints: CurvePoint[];
}

export const CurveMetricsHUD: React.FC<CurveMetricsHUDProps> = ({
  genome,
  curvePoints,
}) => {
  const p0 = genome.initialPriceSol;
  const pGrad = genome.graduationPriceSol;
  const growthMultiplier = pGrad / Math.max(p0, 1e-9);

  const initialMcapSol = p0 * genome.totalSupply;
  const initialMcapUsd = initialMcapSol * SOL_PRICE_USD;

  const gradMcapSol = pGrad * genome.totalSupply;
  const gradMcapUsd = gradMcapSol * SOL_PRICE_USD;

  // Slippage metrics
  const point0 = curvePoints[0];
  const pointMid = curvePoints[Math.floor(curvePoints.length / 2)];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Starting Valuation */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Initial Valuation
          </span>
          <DollarSign className="h-3.5 w-3.5 text-brand-cyan" />
        </div>
        <div className="font-mono text-base font-black text-white">
          ${initialMcapUsd < 1000 ? initialMcapUsd.toFixed(2) : Math.round(initialMcapUsd).toLocaleString()}
        </div>
        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
          {initialMcapSol.toFixed(2)} SOL @ launch
        </div>
      </div>

      {/* Graduation Target Valuation */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Graduation Target Cap
          </span>
          <TrendingUp className="h-3.5 w-3.5 text-brand-purple" />
        </div>
        <div className="font-mono text-base font-black text-white">
          ${Math.round(gradMcapUsd).toLocaleString()}
        </div>
        <div className="text-[10px] font-mono text-brand-purple mt-0.5 font-bold">
          {growthMultiplier.toFixed(1)}x Growth Multiple
        </div>
      </div>

      {/* Virtual Reserve Cushion */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Virtual SOL Depth
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
        </div>
        <div className="font-mono text-base font-black text-white">
          {genome.virtualSolReserve} SOL
        </div>
        <div className="text-[10px] font-mono text-brand-teal mt-0.5">
          ~${(genome.virtualSolReserve * SOL_PRICE_USD).toLocaleString()} Virtual Cushion
        </div>
      </div>

      {/* Dynamic Max Fee Shield */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-4 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Meteora Dynamic Fee
          </span>
          <Zap className="h-3.5 w-3.5 text-brand-orange" />
        </div>
        <div className="font-mono text-base font-black text-white">
          {(genome.dynamicFees.baseFeeBps / 100).toFixed(2)}% →{' '}
          <span className="text-brand-orange">
            {(genome.dynamicFees.maxFeeBps / 100).toFixed(2)}%
          </span>
        </div>
        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
          {genome.dynamicFees.creatorSharePercentage}% Creator / {genome.dlmmConfig.binStep} bps DLMM
        </div>
      </div>
    </div>
  );
};
