'use client';

import React from 'react';
import { PiecewiseSegment } from '@/lib/bonding-curve/types';
import { Plus, Trash2, Layers, ArrowRight } from 'lucide-react';

interface PiecewiseEditorProps {
  segments: PiecewiseSegment[];
  onChange: (segments: PiecewiseSegment[]) => void;
  graduationPriceSol: number;
}

export const PiecewiseEditor: React.FC<PiecewiseEditorProps> = ({
  segments,
  onChange,
  graduationPriceSol,
}) => {
  const updateSegment = (index: number, updated: Partial<PiecewiseSegment>) => {
    const next = [...segments];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const addSegment = () => {
    if (segments.length >= 4) return;
    const nextId = `seg-${Date.now()}`;
    const newSeg: PiecewiseSegment = {
      id: nextId,
      name: `Phase ${segments.length + 1}: Expansion`,
      supplyPercentage: 20,
      shape: 'linear',
      growthMultiplier: 1.5,
      targetPriceSol: graduationPriceSol * 0.7,
    };
    onChange([...segments, newSeg]);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 1) return;
    const next = segments.filter((_, i) => i !== index);
    onChange(next);
  };

  const totalAllocated = segments.reduce((sum, s) => sum + s.supplyPercentage, 0);

  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-surface-border bg-surface-100 p-5">
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-purple" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Piecewise Multi-Segment Topology
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold ${totalAllocated === 100 ? 'text-brand-green' : 'text-amber-400'}`}>
            {totalAllocated}% Supply Partitioned
          </span>
          <button
            onClick={addSegment}
            disabled={segments.length >= 4}
            className="flex items-center gap-1 rounded bg-surface-200 px-2 py-1 text-xs text-brand-cyan hover:bg-surface-50 disabled:opacity-40 border border-surface-border"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Phase</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((seg, idx) => (
          <div
            key={seg.id}
            className="rounded-lg bg-surface-200/80 p-3.5 border border-surface-border space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={seg.name}
                onChange={(e) => updateSegment(idx, { name: e.target.value })}
                className="bg-transparent text-xs font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-purple"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400">Phase {idx + 1} of {segments.length}</span>
                {segments.length > 1 && (
                  <button
                    onClick={() => removeSegment(idx)}
                    className="text-gray-500 hover:text-brand-rose transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">
                  SUPPLY SHARE ({seg.supplyPercentage}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={seg.supplyPercentage}
                  onChange={(e) => updateSegment(idx, { supplyPercentage: Number(e.target.value) })}
                  className="w-full accent-brand-purple bg-surface-50 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">PHASE TOPOLOGY</label>
                <select
                  value={seg.shape}
                  onChange={(e) => updateSegment(idx, { shape: e.target.value as any })}
                  className="w-full rounded bg-surface-100 p-1 font-mono text-xs text-white border border-surface-border"
                >
                  <option value="flat">Flat (Anti-Snipe Floor)</option>
                  <option value="linear">Linear Gradient</option>
                  <option value="exponential">Exponential Acceleration</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">TARGET PRICE (SOL)</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={seg.targetPriceSol}
                  onChange={(e) => updateSegment(idx, { targetPriceSol: Number(e.target.value) })}
                  className="w-full rounded bg-surface-100 p-1 font-mono text-xs text-white border border-surface-border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
