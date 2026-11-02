'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Assessment } from '@/types/assessment';

interface ProgressionChartProps {
  assessments: Assessment[];
}

export function ProgressionChart({ assessments }: ProgressionChartProps) {
  // Sort chronologically ascending
  const sorted = [...assessments].sort(
    (a, b) => new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime()
  );

  const data = sorted.map((ass) => ({
    date: ass.assessmentDate,
    overallScore: ass.overallFitnessScore ?? 0,
    speed: ass.categoryScores?.speed?.categoryScorePercentile ?? 0,
    explosivePower: ass.categoryScores?.explosive_power?.categoryScorePercentile ?? 0,
    strength: ass.categoryScores?.strength?.categoryScorePercentile ?? 0,
    acceleration: ass.categoryScores?.acceleration?.categoryScorePercentile ?? 0,
  }));

  if (data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-500">No longitudinal assessments recorded yet.</div>;
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="overallScore"
            name="Overall Fitness Score"
            stroke="#eab308"
            strokeWidth={3}
            dot={{ r: 5, fill: '#eab308' }}
          />
          <Line
            type="monotone"
            dataKey="speed"
            name="Speed"
            stroke="#3b82f6"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="explosivePower"
            name="Explosive Power"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="acceleration"
            name="Acceleration"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
