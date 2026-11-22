'use client';

import React from 'react';
import { Assessment, TestResultEntry } from '@/types/assessment';
import {
  ReportDesignConfig,
  DEFAULT_REPORT_DESIGN,
  getResolvedThemeColor,
  REPORT_FONT_PRESETS,
  REPORT_PAPER_TONES,
} from '@/types/report-design';
import { BookOpen, Scale, FileText, BarChart3, TrendingUp, Award, Activity } from 'lucide-react';
import { FITNESS_CATEGORIES_INFO } from '@/types/fitness';

interface ReportPageTwoProps {
  assessment: Assessment;
  designConfig?: ReportDesignConfig;
}

export function ReportPageTwo({
  assessment,
  designConfig = DEFAULT_REPORT_DESIGN,
}: ReportPageTwoProps) {
  const theme = getResolvedThemeColor(designConfig);
  const fontPreset = REPORT_FONT_PRESETS[designConfig.fontFamily] || REPORT_FONT_PRESETS.sans;
  const paperTone = REPORT_PAPER_TONES[designConfig.paperTone] || REPORT_PAPER_TONES.white;
  const isDarkPaper = designConfig.paperTone === 'dark';

  // Extract all tested entries with valid percentiles
  const validTests = (assessment.testResults || []).filter(
    (t) => !t.isMissing && t.finalRawValue !== undefined
  );

  const showGraphSection =
    designConfig.pageTwoGraphMode === 'both' || designConfig.pageTwoGraphMode === 'graph-first';
  const showTableSection =
    designConfig.pageTwoGraphMode === 'both' ||
    designConfig.pageTwoGraphMode === 'table-first' ||
    designConfig.pageTwoGraphMode === 'graph-first';

  return (
    <div
      className={`a4-page w-full max-w-[210mm] mx-auto p-6 sm:p-8 print:p-5 border shadow-lg print:shadow-none print:border-none print:m-0 mt-8 print:mt-0 page-break transition-colors duration-200 ${fontPreset.className}`}
      style={{
        backgroundColor: paperTone.bgHex,
        color: paperTone.textHex,
        borderColor: paperTone.borderHex,
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between pb-3 border-b-2"
        style={{ borderColor: theme.primary }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black tracking-widest uppercase text-white px-2.5 py-0.5 rounded shadow-xs"
              style={{ backgroundColor: theme.primary }}
            >
              ATHLETICS PERFORMANCE REPORT
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PAGE 2 OF 2 • DETAILED RESULTS
            </span>
          </div>
          <h2 className="text-xl font-black mt-1 tracking-tight" style={{ color: paperTone.textHex }}>
            DETAILED METRIC PERFORMANCE & SCIENTIFIC NORMS
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Athlete: <span className="font-bold text-slate-900">{assessment.athleteName}</span> (
            {assessment.athleteCode}) • Testing Date: {assessment.assessmentDate}
          </p>
        </div>

        {/* Quick Legend for Olympic Norm Zones */}
        {designConfig.showNormZones && (
          <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold p-1.5 rounded-lg border border-slate-200/60 bg-white/50">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">&lt;50% Below</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">50-74% Good</span>
            <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">75-89% Adv</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">90%+ Elite</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. VISUAL METRIC GRAPH SHOW: EVENT BENCHMARK DISTRIBUTION BARS */}
      {/* ============================================================== */}
      {showGraphSection && validTests.length > 0 && (
        <div className="my-4 print:my-2">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200/80">
            <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.primary }}>
              <BarChart3 className="w-4 h-4" />
              Detailed Event Metrics Benchmark Graph (0 - 100th %ile)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Evaluated Events: {validTests.length}
            </span>
          </div>

          <div className="space-y-2.5 print:space-y-1.5">
            {validTests.map((t, idx) => {
              const pct = t.percentile !== undefined ? Math.min(100, Math.max(0, t.percentile)) : 0;
              const catInfo = FITNESS_CATEGORIES_INFO[t.category];
              const prevPct = t.previousRawValue !== undefined && t.percentile !== undefined ? t.percentile : undefined;

              // Benchmark status colors
              const barColor =
                pct >= 90
                  ? '#059669' // Elite Emerald
                  : pct >= 75
                  ? '#0d9488' // Advanced Teal
                  : pct >= 50
                  ? '#d97706' // National Average Amber
                  : theme.primary; // Accent / Baseline

              return (
                <div
                  key={idx}
                  className="p-2.5 print:p-1.5 rounded-xl border transition"
                  style={{
                    backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
                    borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate" style={{ color: paperTone.textHex }}>
                        {t.testName}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase"
                        style={{
                          color: catInfo?.color ?? '#dc2626',
                          backgroundColor: `${catInfo?.color ?? '#dc2626'}15`,
                          border: `1px solid ${catInfo?.color ?? '#dc2626'}30`,
                        }}
                      >
                        {catInfo?.label ?? t.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-extrabold text-slate-900" style={{ color: paperTone.textHex }}>
                        {t.finalRawValue} {t.unit}
                      </span>
                      {t.rawDelta !== undefined && (
                        <span
                          className={`text-[10px] font-bold ${
                            (t.measurementDirection === 'lower_is_better' ? t.rawDelta < 0 : t.rawDelta > 0)
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {t.rawDelta > 0 ? `+${t.rawDelta}` : t.rawDelta} {t.unit}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-black px-1.5 py-0.5 rounded text-white shadow-2xs"
                        style={{ backgroundColor: barColor }}
                      >
                        {pct.toFixed(0)}%ile • {t.rating ?? 'Unbenchmarked'}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Visual Percentile Benchmark Meter */}
                  <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                    {/* Zone background shading if enabled */}
                    {designConfig.showNormZones && (
                      <div className="absolute inset-0 flex text-[8px] font-mono pointer-events-none opacity-40">
                        <div className="w-[50%] bg-slate-200 border-r border-slate-300 flex items-center justify-center text-slate-500">
                          Below Avg
                        </div>
                        <div className="w-[25%] bg-amber-100 border-r border-amber-300 flex items-center justify-center text-amber-700">
                          Average
                        </div>
                        <div className="w-[15%] bg-teal-100 border-r border-teal-300 flex items-center justify-center text-teal-800">
                          Advanced
                        </div>
                        <div className="w-[10%] bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                          Elite
                        </div>
                      </div>
                    )}

                    {/* Progress Bar of Athlete's Result */}
                    <div
                      className="h-full rounded-full transition-all duration-500 relative"
                      style={{
                        width: `${Math.max(4, pct)}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>

                  {/* Source reference citation */}
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                    <span>
                      Standard: <strong className="text-slate-600">{t.benchmarkSourceTitle || 'Official Protocol Standard'}</strong>
                    </span>
                    <span>
                      Direction: {t.measurementDirection === 'lower_is_better' ? '↓ Lower is faster/better' : '↑ Higher is better'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DETAILED MEASUREMENTS TABLE WITH INLINE MICRO-GAUGES        */}
      {/* ============================================================== */}
      {showTableSection && (
        <div className="my-3 print:my-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800" style={{ color: paperTone.textHex }}>
              Metric Measurements & Historical Comparison
            </h4>
            <span className="text-[10px] text-slate-400">Scientific Calibration Model</span>
          </div>

          <table
            className="w-full text-left text-xs border border-slate-300"
            style={{ borderColor: paperTone.borderHex }}
          >
            <thead
              className="text-white font-bold text-[10px] uppercase tracking-wider"
              style={{ backgroundColor: theme.primary }}
            >
              <tr>
                <th className="p-2 border-r border-white/20">Test / Protocol</th>
                <th className="p-2 border-r border-white/20 text-center">Prev</th>
                <th className="p-2 border-r border-white/20 text-center">Curr</th>
                <th className="p-2 border-r border-white/20 text-center">Delta</th>
                <th className="p-2 border-r border-white/20 text-center min-w-[110px]">
                  Visual Norm Gauge (%ile)
                </th>
                <th className="p-2 border-r border-white/20 text-center">Rating</th>
                <th className="p-2 border-r border-white/20">L/R Asymmetry</th>
                <th className="p-2">Benchmark Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assessment.testResults.map((t, idx) => {
                const prevDisplay = t.previousRawValue !== undefined ? `${t.previousRawValue}${t.unit}` : '—';
                const currDisplay = t.finalRawValue !== undefined ? `${t.finalRawValue}${t.unit}` : 'Missing';
                const deltaDisplay =
                  t.rawDelta !== undefined
                    ? t.rawDelta > 0
                      ? `+${t.rawDelta}${t.unit}`
                      : `${t.rawDelta}${t.unit}`
                    : '—';

                const deltaColor =
                  t.rawDelta !== undefined
                    ? (t.measurementDirection === 'lower_is_better' ? t.rawDelta < 0 : t.rawDelta > 0)
                      ? 'text-emerald-700 font-bold'
                      : 'text-rose-700 font-bold'
                    : 'text-slate-400';

                const pct = t.percentile !== undefined ? t.percentile : 0;

                return (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? isDarkPaper
                          ? 'bg-slate-900/60'
                          : 'bg-white'
                        : isDarkPaper
                        ? 'bg-slate-950/40'
                        : 'bg-slate-50/70'
                    }
                  >
                    <td className="p-2 font-bold border-r border-slate-200">
                      <div style={{ color: paperTone.textHex }}>{t.testName}</div>
                      <div className="text-[10px] text-slate-500 font-normal uppercase">{t.category}</div>
                    </td>
                    <td className="p-2 text-center font-mono border-r border-slate-200 whitespace-nowrap">
                      {prevDisplay}
                    </td>
                    <td
                      className="p-2 text-center font-mono font-bold border-r border-slate-200 whitespace-nowrap"
                      style={{ color: paperTone.textHex }}
                    >
                      {currDisplay}
                    </td>
                    <td className={`p-2 text-center font-mono border-r border-slate-200 whitespace-nowrap ${deltaColor}`}>
                      {deltaDisplay}
                    </td>
                    <td className="p-2 border-r border-slate-200 min-w-[110px]">
                      {t.percentile !== undefined ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] font-black font-mono">
                            <span style={{ color: theme.primary }}>{t.percentile.toFixed(0)}%</span>
                            <span className="text-[9px] text-slate-400 font-normal">Rank</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.max(5, pct)}%`,
                                backgroundColor:
                                  pct >= 90
                                    ? '#059669'
                                    : pct >= 75
                                    ? '#0d9488'
                                    : pct >= 50
                                    ? '#d97706'
                                    : theme.primary,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 block text-center">—</span>
                      )}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                        {t.rating ?? 'Unbenchmarked'}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-[11px]">
                      {t.isBilateral && t.asymmetryPercent !== undefined ? (
                        <span className="font-semibold text-slate-800">
                          {Math.abs(t.asymmetryPercent).toFixed(1)}% ({t.dominantSideAdvantage?.toUpperCase()})
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-2 text-[10px] leading-tight text-slate-600 max-w-[180px]">
                      <div className="font-semibold text-slate-800">{t.benchmarkSourceTitle || 'Custom Protocol'}</div>
                      {t.limitationNote && <div className="text-slate-500 italic mt-0.5">{t.limitationNote}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. VISUAL BILATERAL ASYMMETRY GAUGES (IF APPLICABLE)           */}
      {/* ============================================================== */}
      {designConfig.showBilateralGauges &&
        assessment.bilateralAsymmetries &&
        assessment.bilateralAsymmetries.length > 0 && (
          <div
            className="my-3 print:my-2 p-3 print:p-2 rounded-xl border"
            style={{
              backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
              borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
            }}
          >
            <h4
              className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: theme.primary }}
            >
              <Scale className="w-4 h-4" /> Bilateral Symmetry Equilibrium Meters (Left vs. Right)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {assessment.bilateralAsymmetries.map((b, i) => {
                const asym = Math.min(30, Math.max(0, Math.abs(b.asymmetryPercent)));
                const isSafe = asym <= 5;
                const isModerate = asym > 5 && asym <= 10;
                const statusColor = isSafe ? '#059669' : isModerate ? '#d97706' : '#dc2626';
                const isRightDominant = b.asymmetryPercent >= 0;

                return (
                  <div
                    key={i}
                    className="p-2 rounded-lg border bg-white text-xs space-y-1"
                    style={{
                      backgroundColor: isDarkPaper ? '#1b1b24' : '#ffffff',
                      borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
                    }}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span style={{ color: paperTone.textHex }}>{b.testName}</span>
                      <span className="font-mono" style={{ color: statusColor }}>
                        {asym.toFixed(1)}% ({b.description})
                      </span>
                    </div>

                    {/* Center-balanced Visual Slider */}
                    <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(asym / 30) * 50}%`,
                          marginLeft: isRightDominant ? '50%' : `${50 - (asym / 30) * 50}%`,
                          backgroundColor: statusColor,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>LEFT BIAS</span>
                      <span>0% NEUTRAL EQUILIBRIUM</span>
                      <span>RIGHT BIAS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Supervising Coach Observations & Testing Limitations */}
      <div
        className="my-3 print:my-2 p-3 print:p-2 rounded-xl border text-xs"
        style={{
          backgroundColor: theme.lightBg,
          borderColor: theme.accentBorder,
        }}
      >
        <h4 className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: theme.primary }}>
          <FileText className="w-4 h-4" /> Supervising Coach Observations & Prescription
        </h4>
        <p className="text-slate-800 leading-relaxed italic">
          "{assessment.coachGeneralComments || 'Athlete completed all testing blocks in accordance with standardized protocols. Readiness for high volume cycle confirmed.'}"
        </p>
      </div>

      {/* Scientific Methodology Note */}
      <div className="p-3 print:p-2 bg-slate-900 text-white rounded-xl text-[10px] space-y-1">
        <div className="font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: theme.primary }}>
          <BookOpen className="w-3.5 h-3.5" /> Scientific Norm & Attribution Framework
        </div>
        <p className="text-slate-300 leading-relaxed">
          Normative percentiles are calculated exclusively via validated scientific reference tables (e.g. Eurofit, McMahon et al. 2018, Haugen et al. 2012, Tomkinson et al. 2017 BJSM). Tests without validated reference norms are displayed with raw results and progression deltas but excluded from composite percentile calculation.
        </p>
      </div>

      {/* Footer Sign-off */}
      <div className="mt-4 pt-3 print:mt-2 print:pt-2 border-t border-slate-200 flex items-end justify-between text-xs">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase font-bold">Approved & Finalized By:</span>
          <span className="font-bold text-slate-900" style={{ color: paperTone.textHex }}>
            {assessment.coachName}
          </span>
          <span className="block text-[10px] text-slate-500">National High Performance Coach</span>
        </div>

        <div className="text-right">
          <div className="h-8 border-b border-slate-400 w-40 mb-1" />
          <span className="block text-[10px] text-slate-500">Official Signature / Date Stamp</span>
        </div>
      </div>
    </div>
  );
}
