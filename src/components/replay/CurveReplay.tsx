'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GenomeConfig, SimulationResult } from '@/lib/bonding-curve/types';
import { runBondingSimulation } from '@/lib/bonding-curve/simulator';
import { CurveChart } from '../studio/CurveChart';
import { generateCurvePoints } from '@/lib/bonding-curve/math';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Award,
  Layers,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';

interface CurveReplayProps {
  genome: GenomeConfig;
}

export const CurveReplay: React.FC<CurveReplayProps> = ({ genome }) => {
  const [simulation] = useState<SimulationResult>(() =>
    runBondingSimulation(genome, 'whale_fomo')
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(2);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = simulation.timeSeries.length;
  const currentPoint = simulation.timeSeries[currentStep - 1] || simulation.timeSeries[0];
  const currentTrade = simulation.trades[currentStep - 1];

  const currentSupplyProgress = Math.min(
    (currentPoint.tokensSold / genome.bondingCurveSupply) * 100,
    100
  );

  const isGraduated =
    currentPoint.graduationPct >= 100 ||
    (simulation.graduationStep !== null && currentStep >= simulation.graduationStep);

  // Trigger celebration confetti on graduation
  useEffect(() => {
    if (isGraduated && !hasCelebrated) {
      setHasCelebrated(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F5D4', '#00BBF9', '#9B5DE5', '#FEE440'],
        });
      } catch (e) {
        // Confetti optional
      }
    }
  }, [isGraduated, hasCelebrated]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackSpeed, totalSteps]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    setHasCelebrated(false);
  };

  const curvePoints = generateCurvePoints(genome, 90);

  // Milestones
  const milestones = [
    { step: 1, label: 'T0 Inception', desc: 'Pool Initialized on Devnet' },
    { step: Math.floor(totalSteps * 0.25), label: '25% Discovery', desc: 'Early retail influx' },
    { step: Math.floor(totalSteps * 0.5), label: '50% Surge', desc: 'Dynamic fees active' },
    { step: Math.floor(totalSteps * 0.75), label: '75% Thrust', desc: 'Approaching threshold' },
    {
      step: simulation.graduationStep || totalSteps,
      label: '100% Graduation',
      desc: 'Meteora DLMM Migrated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Replay Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-border bg-gradient-to-r from-surface-100 to-surface-200 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-purple/10 px-2 py-0.5 text-xs font-mono font-bold text-brand-purple border border-brand-purple/20">
              TIMELINE REPLAY
            </span>
            <h2 className="text-lg font-black text-white">
              Launch → Growth → Graduation Time-Scrubber
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Watch the lifecycle of your dynamic bonding curve play out step-by-step from Block 0 to post-graduation Meteora DLMM active bins.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-4 py-2 text-xs font-bold text-black shadow-md hover:opacity-95 transition-all"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={handleReset}
            className="rounded-lg bg-surface-50 p-2 text-gray-300 border border-surface-border hover:bg-surface-200 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded-lg bg-surface-200 p-1 border border-surface-border text-xs font-mono">
            {([1, 2, 5, 10] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`rounded px-2 py-0.5 font-bold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Timeline Scrubber */}
      <div className="rounded-xl border border-surface-border bg-surface-100 p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Step:</span>
            <span className="text-brand-cyan font-bold">
              T+{currentStep} / T+{totalSteps}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Raised:</span>
            <span className="text-brand-teal font-bold">
              {currentPoint.solRaised.toFixed(2)} SOL
            </span>
            <span className="text-gray-400">({currentPoint.graduationPct.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="1"
          max={totalSteps}
          value={currentStep}
          onChange={(e) => {
            setCurrentStep(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full accent-brand-cyan bg-surface-200 h-2.5 rounded-lg cursor-pointer"
        />

        {/* Milestones markers */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-surface-border/60">
          {milestones.map((m, idx) => {
            const isReached = currentStep >= m.step;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(m.step);
                  setIsPlaying(false);
                }}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isReached
                    ? 'bg-brand-cyan/5 border-brand-cyan/30 text-white'
                    : 'bg-surface-200/50 border-surface-border text-gray-500'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold ${isReached ? 'text-brand-cyan' : 'text-gray-500'}`}>
                  {m.label}
                </span>
                <span className="text-[9px] text-gray-400 truncate w-full mt-0.5">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Graduation Alert Banner when Reached */}
      {isGraduated && (
        <div className="rounded-xl border border-brand-green/40 bg-gradient-to-r from-brand-green/10 via-surface-100 to-surface-100 p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/20 text-brand-green border border-brand-green/30">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                🎉 METEORA GRADUATION THRESHOLD COMPLETED!
              </h4>
              <p className="text-xs text-gray-300">
                Liquidity has been migrated to Meteora DLMM Pool with bin step of{' '}
                <strong className="text-brand-cyan">{genome.dlmmConfig.binStep} bps</strong>.
              </p>
            </div>
          </div>
          <span className="rounded bg-brand-green px-3 py-1 text-xs font-bold text-black font-mono">
            DLMM LIVE
          </span>
        </div>
      )}

      {/* Curve Visualizer with Moving Active Point Indicator */}
      <CurveChart
        points={curvePoints}
        genome={genome}
        currentSupplyProgress={currentSupplyProgress}
      />
    </div>
  );
};
