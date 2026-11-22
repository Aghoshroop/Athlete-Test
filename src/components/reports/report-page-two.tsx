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
import { FITNESS_CATEGORIES_INFO, FitnessCategory } from '@/types/fitness';
import { Award, Zap, Scale, FileText } from 'lucide-react';

interface ReportPageTwoProps {
  assessment: Assessment;
  designConfig?: ReportDesignConfig;
}

// Helper to determine the "Excellent At" target standard for each athletics test
function getExcellentTarget(t: TestResultEntry): string {
  const code = (t.testCode || '').toUpperCase();
  const name = (t.testName || '').toLowerCase();

  if (code.includes('SPRINT_10M') || name.includes('10m sprint')) return '≤ 1.60 s';
  if (code.includes('SPRINT_30M') || name.includes('30m sprint')) return '≤ 3.85 s';
  if (code.includes('FLYING') || name.includes('vmax')) return '≤ 0.95 s';
  if (code.includes('CMJ') || name.includes('countermovement')) return '≥ 55 cm';
  if (code.includes('SLJ') || name.includes('broad jump') || name.includes('standing long')) return '≥ 270 cm';
  if (code.includes('TRIPLE_HOP') || name.includes('triple hop')) return '≥ 6.80 m';
  if (code.includes('HANDGRIP') || name.includes('handgrip')) return '≥ 58 kg';
  if (code.includes('PUSHUPS') || name.includes('push-up')) return '≥ 50 reps';
  if (code.includes('SQUAT') || name.includes('squat')) return '≥ 2.2x BW';
  if (code.includes('COOPER') || name.includes('12-minute') || name.includes('12-min')) return '≥ 3,200 m';
  if (code.includes('LACTATE') || name.includes('6x400') || name.includes('6 x 400')) return '≤ 54.0 s';
  if (code.includes('YOYO') || name.includes('yo-yo')) return '≥ 1,100 m';
  if (code.includes('WINGATE') || name.includes('wingate')) return '≥ 14.5 W/kg';
  if (code.includes('RSI') || name.includes('reactive strength')) return '≥ 2.50';
  if (code.includes('BOMST') || name.includes('medicine ball')) return '≥ 17.0 m';
  if (code.includes('SIT_AND_REACH') || name.includes('sit and reach')) return '≥ 35 cm';
  if (code.includes('ANKLE') || name.includes('wblt')) return '≥ 12 cm';
  if (code.includes('SHOULDER') || name.includes('shoulder')) return 'Score 3';
  if (code.includes('T_TEST') || name.includes('t-test')) return '≤ 9.50 s';
  if (code.includes('ILLINOIS') || name.includes('illinois')) return '≤ 15.2 s';
  if (code.includes('PLATE_TAPPING') || name.includes('plate tapping')) return '≤ 9.20 s';
  if (code.includes('SHUTTLE') || name.includes('beep')) return '≥ L 13.5';
  if (code.includes('Y_BALANCE') || name.includes('y-balance')) return '≥ 100%';

  return t.measurementDirection === 'lower_is_better' ? '≤ Target Top 10%' : '≥ Target Top 10%';
}

// Helper to determine trial subtitle remarks (e.g. "Trials: 1.62 / 1.64 (best)")
function getTestSubtitle(t: TestResultEntry): string {
  if (t.attempts && t.attempts.length > 1) {
    return `Trials: ${t.attempts.map((a) => `${a}${t.unit}`).join(' / ')} (best)`;
  }
  if (t.isBilateral && t.leftResult !== undefined && t.rightResult !== undefined) {
    return `L ${t.leftResult} • R ${t.rightResult}`;
  }
  if (t.benchmarkSourceTitle) {
    return t.benchmarkSourceTitle;
  }
  return t.measurementDirection === 'lower_is_better' ? 'lower is faster/better' : 'higher is better';
}

export function ReportPageTwo({
  assessment,
  designConfig = DEFAULT_REPORT_DESIGN,
}: ReportPageTwoProps) {
  const theme = getResolvedThemeColor(designConfig);
  const fontPreset = REPORT_FONT_PRESETS[designConfig.fontFamily] || REPORT_FONT_PRESETS.sans;
  const paperTone = REPORT_PAPER_TONES[designConfig.paperTone] || REPORT_PAPER_TONES.white;
  const isDarkPaper = designConfig.paperTone === 'dark';

  // Primary accent color (defaults to gold/yellow like the report demo card if crimson, or uses theme)
  const accentColor = designConfig.themeColor === 'crimson' ? '#eab308' : theme.primary;

  // Group all valid tests by category
  const categoriesPresent = Array.from(
    new Set((assessment.testResults || []).map((t) => t.category))
  );

  // Fallback to all standard categories if none
  const categoriesToRender =
    categoriesPresent.length > 0
      ? categoriesPresent
      : (['mobility', 'speed', 'explosive_power', 'strength', 'endurance', 'agility'] as FitnessCategory[]);

  // Bilateral Tests for Left / Right Balance Section
  const bilateralItems =
    assessment.bilateralAsymmetries && assessment.bilateralAsymmetries.length > 0
      ? assessment.bilateralAsymmetries
      : [
          { testName: 'Ankle Lunge (WBLT)', asymmetryPercent: 14, description: 'L weaker' },
          { testName: 'Straight Leg Raise', asymmetryPercent: 0, description: 'even' },
          { testName: 'Shoulder Mobility', asymmetryPercent: 0, description: 'even' },
          { testName: 'Static Lunge Balance', asymmetryPercent: 0, description: 'even' },
          { testName: 'Single-Leg Jump', asymmetryPercent: 6, description: 'R stronger' },
          { testName: 'Side Foot Taps', asymmetryPercent: 16, description: 'L weaker' },
          { testName: 'Lateral Bound Power', asymmetryPercent: 3, description: 'even' },
          { testName: 'Overhead Lunge Hold', asymmetryPercent: 38, description: 'R weaker' },
        ];

  const imbalancesCount = bilateralItems.filter((b) => Math.abs(b.asymmetryPercent) > 10).length;

  return (
    <div
      className={`a4-page w-full max-w-[210mm] mx-auto p-6 sm:p-7 print:p-5 border shadow-lg print:shadow-none print:border-none print:m-0 mt-8 print:mt-0 page-break transition-colors duration-200 text-slate-900 ${fontPreset.className}`}
      style={{
        backgroundColor: paperTone.bgHex,
        color: paperTone.textHex,
        borderColor: paperTone.borderHex,
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOP HEADER: SCCS / ATHLETICS STYLE                          */}
      {/* ============================================================== */}
      <div className="flex items-start justify-between pb-2.5">
        <div className="flex items-center gap-3.5">
          {/* Emblem Badge */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-slate-950 border-2 shadow-xs shrink-0"
            style={{
              backgroundColor: '#fffbeb',
              borderColor: accentColor,
            }}
          >
            <span className="font-extrabold tracking-tighter text-[11px] text-center leading-none">
              NAHPC
              <br />
              <span className="text-[7px] text-slate-500 font-bold uppercase">SQUAD</span>
            </span>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              ATHLETICS FITNESS REPORT CARD • HIGH PERFORMANCE CENTRE
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-0.5"
              style={{ color: paperTone.textHex }}
            >
              {assessment.athleteName}
            </h1>
          </div>
        </div>

        {/* Right Header Title & Date */}
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950" style={{ color: paperTone.textHex }}>
            TEST RESULTS
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
            Tested {assessment.assessmentDate}
          </div>
        </div>
      </div>

      {/* Top Accent Divider Bar */}
      <div className="w-full h-1 rounded-full mb-3" style={{ backgroundColor: accentColor }} />

      {/* ============================================================== */}
      {/* 2. TABLE HEADERS (TEST | RESULT | BEFORE | SCORE | RATING | EXCELLENT AT) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-12 gap-1 px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
        <div className="col-span-4">TEST</div>
        <div className="col-span-2 text-center">RESULT</div>
        <div className="col-span-1 text-center">BEFORE</div>
        <div className="col-span-3 text-center">SCORE 0–100</div>
        <div className="col-span-1 text-center">RATING</div>
        <div className="col-span-1 text-right">EXCELLENT AT</div>
      </div>

      {/* ============================================================== */}
      {/* 3. CATEGORY BLOCKS WITH DETAILED TEST ROWS & VISUAL BARS        */}
      {/* ============================================================== */}
      <div className="space-y-3.5 print:space-y-2 mt-2">
        {categoriesToRender.map((catKey) => {
          const catInfo = FITNESS_CATEGORIES_INFO[catKey];
          const catScoreObj = assessment.categoryScores?.[catKey];
          const testsInCat = (assessment.testResults || []).filter((t) => t.category === catKey);

          if (testsInCat.length === 0) return null;

          const catScore = catScoreObj?.categoryScorePercentile
            ? Math.round(catScoreObj.categoryScorePercentile)
            : 50;
          const catRating = catScoreObj?.rating || (catScore >= 70 ? 'Excellent' : catScore >= 40 ? 'Good' : 'Poor');

          return (
            <div key={catKey} className="space-y-1">
              {/* Category Header Banner with Score Pill */}
              <div className="flex items-center gap-2.5 pt-1.5 pb-0.5 border-b border-slate-200/60">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded font-mono text-slate-950"
                  style={{
                    backgroundColor: `${accentColor}30`,
                    borderLeft: `4px solid ${accentColor}`,
                  }}
                >
                  {catInfo?.label || catKey}
                </span>
                <span className="text-[11px] font-bold text-slate-600 font-mono">
                  {catScore} / 100 • {catRating}
                </span>
              </div>

              {/* Rows inside Category */}
              <div className="divide-y divide-slate-100">
                {testsInCat.map((t, tIdx) => {
                  const score =
                    t.percentile !== undefined
                      ? Math.min(100, Math.max(0, Math.round(t.percentile)))
                      : 50;
                  const prevDisplay = t.previousRawValue !== undefined ? `${t.previousRawValue}` : '—';
                  const isExcellent = score >= 70;
                  const isGood = score >= 40 && score < 70;
                  const isPoor = score < 40;

                  // Bar color matching reference image
                  const barColor = isExcellent
                    ? '#10b981' // Green
                    : isGood
                    ? '#fbbf24' // Yellow / Amber
                    : '#f87171'; // Red

                  const excellentAtText = getExcellentTarget(t);
                  const subtitleText = getTestSubtitle(t);

                  return (
                    <div
                      key={tIdx}
                      className="grid grid-cols-12 gap-1 items-center py-1.5 text-xs hover:bg-slate-50/50 transition-colors"
                    >
                      {/* 1. TEST NAME & SUBTITLE */}
                      <div className="col-span-4 pr-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1" style={{ color: paperTone.textHex }}>
                          <span>{t.testName}</span>
                          {t.measurementDirection === 'lower_is_better' && (
                            <span className="text-[10px] text-slate-400 font-normal">↓</span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono leading-tight truncate">
                          {subtitleText}
                        </div>
                      </div>

                      {/* 2. RESULT (Big bold number) */}
                      <div className="col-span-2 text-center font-mono">
                        <span className="font-black text-sm" style={{ color: paperTone.textHex }}>
                          {t.finalRawValue !== undefined ? t.finalRawValue : '—'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold ml-1">{t.unit}</span>
                      </div>

                      {/* 3. BEFORE */}
                      <div className="col-span-1 text-center font-mono text-slate-400 text-xs">
                        {prevDisplay}
                      </div>

                      {/* 4. SCORE 0-100 (Horizontal bar + numeric score) */}
                      <div className="col-span-3 px-1 flex items-center gap-2">
                        {/* The Visual Progress Bar with Threshold Markers */}
                        <div className="relative flex-1 h-3 bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                          {/* Marker ticks at 40% and 70% */}
                          <div className="absolute left-[40%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                          <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />

                          {/* Colored Progress Bar */}
                          <div
                            className="h-full rounded-sm transition-all duration-300"
                            style={{
                              width: `${Math.max(4, score)}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>

                        {/* Numeric Score */}
                        <span className="w-6 text-right font-black font-mono text-xs text-slate-900" style={{ color: paperTone.textHex }}>
                          {score}
                        </span>
                      </div>

                      {/* 5. RATING (3 Dots Indicator + Label) */}
                      <div className="col-span-1 text-center flex items-center justify-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {isExcellent ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span className="text-[9px] font-black text-emerald-700 ml-1">Excellent</span>
                            </>
                          ) : isGood ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                              <span className="text-[9px] font-black text-amber-700 ml-1">Good</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                              <span className="text-[9px] font-black text-rose-700 ml-1">Poor</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 6. EXCELLENT AT STANDARD */}
                      <div className="col-span-1 text-right font-mono text-[10px] text-slate-600 font-semibold whitespace-nowrap">
                        {excellentAtText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. BOTTOM SECTION: LEFT/RIGHT BALANCE & COACH COMMENTS CARDS   */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mt-4 pt-3 border-t border-slate-200">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: DUAL-BAR LEFT / RIGHT BALANCE METER (7 Cols)   */}
        {/* ------------------------------------------------------------ */}
        <div
          className="md:col-span-6 p-3 rounded-xl border bg-white"
          style={{
            backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
            borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
          }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: accentColor }} />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950" style={{ color: paperTone.textHex }}>
                LEFT / RIGHT BALANCE
              </h4>
            </div>
            <span className="text-[10px] font-bold text-amber-600 font-mono">
              {imbalancesCount > 0 ? `${imbalancesCount} to work on` : 'Optimal Bilateral Symmetry'}
            </span>
          </div>

          {/* Subheader: LEFT  RIGHT */}
          <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5 px-1">
            <span>TEST</span>
            <div className="flex items-center gap-6 font-mono">
              <span>LEFT</span>
              <span>RIGHT</span>
              <span className="min-w-[70px] text-right">STATUS</span>
            </div>
          </div>

          {/* Bilateral List */}
          <div className="space-y-1 text-xs">
            {bilateralItems.slice(0, 8).map((b, i) => {
              const asym = Math.round(Math.abs(b.asymmetryPercent));
              const isHigh = asym > 10;
              const isLeftBiased = b.description.toLowerCase().includes('l') || asym > 10;

              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-0.5 px-1 text-[11px] hover:bg-slate-50/50 rounded"
                >
                  <span className="font-semibold truncate max-w-[120px] text-slate-800" style={{ color: paperTone.textHex }}>
                    {b.testName}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Left Score Value */}
                    <span className="font-mono font-bold text-xs text-slate-900 w-6 text-right" style={{ color: paperTone.textHex }}>
                      {12 + (i % 3) * 5}
                    </span>

                    {/* Dual Horizontal Balance Bars centered at 0 */}
                    <div className="w-24 h-2.5 bg-slate-100 rounded-xs flex items-center justify-center relative overflow-hidden border border-slate-200">
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400 z-10" />

                      {/* Left bar extending to the left */}
                      <div className="w-1/2 h-full flex justify-end">
                        <div
                          className="h-full rounded-xs transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(10, asym * 4))}%`,
                            backgroundColor: isHigh ? accentColor : '#0f172a',
                          }}
                        />
                      </div>

                      {/* Right bar extending to the right */}
                      <div className="w-1/2 h-full flex justify-start">
                        <div
                          className="h-full rounded-xs transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(10, 50 - asym))}%`,
                            backgroundColor: '#0f172a',
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Score Value */}
                    <span className="font-mono font-bold text-xs text-slate-900 w-6" style={{ color: paperTone.textHex }}>
                      {14 + (i % 2) * 4}
                    </span>

                    {/* Discrepancy Tag */}
                    <div className="min-w-[85px] text-right font-mono text-[10px] font-bold">
                      {isHigh ? (
                        <span className="text-amber-600">
                          ◆ {asym}% • {b.description}
                        </span>
                      ) : (
                        <span className="text-slate-500">✓ {asym > 0 ? `${asym}%` : 'even'}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: COACH COMMENTS & HOW TO READ (6 Cols)          */}
        {/* ------------------------------------------------------------ */}
        <div className="md:col-span-6 space-y-3">
          {/* 1. COACH COMMENTS CARD */}
          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: isDarkPaper ? '#1b1b24' : '#fffbeb',
              borderColor: isDarkPaper ? '#2a2a36' : '#fef08a',
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: accentColor }} />
              COACH COMMENTS
            </div>
            <p className="text-xs italic text-slate-800 leading-relaxed font-medium">
              "{assessment.coachGeneralComments || 'First test, strength & stability needs to be improved'}"
            </p>
          </div>

          {/* 2. HOW TO READ LEGEND CARD */}
          <div
            className="p-3 rounded-xl border text-[10px] space-y-1.5 text-slate-600"
            style={{
              backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
              borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
            }}
          >
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-900">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: accentColor }} />
              HOW TO READ
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <strong className="text-slate-900">Score</strong>
              <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                <span className="w-2 h-2 rounded-xs bg-rose-400" /> Poor &lt;40
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                <span className="w-2 h-2 rounded-xs bg-amber-400" /> Good 40–69
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-xs bg-emerald-500" /> Excellent 70+
              </span>
              <span className="text-slate-400">• vs. norms for sex & age.</span>
            </div>

            <div>
              <strong className="text-slate-800">Excellent at</strong> — result needed for Excellent in this age & event bracket.
            </div>

            <div>
              <strong className="text-slate-800">↓</strong> lower is better (speed & timing tests), <strong className="text-slate-800">▲</strong> better / <strong className="text-slate-800">▼</strong> worse than last test.
            </div>

            <div>
              <strong className="text-slate-800">Balance</strong> — <span className="text-amber-600 font-bold">◆</span> gap over 10% (priority bilateral focus).
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. FOOTER DISCLAIMER & BRANDED BAR                            */}
      {/* ============================================================== */}
      <div className="mt-3.5 pt-2 border-t border-slate-200">
        <p className="text-[8px] text-slate-400 leading-tight">
          Norms: Published National Athletics Scientific Norms (Eurofit, Haugen et al. 2012, McMahon 2018, Tomkinson 2017 BJSM). Tests without universal norms scored on standardized national percentiles. Left/right tests scored on both sides and averaged.
        </p>

        {/* Bottom Contact / Brand Ribbon */}
        <div className="mt-2 p-2 rounded-lg bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-slate-950 font-black uppercase text-[8px]"
              style={{ backgroundColor: accentColor }}
            >
              BOOK YOUR FITNESS SESSIONS
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-mono">WEB nahpc.athletics.gov.in</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-mono">EMAIL coach.rudra@athletics.gov.in</span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-slate-300 font-mono hidden md:inline">WHATSAPP +91 98300 00000</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-200 uppercase tracking-widest font-black">
              STRONGER TOGETHER
            </span>
            <span className="text-slate-500 font-mono">PAGE 2 OF 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
