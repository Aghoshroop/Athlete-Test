'use client';

import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface FitnessRadarChartProps {
  currentAssessment: Assessment;
  previousAssessment?: Assessment;
  defaultMode?: 'events' | 'categories';
  accentColor?: string;
}

function getShortEventLabel(testName: string, category: FitnessCategory): string {
  const lower = testName.toLowerCase();
  if (lower.includes('10m sprint')) return '10m Sprint';
  if (lower.includes('30m sprint')) return '30m Sprint';
  if (lower.includes('flying 10m')) return 'Flying 10m';
  if (lower.includes('cooper')) return '12-Min Cooper';
  if (lower.includes('lactate tolerance') || testName.includes('6 x 400') || testName.includes('6x400')) return '6x400m Lactate';
  if (lower.includes('yo-yo') || lower.includes('yoyo')) return 'Yo-Yo IR2';
  if (lower.includes('countermovement') || testName.includes('CMJ')) return 'CMJ Jump';
  if (lower.includes('standing long jump') || lower.includes('broad jump')) return 'Standing Long Jump';
  if (lower.includes('reactive strength') || testName.includes('RSI')) return 'RSI Drop Jump';
  if (lower.includes('wingate')) return 'Wingate 30s';
  if (lower.includes('overhead medicine') || lower.includes('bomst')) return 'BOMST Medball';
  if (lower.includes('squat 1rm') || lower.includes('back squat')) return 'Relative Squat';
  if (lower.includes('handgrip')) return 'Handgrip';
  if (lower.includes('sit and reach') || lower.includes('sit & reach')) return 'Sit & Reach';
  if (lower.includes('ankle') || lower.includes('wblt')) return 'Ankle Lunge';
  if (lower.includes('shoulder')) return 'Shoulder Mobility';
  if (lower.includes('t-test')) return 'T-Test Agility';
  if (lower.includes('illinois')) return 'Illinois Agility';
  if (lower.includes('plate tapping')) return 'Plate Tapping';
  if (lower.includes('shuttle') || lower.includes('beep')) return '20m Shuttle';
  if (lower.includes('y-balance')) return 'Y-Balance';
  if (lower.includes('triple hop')) return 'Triple Hop';

  // Fallback: truncate cleanly
  return testName.length > 18 ? testName.slice(0, 16) + '...' : testName;
}

export function FitnessRadarChart({
  currentAssessment,
  previousAssessment,
  defaultMode = 'events',
  accentColor,
}: FitnessRadarChartProps) {
  const [viewMode, setViewMode] = useState<'events' | 'categories'>(defaultMode);

  // 1. Extract ONLY the events/tests that were actually inserted and recorded
  const validTests = (currentAssessment?.testResults || []).filter(
    (t) => !t.isMissing && t.finalRawValue !== undefined && t.percentile !== undefined
  );

  // 2. Extract ONLY the categories that have at least one valid inserted test
  const validCategories = (Object.keys(FITNESS_CATEGORIES_INFO) as FitnessCategory[]).filter((cat) => {
    const catScore = currentAssessment?.categoryScores?.[cat];
    const hasValidTest = validTests.some((t) => t.category === cat);
    return (catScore && catScore.validTestsCount > 0 && catScore.categoryScorePercentile > 0) || hasValidTest;
  });

  // Empty state: no tests inserted yet
  if (validTests.length === 0) {
    return (
      <div className="w-full h-[320px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-sm text-slate-800">No Evaluated Events</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Record test measurements in the assessment form to generate the athletic performance radar profile.
        </p>
      </div>
    );
  }

  // Build chartData based on selected view mode (ONLY inserted items, NO uninserted types!)
  let chartData: Array<{
    axisLabel: string;
    fullEventName: string;
    categoryLabel: string;
    categoryColor: string;
    current: number;
    previous?: number;
    rawValue?: string;
    rating?: string;
    fullMark: number;
  }> = [];

  if (viewMode === 'events' && validTests.length > 0) {
    chartData = validTests.map((t) => {
      const shortName = getShortEventLabel(t.testName, t.category);
      const catInfo = FITNESS_CATEGORIES_INFO[t.category];

      // Match previous test result if previous assessment is provided
      const prevTest = previousAssessment?.testResults?.find(
        (pt) => pt.testCode === t.testCode || pt.testId === t.testId
      );
      const prevScore = (prevTest && !prevTest.isMissing && prevTest.percentile !== undefined)
        ? prevTest.percentile
        : undefined;

      return {
        axisLabel: shortName,
        fullEventName: t.testName,
        categoryLabel: catInfo?.label ?? t.category,
        categoryColor: catInfo?.color ?? '#eab308',
        current: Math.round((t.percentile ?? 0) * 10) / 10,
        previous: prevScore !== undefined ? Math.round(prevScore * 10) / 10 : undefined,
        rawValue: `${t.finalRawValue} ${t.unit}`,
        rating: t.rating ?? 'Average',
        fullMark: 100,
      };
    });
  } else {
    // Categories mode: ONLY categories where tests were inserted!
    chartData = validCategories.map((cat) => {
      const catInfo = FITNESS_CATEGORIES_INFO[cat];
      const currScore = currentAssessment.categoryScores?.[cat]?.categoryScorePercentile ?? 0;
      const prevScore = previousAssessment?.categoryScores?.[cat]?.categoryScorePercentile;

      return {
        axisLabel: catInfo.label,
        fullEventName: catInfo.label,
        categoryLabel: catInfo.label,
        categoryColor: catInfo.color ?? '#eab308',
        current: Math.round(currScore * 10) / 10,
        previous: prevScore !== undefined && prevScore > 0 ? Math.round(prevScore * 10) / 10 : undefined,
        rawValue: `${currScore.toFixed(0)}th %ile`,
        rating: currentAssessment.categoryScores?.[cat]?.rating ?? 'Average',
        fullMark: 100,
      };
    });
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* View Mode Toggle Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-slate-100 print:hidden text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-700">
            {chartData.length} Inserted {viewMode === 'events' ? 'Event' : 'Category'}{chartData.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[10px] text-slate-400">
            (Uninserted types excluded)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('events')}
            className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition ${
              viewMode === 'events'
                ? 'bg-white shadow-xs text-slate-900 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            By Events ({validTests.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('categories')}
            className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition ${
              viewMode === 'categories'
                ? 'bg-white shadow-xs text-slate-900 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            By Categories ({validCategories.length})
          </button>
        </div>
      </div>

      {/* Radar Chart Display */}
      <div className="w-full h-[320px] print:h-[275px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="axisLabel"
              tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#cbd5e1"
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
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
              stroke={accentColor || '#eab308'}
              fill={accentColor || '#eab308'}
              fillOpacity={0.45}
              strokeWidth={2.5}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs border border-slate-800">
                    <div className="font-bold text-rose-400">{d.fullEventName}</div>
                    <div className="text-[11px] text-slate-400 mb-1">Category: {d.categoryLabel}</div>
                    {d.rawValue && (
                      <div className="text-[11px] text-slate-300">Raw Value: <span className="font-mono text-white font-bold">{d.rawValue}</span></div>
                    )}
                    <div className="text-[11px] font-bold text-white mt-0.5">
                      Current: {d.current}th percentile ({d.rating})
                    </div>
                    {d.previous !== undefined && (
                      <div className="text-[11px] text-slate-400">
                        Previous: {d.previous}th percentile
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Special Helper for 1 or 2 items (where 2D enclosed polygon needs >= 3 vertices) */}
      {chartData.length < 3 && (
        <div className="w-full mt-2 p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1.5">
            <span className="font-bold text-slate-800">Inserted Performance Summary</span>
            <span className="text-red-800 text-[10px] font-medium">
              (Polygon forms with 3+ events)
            </span>
          </div>
          <div className="space-y-1.5">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.categoryColor }}
                  />
                  <span className="font-bold text-slate-900 truncate text-xs">{d.fullEventName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {d.rawValue && <span className="font-mono text-[11px] text-slate-500">{d.rawValue}</span>}
                  <span className="font-black text-slate-900 text-xs">{d.current}th %ile</span>
                  <Badge variant="yellow" size="sm">{d.rating}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
