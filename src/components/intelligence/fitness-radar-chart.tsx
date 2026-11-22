'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Assessment } from '@/types/assessment';
import { FitnessCategory, FITNESS_CATEGORIES_INFO } from '@/types/fitness';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, Award } from 'lucide-react';
import { db } from '@/lib/storage/local-storage-db';

interface FitnessRadarChartProps {
  currentAssessment: Assessment;
  previousAssessment?: Assessment;
  bestAssessment?: Assessment;
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
  bestAssessment,
  defaultMode = 'events',
  accentColor = '#dc2626',
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
      <div className="w-full h-[300px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
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

  // Retrieve athlete's historical assessments to compute all-time Personal Bests
  const athleteAssessments = typeof window !== 'undefined' && currentAssessment?.athleteId
    ? db.getAssessmentsForAthlete(currentAssessment.athleteId)
    : [currentAssessment];

  // Build chartData based on selected view mode (ONLY inserted items, NO uninserted types!)
  let chartData: Array<{
    axisLabel: string;
    fullEventName: string;
    categoryLabel: string;
    categoryColor: string;
    current: number;
    previous?: number;
    best?: number;
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
        ? Math.round(prevTest.percentile * 10) / 10
        : undefined;

      // Calculate All-Time Personal Best (PB) across all historical assessments
      let bestScore = Math.round((t.percentile ?? 0) * 10) / 10;
      for (const a of athleteAssessments) {
        const matched = a.testResults?.find(
          (tr) => (tr.testCode === t.testCode || tr.testId === t.testId) && !tr.isMissing && tr.percentile !== undefined
        );
        if (matched && matched.percentile !== undefined && matched.percentile > bestScore) {
          bestScore = Math.round(matched.percentile * 10) / 10;
        }
      }
      if (bestAssessment) {
        const matched = bestAssessment.testResults?.find(
          (tr) => (tr.testCode === t.testCode || tr.testId === t.testId) && !tr.isMissing && tr.percentile !== undefined
        );
        if (matched && matched.percentile !== undefined && matched.percentile > bestScore) {
          bestScore = Math.round(matched.percentile * 10) / 10;
        }
      }

      return {
        axisLabel: shortName,
        fullEventName: t.testName,
        categoryLabel: catInfo?.label ?? t.category,
        categoryColor: catInfo?.color ?? '#dc2626',
        current: Math.round((t.percentile ?? 0) * 10) / 10,
        previous: prevScore,
        best: bestScore,
        rawValue: `${t.finalRawValue} ${t.unit}`,
        rating: t.rating ?? 'Average',
        fullMark: 100,
      };
    });
  } else {
    // Categories mode: ONLY categories where tests were inserted!
    chartData = validCategories.map((cat) => {
      const catInfo = FITNESS_CATEGORIES_INFO[cat];
      const currScore = Math.round((currentAssessment.categoryScores?.[cat]?.categoryScorePercentile ?? 0) * 10) / 10;
      const prevScore = previousAssessment?.categoryScores?.[cat]?.categoryScorePercentile
        ? Math.round(previousAssessment.categoryScores[cat]!.categoryScorePercentile * 10) / 10
        : undefined;

      // Personal Best for category
      let bestScore = currScore;
      for (const a of athleteAssessments) {
        const catScore = a.categoryScores?.[cat]?.categoryScorePercentile;
        if (catScore !== undefined && catScore > bestScore) {
          bestScore = Math.round(catScore * 10) / 10;
        }
      }

      return {
        axisLabel: catInfo.label,
        fullEventName: catInfo.label,
        categoryLabel: catInfo.label,
        categoryColor: catInfo.color ?? '#dc2626',
        current: currScore,
        previous: prevScore,
        best: bestScore,
        rawValue: `${currScore.toFixed(0)}th %ile`,
        rating: currentAssessment.categoryScores?.[cat]?.rating ?? 'Average',
        fullMark: 100,
      };
    });
  }

  // Summary Metrics for the Right-Side Indicator Panel
  const avgCurrent =
    chartData.length > 0
      ? chartData.reduce((acc, d) => acc + d.current, 0) / chartData.length
      : 0;

  const validPrev = chartData.filter((d) => d.previous !== undefined);
  const avgPrevious =
    validPrev.length > 0
      ? validPrev.reduce((acc, d) => acc + (d.previous || 0), 0) / validPrev.length
      : undefined;

  const avgBest =
    chartData.length > 0
      ? chartData.reduce((acc, d) => acc + (d.best ?? d.current), 0) / chartData.length
      : avgCurrent;

  return (
    <div className="w-full flex flex-col">
      {/* View Mode Toggle Header */}
      <div className="w-full flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 print:hidden text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-700">
            {chartData.length} Evaluated {viewMode === 'events' ? 'Event' : 'Category'}{chartData.length !== 1 ? 's' : ''}
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

      {/* Main Radar Layout: Chart on Left, Indicators inside the box on Right */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 min-h-[280px] print:min-h-[250px]">
        {/* Radar Chart Display (Left / Center) */}
        <div className="flex-1 w-full h-[270px] print:h-[245px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="axisLabel"
                tick={{ fill: '#1e293b', fontSize: 10, fontWeight: 700 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#cbd5e1"
                tick={{ fontSize: 9, fill: '#64748b' }}
              />

              {/* 1. Personal Best (All-Time Peak) - Gold Dashed */}
              <Radar
                name="Personal Best"
                dataKey="best"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.12}
                strokeWidth={2}
                strokeDasharray="4 4"
              />

              {/* 2. Previous Assessment - Slate */}
              {previousAssessment && (
                <Radar
                  name={`Previous (${previousAssessment.assessmentDate})`}
                  dataKey="previous"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.2}
                  strokeWidth={1.5}
                />
              )}

              {/* 3. Current Assessment - Crimson Red / Accent */}
              <Radar
                name={`Current (${currentAssessment.assessmentDate})`}
                dataKey="current"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.42}
                strokeWidth={2.5}
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
                        <div className="text-[11px] text-slate-300">
                          Raw: <span className="font-mono text-white font-bold">{d.rawValue}</span>
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-white mt-0.5">
                        Current: {d.current}th %ile ({d.rating})
                      </div>
                      {d.previous !== undefined && (
                        <div className="text-[11px] text-slate-400">
                          Previous: {d.previous}th %ile
                        </div>
                      )}
                      {d.best !== undefined && (
                        <div className="text-[11px] text-amber-400 font-bold">
                          Personal Best: {d.best}th %ile
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ============================================================== */}
        {/* INDICATOR MARKS PANEL (INSIDE BOX ON THE RIGHT SIDE)          */}
        {/* ============================================================== */}
        <div className="w-full sm:w-44 shrink-0 flex flex-col gap-2 p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-mono self-center">
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span>Chart Indicators</span>
            <Award className="w-3 h-3 text-slate-400" />
          </div>

          {/* 1. Current Assessment Indicator */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: accentColor }}
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block text-[11px] leading-tight truncate">
                  Current
                </span>
                <span className="text-[9px] text-slate-500 block leading-tight">
                  {currentAssessment.assessmentDate}
                </span>
              </div>
            </div>
            <span className="font-black text-[11px] text-slate-900 shrink-0">
              {avgCurrent.toFixed(0)}%
            </span>
          </div>

          {/* 2. Previous Assessment Indicator */}
          {previousAssessment && (
            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-slate-400" />
                <div className="min-w-0">
                  <span className="font-bold text-slate-700 block text-[11px] leading-tight truncate">
                    Previous
                  </span>
                  <span className="text-[9px] text-slate-500 block leading-tight">
                    {previousAssessment.assessmentDate}
                  </span>
                </div>
              </div>
              <span className="font-bold text-[11px] text-slate-600 shrink-0">
                {avgPrevious !== undefined ? `${avgPrevious.toFixed(0)}%` : '—'}
              </span>
            </div>
          )}

          {/* 3. Personal Best Indicator (All-Time Best Peak) */}
          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-500 border border-amber-600 shadow-xs" />
              <div className="min-w-0">
                <span className="font-bold text-amber-900 block text-[11px] leading-tight truncate flex items-center gap-1">
                  Personal Best
                </span>
                <span className="text-[9px] text-amber-700/80 block leading-tight">
                  All-Time Peak
                </span>
              </div>
            </div>
            <span className="font-black text-[11px] text-amber-800 shrink-0">
              {avgBest.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Special Helper for 1 or 2 items (where 2D polygon needs >= 3 vertices) */}
      {chartData.length < 3 && (
        <div className="w-full mt-2 p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1.5">
            <span className="font-bold text-slate-800">Evaluated Performance Summary</span>
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
