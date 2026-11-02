'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Assessment, TestResultEntry } from '@/types/assessment';
import { Scale } from 'lucide-react';

interface BilateralAsymmetryChartProps {
  assessment: Assessment;
}

export function BilateralAsymmetryChart({ assessment }: BilateralAsymmetryChartProps) {
  const bilateralTests = assessment.testResults.filter(
    (t) => t.isBilateral && t.leftResult !== undefined && t.rightResult !== undefined
  );

  if (bilateralTests.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
        No bilateral limb measurements recorded in this assessment.
      </div>
    );
  }

  const chartData = bilateralTests.map((t) => ({
    name: t.testName.split(' ')[0], // short name
    fullName: t.testName,
    unit: t.unit,
    left: t.leftResult,
    right: t.rightResult,
    asymmetry: t.asymmetryPercent ?? 0,
    advantage: t.dominantSideAdvantage ?? 'symmetric',
  }));

  return (
    <div className="space-y-4">
      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val} ${item.payload.unit}`,
                name === 'left' ? 'Left Limb' : 'Right Limb',
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="left" name="Left Limb" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="right" name="Right Limb" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Asymmetry Deficit Summary Table */}
      <div className="space-y-2">
        {chartData.map((d, idx) => {
          const absAsym = Math.abs(d.asymmetry);
          const isBalanced = absAsym <= 10;

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">{d.fullName}</span>
                <span className="text-slate-500 ml-2">
                  (L: {d.left}{d.unit} vs R: {d.right}{d.unit})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">
                  {absAsym.toFixed(1)}% variance
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isBalanced
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isBalanced ? 'Balanced (≤10%)' : `Advantage: ${d.advantage.toUpperCase()}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
