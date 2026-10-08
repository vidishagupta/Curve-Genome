'use client';

import React from 'react';
import { CurveShape, GenomeConfig, QuoteToken } from '@/lib/bonding-curve/types';
import { Settings, Info, Sliders, Shield, Zap } from 'lucide-react';

interface ParameterEditorProps {
  genome: GenomeConfig;
  onChange: (updated: GenomeConfig) => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  genome,
  onChange,
}) => {
  const shapes: { id: CurveShape; label: string; desc: string }[] = [
    { id: 'linear', label: 'Linear', desc: 'Even price distribution across bonding curve.' },
    { id: 'exponential', label: 'Exponential', desc: 'Sub-linear early pricing, steepens towards graduation.' },
    { id: 'multi_segment', label: 'Multi-Segment', desc: 'Custom piecewise phases (Anti-Snipe -> Growth -> Final).' },
    { id: 'sigmoidal', label: 'Sigmoidal (S-Curve)', desc: 'Low early price, steep inflection, stable plateau.' },
    { id: 'logarithmic', label: 'Logarithmic', desc: 'Fast initial growth, tapers near graduation.' },
    { id: 'constant_product', label: 'CPMM (x*y=k)', desc: 'Meteora standard virtual reserve invariant.' },
  ];

  const updateField = <K extends keyof GenomeConfig>(key: K, value: GenomeConfig[K]) => {
    onChange({
      ...genome,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col space-y-5 rounded-xl border border-surface-border bg-surface-100 p-5">
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-cyan" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Curve Topology & Parameters
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
          Meteora DBC Spec
        </span>
      </div>

      {/* Curve Shape Selection */}
      <div>
        <label className="text-xs font-semibold text-gray-300 mb-2 flex items-center justify-between">
          <span>CURVE TOPOLOGY</span>
          <span className="text-[10px] font-mono text-brand-cyan uppercase">{genome.shape}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => updateField('shape', s.id)}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                genome.shape === s.id
                  ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-sm'
                  : 'bg-surface-200/80 border-surface-border text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <span className="text-xs font-bold">{s.label}</span>
              <span className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                {s.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Numeric Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Virtual SOL Reserve */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1">
              <span>Virtual SOL Reserve (V_sol)</span>
              <Info className="h-3 w-3 text-gray-500" />
            </label>
            <span className="font-mono text-xs font-bold text-brand-cyan">
              {genome.virtualSolReserve} SOL
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={genome.virtualSolReserve}
            onChange={(e) => updateField('virtualSolReserve', Number(e.target.value))}
            className="w-full accent-brand-cyan bg-surface-50 h-1.5 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Higher values dampen T0 sniper extraction & reduce early trade slippage.
          </p>
        </div>

        {/* Graduation SOL Target */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Graduation Target
            </label>
            <span className="font-mono text-xs font-bold text-brand-green">
              {genome.graduationSolThreshold} SOL
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="500"
            step="5"
            value={genome.graduationSolThreshold}
            onChange={(e) => updateField('graduationSolThreshold', Number(e.target.value))}
            className="w-full accent-brand-green bg-surface-50 h-1.5 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Real SOL pool size migrated into Meteora DLMM upon graduation.
          </p>
        </div>

        {/* Exponent (For Exponential Shape) */}
        {genome.shape === 'exponential' && (
          <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border col-span-full">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Curvature Power (Exponent k)
              </label>
              <span className="font-mono text-xs font-bold text-brand-purple">
                {genome.exponent.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={genome.exponent}
              onChange={(e) => updateField('exponent', Number(e.target.value))}
              className="w-full accent-brand-purple bg-surface-50 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Initial Price (SOL) */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <label className="text-xs font-semibold text-gray-300 mb-1 block">
            Starting Price per Token (SOL)
          </label>
          <input
            type="number"
            step="0.000000001"
            value={genome.initialPriceSol}
            onChange={(e) => updateField('initialPriceSol', Number(e.target.value))}
            className="w-full rounded bg-surface-100 px-3 py-1.5 font-mono text-xs text-white border border-surface-border focus:border-brand-cyan focus:outline-none"
          />
        </div>

        {/* Target Graduation Price (SOL) */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <label className="text-xs font-semibold text-gray-300 mb-1 block">
            Graduation Price per Token (SOL)
          </label>
          <input
            type="number"
            step="0.00000001"
            value={genome.graduationPriceSol}
            onChange={(e) => updateField('graduationPriceSol', Number(e.target.value))}
            className="w-full rounded bg-surface-100 px-3 py-1.5 font-mono text-xs text-white border border-surface-border focus:border-brand-purple focus:outline-none"
          />
        </div>

        {/* Token Total Supply */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <label className="text-xs font-semibold text-gray-300 mb-1 block">
            Total Supply
          </label>
          <input
            type="number"
            step="1000000"
            value={genome.totalSupply}
            onChange={(e) => updateField('totalSupply', Number(e.target.value))}
            className="w-full rounded bg-surface-100 px-3 py-1.5 font-mono text-xs text-white border border-surface-border focus:border-brand-cyan focus:outline-none"
          />
        </div>

        {/* Bonding Curve Supply Allocation */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <label className="text-xs font-semibold text-gray-300 mb-1 block">
            Curve Supply Allocation ({((genome.bondingCurveSupply / genome.totalSupply) * 100).toFixed(0)}%)
          </label>
          <input
            type="number"
            step="1000000"
            value={genome.bondingCurveSupply}
            onChange={(e) => updateField('bondingCurveSupply', Number(e.target.value))}
            className="w-full rounded bg-surface-100 px-3 py-1.5 font-mono text-xs text-white border border-surface-border focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
