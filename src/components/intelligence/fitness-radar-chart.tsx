'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Assessment } from '@/types/assessment';
import { FitnessCategory, FITNESS_CATEGORIES_INFO } from '@/types/fitness';

interface FitnessRadarChartProps {
  currentAssessment: Assessment;
  previousAssessment?: Assessment;
}

export function FitnessRadarChart({
  currentAssessment,
  previousAssessment,
}: FitnessRadarChartProps) {
  const categories: FitnessCategory[] = [
    'mobility',
    'flexibility',
    'strength',
    'speed',
    'acceleration',
    'explosive_power',
    'agility',
    'coordination',
    'endurance',
    'balance',
  ];

  const chartData = categories.map((cat) => {
    const currScore = currentAssessment.categoryScores?.[cat]?.categoryScorePercentile ?? 0;
    const prevScore = previousAssessment?.categoryScores?.[cat]?.categoryScorePercentile;

    return {
      category: FITNESS_CATEGORIES_INFO[cat].label,
      current: currScore,
      previous: prevScore !== undefined ? prevScore : undefined,
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-[360px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 10 }} />
          {previousAssessment && (
            <Radar
              name={`Previous (${previousAssessment.assessmentDate})`}
              dataKey="previous"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
          )}
          <Radar
            name={`Current (${currentAssessment.assessmentDate})`}
            dataKey="current"
            stroke="#eab308"
            fill="#eab308"
            fillOpacity={0.45}
            strokeWidth={2.5}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
            iconType="circle"
          />
          <Tooltip
            formatter={(value: any) => [`${value}th percentile`, '']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
