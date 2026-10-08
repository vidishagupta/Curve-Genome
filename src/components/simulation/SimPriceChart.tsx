'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SimulationResult, GenomeConfig } from '@/lib/bonding-curve/types';
import { Activity, AlertCircle } from 'lucide-react';

interface SimPriceChartProps {
  simulation: SimulationResult;
  genome: GenomeConfig;
  highlightStep?: number;
}

export const SimPriceChart: React.FC<SimPriceChartProps> = ({
  simulation,
  genome,
  highlightStep,
}) => {
  const chartData = simulation.timeSeries.map((pt) => ({
    step: pt.step,
    priceSol: pt.priceSol,
    volumeSol: pt.volumeSol,
    solRaised: pt.solRaised,
    feeBps: pt.currentFeeBps / 100, // as percentage
    graduationPct: pt.graduationPct,
  }));

  const formatPrice = (val: number) => {
    if (val < 0.000001) return val.toExponential(3);
    if (val < 0.01) return val.toFixed(7);
    return val.toFixed(5);
  };

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-100 p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-cyan" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Simulated Price Trajectory & Volume
          </h3>
          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/20">
            SIMULATED
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-brand-cyan">
            <span className="h-2 w-2 rounded-full bg-brand-cyan" /> Price (SOL)
          </span>
          <span className="flex items-center gap-1.5 text-brand-orange">
            <span className="h-2 w-2 rounded-full bg-brand-orange" /> Dynamic Fee %
          </span>
        </div>
      </div>

      {/* Composed Chart */}
      <div className="h-[340px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2333" vertical={false} />

            <XAxis
              dataKey="step"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(s) => `T+${s}`}
              tickLine={false}
              axisLine={{ stroke: '#232738' }}
            />

            <YAxis
              yAxisId="price"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => {
                if (v < 0.00001) return v.toExponential(1);
                return v.toFixed(4);
              }}
              tickLine={false}
              axisLine={{ stroke: '#232738' }}
              domain={['auto', 'auto']}
            />

            <YAxis
              yAxisId="fee"
              orientation="right"
              stroke="#FF8800"
              fontSize={10}
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              tickLine={false}
              axisLine={false}
              domain={[0, (genome.dynamicFees.maxFeeBps / 100) * 1.5]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as (typeof chartData)[0];
                  return (
                    <div className="rounded-lg border border-surface-borderLight bg-surface-300/95 p-3 shadow-2xl backdrop-blur-md">
                      <div className="text-[11px] font-mono text-gray-400 border-b border-surface-border pb-1.5 mb-1.5 flex items-center justify-between gap-4">
                        <span>Block Step: T+{data.step}</span>
                        <span className="text-brand-cyan">
                          Grad: {data.graduationPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Price:</span>
                          <span className="font-bold text-brand-cyan">
                            {formatPrice(data.priceSol)} SOL
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Sol In Pool:</span>
                          <span className="text-brand-teal">
                            {data.solRaised.toFixed(2)} SOL
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Active Dynamic Fee:</span>
                          <span className="text-brand-orange font-bold">
                            {data.feeBps.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Graduation Event Line */}
            {simulation.graduationStep && (
              <ReferenceLine
                yAxisId="price"
                x={simulation.graduationStep}
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: '🎉 GRADUATION TO DLMM',
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}

            {/* Highlight step during replay */}
            {highlightStep !== undefined && (
              <ReferenceLine
                yAxisId="price"
                x={highlightStep}
                stroke="#FEE440"
                strokeWidth={2}
              />
            )}

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="priceSol"
              stroke="#00F5D4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#00F5D4' }}
            />

            <Line
              yAxisId="fee"
              type="stepAfter"
              dataKey="feeBps"
              stroke="#FF8800"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
