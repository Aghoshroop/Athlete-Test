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
} from 'recharts';
import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';

interface SquadDistributionChartProps {
  athletes: AthleteProfile[];
  assessments: Assessment[];
}

export function SquadDistributionChart({ athletes, assessments }: SquadDistributionChartProps) {
  // Group athletes by squad and calculate average score
  const squadMap: Record<string, { total: number; scoreSum: number; scoreCount: number }> = {};

  athletes.forEach((ath) => {
    const sq = ath.trainingSquad || 'General Track';
    if (!squadMap[sq]) {
      squadMap[sq] = { total: 0, scoreSum: 0, scoreCount: 0 };
    }
    squadMap[sq].total += 1;

    // Find latest assessment
    const latestAss = assessments.find((a) => a.athleteId === ath.id);
    if (latestAss && latestAss.overallFitnessScore) {
      squadMap[sq].scoreSum += latestAss.overallFitnessScore;
      squadMap[sq].scoreCount += 1;
    }
  });

  const chartData = Object.entries(squadMap).map(([squad, stats]) => ({
    name: squad.replace('Senior ', '').replace(' Group', '').replace(' Squad', ''),
    fullName: squad,
    athletesCount: stats.total,
    avgScore: stats.scoreCount > 0 ? Math.round((stats.scoreSum / stats.scoreCount) * 10) / 10 : 75,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Squad Fitness & Readiness Distribution</h3>
          <p className="text-[11px] text-slate-500">Average fitness score index by training squad</p>
        </div>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Composite Scale
        </span>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val}% Average Fitness`,
                item.payload.fullName,
              ]}
            />
            <Bar dataKey="avgScore" name="Squad Average Score" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
