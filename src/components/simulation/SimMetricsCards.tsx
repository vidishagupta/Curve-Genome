'use client';

import React from 'react';
import { SimulationResult } from '@/lib/bonding-curve/types';
import { Activity, DollarSign, Users, Award, Percent, TrendingDown } from 'lucide-react';

interface SimMetricsCardsProps {
  simulation: SimulationResult;
}

export const SimMetricsCards: React.FC<SimMetricsCardsProps> = ({ simulation }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Volume */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">Total Volume</span>
          <Activity className="h-3.5 w-3.5 text-brand-cyan" />
        </div>
        <div className="font-mono text-sm font-black text-white">
          {simulation.totalVolumeSol} SOL
        </div>
        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
          {simulation.totalOrders} Orders
        </div>
      </div>

      {/* Fees Collected */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">Total Fees</span>
          <DollarSign className="h-3.5 w-3.5 text-brand-orange" />
        </div>
        <div className="font-mono text-sm font-black text-white">
          {simulation.totalFeesCollectedSol} SOL
        </div>
        <div className="text-[10px] font-mono text-brand-orange mt-0.5 font-bold">
          {simulation.creatorFeeShareSol} SOL Creator
        </div>
      </div>

      {/* Final SOL Raised */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">SOL In Pool</span>
          <Award className="h-3.5 w-3.5 text-brand-teal" />
        </div>
        <div className="font-mono text-sm font-black text-white">
          {simulation.finalSolRaised} SOL
        </div>
        <div className="text-[10px] font-mono text-brand-teal mt-0.5">
          {simulation.graduationReached ? 'Graduated ✅' : 'In Bonding'}
        </div>
      </div>

      {/* Avg Slippage */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">Avg Slippage</span>
          <Percent className="h-3.5 w-3.5 text-brand-pink" />
        </div>
        <div className="font-mono text-sm font-black text-white">
          {simulation.avgSlippagePct}%
        </div>
        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
          Per Order Impact
        </div>
      </div>

      {/* Max Drawdown */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">Max Drawdown</span>
          <TrendingDown className="h-3.5 w-3.5 text-brand-rose" />
        </div>
        <div className="font-mono text-sm font-black text-brand-rose">
          {simulation.maxDrawdownPct}%
        </div>
        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
          Peak-to-Trough
        </div>
      </div>

      {/* Gini Fair Distribution */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-3.5 shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span className="text-[10px] font-semibold uppercase">Gini Equality</span>
          <Users className="h-3.5 w-3.5 text-brand-purple" />
        </div>
        <div className="font-mono text-sm font-black text-white">
          {simulation.distributionStats.giniCoefficient}
        </div>
        <div className="text-[10px] font-mono text-brand-purple mt-0.5">
          Top 10: {simulation.distributionStats.top10HoldersPct}%
        </div>
      </div>
    </div>
  );
};
