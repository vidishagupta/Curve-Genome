'use client';

import React, { useState, useEffect } from 'react';
import { GenomeConfig, SimulationResult } from '@/lib/bonding-curve/types';
import { runBondingSimulation, SIMULATION_SCENARIOS } from '@/lib/bonding-curve/simulator';
import { SimPriceChart } from './SimPriceChart';
import { OrderBookTape } from './OrderBookTape';
import { GraduationMeter } from './GraduationMeter';
import { SimMetricsCards } from './SimMetricsCards';
import { Play, RotateCw, Activity, Sparkles, Filter } from 'lucide-react';

interface SimulationLabProps {
  genome: GenomeConfig;
  onGoToReplay: () => void;
}

export const SimulationLab: React.FC<SimulationLabProps> = ({
  genome,
  onGoToReplay,
}) => {
  const [selectedScenario, setSelectedScenario] = useState('organic_retail');
  const [simulation, setSimulation] = useState<SimulationResult>(() =>
    runBondingSimulation(genome, 'organic_retail')
  );
  const [isRerunning, setIsRerunning] = useState(false);

  // Auto-run simulation when genome or scenario changes
  useEffect(() => {
    const res = runBondingSimulation(genome, selectedScenario, Date.now() % 100000);
    setSimulation(res);
  }, [genome, selectedScenario]);

  const handleRerun = () => {
    setIsRerunning(true);
    setTimeout(() => {
      const res = runBondingSimulation(genome, selectedScenario, Math.floor(Math.random() * 999999));
      setSimulation(res);
      setIsRerunning(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface-100 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-teal/10 px-2 py-0.5 text-xs font-mono font-bold text-brand-teal border border-brand-teal/20">
              LAB
            </span>
            <h2 className="text-lg font-black text-white">
              Simulation Lab: Dynamic Market Stress Engine
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Simulate realistic market inflows, bot snipes, panic cascades, and whale activity across your exact DBC parameters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRerun}
            disabled={isRerunning}
            className="flex items-center gap-1.5 rounded-lg bg-surface-50 px-3.5 py-2 text-xs font-bold text-gray-200 border border-surface-border hover:bg-surface-200 hover:text-white transition-all shadow-sm"
          >
            <RotateCw className={`h-3.5 w-3.5 text-brand-cyan ${isRerunning ? 'animate-spin' : ''}`} />
            <span>Re-seed Simulation</span>
          </button>
          <button
            onClick={onGoToReplay}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-3.5 py-2 text-xs font-bold text-black shadow-md hover:opacity-95 transition-all"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Open Timeline Replay</span>
          </button>
        </div>
      </div>

      {/* Scenario Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SIMULATION_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-md shadow-brand-cyan/5'
                  : 'bg-surface-100 border-surface-border text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold truncate">{sc.name}</span>
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                {sc.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Telemetry Cards */}
      <SimMetricsCards simulation={simulation} />

      {/* Graduation Meter */}
      <GraduationMeter currentSolRaised={simulation.finalSolRaised} genome={genome} />

      {/* Chart & Order Tape Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SimPriceChart simulation={simulation} genome={genome} />
        </div>
        <div className="lg:col-span-4">
          <OrderBookTape trades={simulation.trades} genome={genome} />
        </div>
      </div>
    </div>
  );
};
