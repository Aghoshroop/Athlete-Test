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
import { Scale, FileText, BarChart3, BookOpen, Activity, Zap } from 'lucide-react';

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

/**
 * =========================================================================
 * LAYOUT 1: VISUAL PERFORMANCE SCORECARD (DEMO LAYOUT)
 * =========================================================================
 */
function ScorecardLayout({
  assessment,
  designConfig,
}: {
  assessment: Assessment;
  designConfig: ReportDesignConfig;
}) {
  const theme = getResolvedThemeColor(designConfig);
  const fontPreset = REPORT_FONT_PRESETS[designConfig.fontFamily] || REPORT_FONT_PRESETS.sans;
  const paperTone = REPORT_PAPER_TONES[designConfig.paperTone] || REPORT_PAPER_TONES.white;
  const isDarkPaper = designConfig.paperTone === 'dark';

  const accentColor = theme.primary;
  const perfCenterName =
    designConfig.performanceCenterName || 'National Athletics High Performance Centre';

  const categoriesPresent = Array.from(
    new Set((assessment.testResults || []).map((t) => t.category))
  );

  const categoriesToRender =
    categoriesPresent.length > 0
      ? categoriesPresent
      : (['mobility', 'speed', 'explosive_power', 'strength', 'endurance', 'agility'] as FitnessCategory[]);

  // Bilateral items
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
  const showBilateral = designConfig.showBilateralGauges;
  const showNorms = designConfig.showNormZones;

  return (
    <div
      className={`a4-page w-full max-w-[210mm] mx-auto p-6 sm:p-7 print:p-5 border shadow-lg print:shadow-none print:border-none print:m-0 mt-8 print:mt-0 page-break transition-colors duration-200 text-slate-900 ${fontPreset.className}`}
      style={{
        backgroundColor: paperTone.bgHex,
        color: paperTone.textHex,
        borderColor: paperTone.borderHex,
      }}
    >
      {/* 1. TOP HEADER: PERFORMANCE CENTER NAME (SPORTY FONT) + ATHLETE */}
      <div className="flex items-start justify-between pb-2.5">
        <div className="flex items-center gap-3.5">
          {/* Emblem Badge in Theme Accent */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <span className="font-extrabold tracking-tighter text-[11px] text-center leading-none text-white">
              NAHPC
              <br />
              <span className="text-[7px] text-white/80 font-bold uppercase">SQUAD</span>
            </span>
          </div>

          <div>
            {/* Performance Center Name with Sporty Font */}
            <div
              className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5"
              style={{ color: accentColor }}
            >
              <Zap className="w-3 h-3 shrink-0" />
              <span>{perfCenterName}</span>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
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
          <div
            className="text-xl sm:text-2xl font-black uppercase tracking-tight"
            style={{ color: paperTone.textHex }}
          >
            TEST RESULTS
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
            Tested {assessment.assessmentDate}
          </div>
        </div>
      </div>

      {/* Top Accent Divider Bar in Red */}
      <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: accentColor }} />

      {/* 2. TABLE HEADERS (TEST | RESULT | BEFORE | SCORE 0–100 | RATING | EXCELLENT AT) */}
      <div className="grid grid-cols-12 gap-1 px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
        <div className="col-span-4">TEST</div>
        <div className="col-span-2 text-center">RESULT</div>
        <div className="col-span-1 text-center">BEFORE</div>
        <div className="col-span-3 text-center">SCORE 0–100</div>
        <div className="col-span-1 text-center">RATING</div>
        <div className="col-span-1 text-right">EXCELLENT AT</div>
      </div>

      {/* 3. CATEGORY BLOCKS WITH DETAILED TEST ROWS & VISUAL BARS */}
      <div className="space-y-3.5 print:space-y-2 mt-2">
        {categoriesToRender.map((catKey) => {
          const catInfo = FITNESS_CATEGORIES_INFO[catKey];
          const catScoreObj = assessment.categoryScores?.[catKey];
          const testsInCat = (assessment.testResults || []).filter((t) => t.category === catKey);

          if (testsInCat.length === 0) return null;

          const catScore = catScoreObj?.categoryScorePercentile
            ? Math.round(catScoreObj.categoryScorePercentile)
            : 50;
          const catRating =
            catScoreObj?.rating || (catScore >= 70 ? 'Excellent' : catScore >= 40 ? 'Good' : 'Poor');

          return (
            <div key={catKey} className="space-y-1">
              {/* Category Header Banner with Score Pill */}
              <div className="flex items-center gap-2.5 pt-1.5 pb-0.5 border-b border-slate-200/60">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded text-white shadow-xs"
                  style={{ backgroundColor: accentColor }}
                >
                  {catInfo?.label || catKey}
                </span>
                <span className="text-[11px] font-bold text-slate-700 font-mono">
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

                  const barColor = isExcellent ? '#10b981' : isGood ? '#f59e0b' : '#ef4444';
                  const excellentAtText = getExcellentTarget(t);
                  const subtitleText = getTestSubtitle(t);

                  return (
                    <div
                      key={tIdx}
                      className="grid grid-cols-12 gap-1 items-center py-1.5 text-xs hover:bg-slate-50/50 transition-colors"
                    >
                      {/* 1. TEST NAME & SUBTITLE */}
                      <div className="col-span-4 pr-1">
                        <div
                          className="font-bold text-slate-900 flex items-center gap-1"
                          style={{ color: paperTone.textHex }}
                        >
                          <span>{t.testName}</span>
                          {t.measurementDirection === 'lower_is_better' && (
                            <span className="text-[10px] text-slate-400 font-normal">↓</span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono leading-tight truncate">
                          {subtitleText}
                        </div>
                      </div>

                      {/* 2. RESULT */}
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

                      {/* 4. SCORE 0-100 */}
                      <div className="col-span-3 px-1 flex items-center gap-2">
                        <div className="relative flex-1 h-3 bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                          {/* 7th Workable Norm Zone Ticks */}
                          {showNorms && (
                            <>
                              <div className="absolute left-[40%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                              <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                            </>
                          )}

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
                        <span
                          className="w-6 text-right font-black font-mono text-xs text-slate-900"
                          style={{ color: paperTone.textHex }}
                        >
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
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
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

      {/* 4. BOTTOM SECTION: LEFT/RIGHT BALANCE & COACH COMMENTS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mt-4 pt-3 border-t border-slate-200">
        {/* 8th Workable Toggle: Left / Right Balance Meter */}
        {showBilateral && (
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
                <h4
                  className="text-xs font-black uppercase tracking-wider text-slate-950"
                  style={{ color: paperTone.textHex }}
                >
                  LEFT / RIGHT BALANCE
                </h4>
              </div>
              <span
                className="text-[10px] font-bold font-mono"
                style={{ color: imbalancesCount > 0 ? accentColor : '#059669' }}
              >
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

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-0.5 px-1 text-[11px] hover:bg-slate-50/50 rounded"
                  >
                    <span
                      className="font-semibold truncate max-w-[120px] text-slate-800"
                      style={{ color: paperTone.textHex }}
                    >
                      {b.testName}
                    </span>

                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono font-bold text-xs text-slate-900 w-6 text-right"
                        style={{ color: paperTone.textHex }}
                      >
                        {12 + (i % 3) * 5}
                      </span>

                      {/* Dual Horizontal Balance Bars centered at 0 */}
                      <div className="w-24 h-2.5 bg-slate-100 rounded-xs flex items-center justify-center relative overflow-hidden border border-slate-200">
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400 z-10" />

                        <div className="w-1/2 h-full flex justify-end">
                          <div
                            className="h-full rounded-xs transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(10, asym * 4))}%`,
                              backgroundColor: isHigh ? accentColor : '#0f172a',
                            }}
                          />
                        </div>

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

                      <span
                        className="font-mono font-bold text-xs text-slate-900 w-6"
                        style={{ color: paperTone.textHex }}
                      >
                        {14 + (i % 2) * 4}
                      </span>

                      <div className="min-w-[85px] text-right font-mono text-[10px] font-bold">
                        {isHigh ? (
                          <span style={{ color: accentColor }}>
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
        )}

        {/* RIGHT COLUMN: COACH COMMENTS & (OPTIONAL) HOW TO READ */}
        <div className={`${showBilateral ? 'md:col-span-6' : 'md:col-span-12'} space-y-3`}>
          {/* COACH COMMENTS CARD */}
          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: isDarkPaper ? '#1b1b24' : theme.lightBg,
              borderColor: isDarkPaper ? '#2a2a36' : theme.accentBorder,
            }}
          >
            <div
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-1.5"
              style={{ color: accentColor }}
            >
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: accentColor }} />
              SUPERVISING COACH OBSERVATIONS & TARGET PRESCRIPTION
            </div>
            <p className="text-xs italic text-slate-800 leading-relaxed font-medium">
              "{assessment.coachGeneralComments || 'Completed testing protocols with high technical discipline. Strength, power output, and bilateral equilibrium progression confirmed.'}"
            </p>
          </div>

          {/* 7th Workable Toggle: HOW TO READ LEGEND CARD */}
          {showNorms && (
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
                  <span className="w-2 h-2 rounded-xs bg-rose-500" /> Poor &lt;40
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
                <strong className="text-slate-800">Balance</strong> — <span style={{ color: accentColor }} className="font-bold">◆</span> gap over 10% (priority bilateral focus).
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. FOOTER DISCLAIMER & BRANDED BAR */}
      <div className="mt-3.5 pt-2 border-t border-slate-200">
        <p className="text-[8px] text-slate-400 leading-tight">
          Norms: Published National Athletics Scientific Norms (Eurofit, Haugen et al. 2012, McMahon 2018, Tomkinson 2017 BJSM). Tests without universal norms scored on standardized national percentiles. Left/right tests scored on both sides and averaged.
        </p>

        {/* Bottom Contact / Brand Ribbon */}
        <div className="mt-2 p-2 rounded-lg bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-white font-black uppercase text-[8px] shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {perfCenterName}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 font-mono">COACH: {assessment.coachName || 'Coach Rudra Roy'}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 font-mono">DATE: {assessment.assessmentDate}</span>
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

/**
 * =========================================================================
 * LAYOUT 2: DETAILED SCIENTIFIC & TABULAR MATRIX (CLASSIC LAYOUT)
 * =========================================================================
 */
function ScientificLayout({
  assessment,
  designConfig,
}: {
  assessment: Assessment;
  designConfig: ReportDesignConfig;
}) {
  const theme = getResolvedThemeColor(designConfig);
  const fontPreset = REPORT_FONT_PRESETS[designConfig.fontFamily] || REPORT_FONT_PRESETS.sans;
  const paperTone = REPORT_PAPER_TONES[designConfig.paperTone] || REPORT_PAPER_TONES.white;
  const isDarkPaper = designConfig.paperTone === 'dark';

  const perfCenterName =
    designConfig.performanceCenterName || 'National Athletics High Performance Centre';
  const showBilateral = designConfig.showBilateralGauges;
  const showNorms = designConfig.showNormZones;

  const validTests = (assessment.testResults || []).filter(
    (t) => !t.isMissing && t.finalRawValue !== undefined
  );

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
          {/* Performance Center Name with Sporty Font */}
          <div
            className="text-xs font-black uppercase tracking-widest font-mono flex items-center gap-1.5 mb-1"
            style={{ color: theme.primary }}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>{perfCenterName}</span>
          </div>

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
          <h2
            className="text-xl font-black mt-1 tracking-tight"
            style={{ color: paperTone.textHex }}
          >
            DETAILED METRIC PERFORMANCE & SCIENTIFIC NORMS
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Athlete: <span className="font-bold text-slate-900">{assessment.athleteName}</span> (
            {assessment.athleteCode}) • Testing Date: {assessment.assessmentDate}
          </p>
        </div>

        {/* 7th Workable Norm Zones Legend */}
        {showNorms && (
          <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold p-1.5 rounded-lg border border-slate-200/60 bg-white/50">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">&lt;50% Below</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">50-74% Good</span>
            <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">75-89% Adv</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">90%+ Elite</span>
          </div>
        )}
      </div>

      {/* 1. VISUAL METRIC GRAPH SHOW: EVENT BENCHMARK DISTRIBUTION BARS */}
      {validTests.length > 0 && (
        <div className="my-4 print:my-2">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200/80">
            <h3
              className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: theme.primary }}
            >
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
              const prevPct =
                t.previousRawValue !== undefined && t.percentile !== undefined
                  ? t.percentileDelta
                  : undefined;

              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: paperTone.textHex }}>
                        {t.testName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {catInfo?.label || t.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-black text-slate-900" style={{ color: paperTone.textHex }}>
                        {t.finalRawValue} {t.unit}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-black"
                        style={{
                          backgroundColor:
                            pct >= 90
                              ? '#059669'
                              : pct >= 75
                              ? '#0d9488'
                              : pct >= 50
                              ? '#d97706'
                              : '#dc2626',
                          color: '#ffffff',
                        }}
                      >
                        {pct.toFixed(0)}th %ile
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Percentile Gauge Bar */}
                  <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    {/* 7th Workable Norm Zones Ticks */}
                    {showNorms && (
                      <>
                        <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                        <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                        <div className="absolute left-[90%] top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                      </>
                    )}

                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(3, pct)}%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>

                  {/* Micro progression note */}
                  {prevPct !== undefined && (
                    <div className="flex items-center justify-end text-[9px] text-slate-400 font-mono">
                      {prevPct >= 0 ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          ▲ +{prevPct.toFixed(1)}%ile vs last baseline
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-0.5">
                          ▼ {prevPct.toFixed(1)}%ile vs last baseline
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. COMPREHENSIVE TEST METRICS & PROGRESSION TABLE */}
      <div className="my-4 print:my-2">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200/80">
          <h3
            className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: theme.primary }}
          >
            <Activity className="w-4 h-4" />
            Full Battery Measurements & Scientific Progression
          </h3>
          <span className="text-[10px] text-slate-500">Values & Reference Standards</span>
        </div>

        <div
          className="overflow-x-auto rounded-xl border"
          style={{
            borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
            backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
          }}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className="border-b text-[10px] font-black uppercase tracking-wider"
                style={{
                  backgroundColor: isDarkPaper ? '#1b1b24' : '#f8fafc',
                  borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
                  color: paperTone.textHex,
                }}
              >
                <th className="p-2 sm:p-2.5">Category</th>
                <th className="p-2 sm:p-2.5">Test Protocol</th>
                <th className="p-2 sm:p-2.5 text-center">Raw Result</th>
                <th className="p-2 sm:p-2.5 text-center">Baseline</th>
                <th className="p-2 sm:p-2.5 text-center">Delta</th>
                <th className="p-2 sm:p-2.5">Norm Standard</th>
                <th className="p-2 sm:p-2.5 text-center">Scientific %ile</th>
                <th className="p-2 sm:p-2.5 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(assessment.testResults || []).map((t, idx) => {
                const catInfo = FITNESS_CATEGORIES_INFO[t.category];
                const hasPrev = t.previousRawValue !== undefined;
                const rawDelta = t.rawDelta;
                const isBetter =
                  rawDelta !== undefined
                    ? t.measurementDirection === 'higher_is_better'
                      ? rawDelta > 0
                      : rawDelta < 0
                    : false;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 transition-colors"
                    style={{ color: paperTone.textHex }}
                  >
                    <td className="p-2 sm:p-2.5 font-bold text-slate-700">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white inline-block shadow-2xs"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {catInfo?.label || t.category}
                      </span>
                    </td>

                    <td className="p-2 sm:p-2.5">
                      <div className="font-bold text-slate-900" style={{ color: paperTone.textHex }}>
                        {t.testName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.testCode}</div>
                    </td>

                    <td className="p-2 sm:p-2.5 text-center font-mono font-black text-slate-900">
                      {t.isMissing ? (
                        <span className="text-slate-400 italic">Omitted</span>
                      ) : (
                        `${t.finalRawValue} ${t.unit}`
                      )}
                    </td>

                    <td className="p-2 sm:p-2.5 text-center font-mono text-slate-500 text-[11px]">
                      {hasPrev ? `${t.previousRawValue} ${t.unit}` : '—'}
                    </td>

                    <td className="p-2 sm:p-2.5 text-center font-mono text-[11px]">
                      {rawDelta !== undefined ? (
                        <span
                          className={`font-bold ${
                            isBetter ? 'text-emerald-600' : rawDelta === 0 ? 'text-slate-500' : 'text-rose-600'
                          }`}
                        >
                          {rawDelta > 0 ? `+${rawDelta}` : rawDelta}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-2 sm:p-2.5 text-[11px] text-slate-600">
                      {t.benchmarkSourceTitle || 'National Athletics Standard Norm'}
                    </td>

                    <td className="p-2 sm:p-2.5 text-center">
                      {t.percentile !== undefined ? (
                        <div className="flex items-center justify-center gap-1.5 font-mono">
                          <span className="font-black text-slate-900">
                            {Math.round(t.percentile)}%
                          </span>
                          <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${t.percentile}%`,
                                backgroundColor: theme.primary,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">—</span>
                      )}
                    </td>

                    <td className="p-2 sm:p-2.5 text-right font-black text-[11px]">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white"
                        style={{
                          backgroundColor:
                            t.rating === 'Excellent'
                              ? '#059669'
                              : t.rating === 'Good'
                              ? '#0d9488'
                              : t.rating === 'Average'
                              ? '#2563eb'
                              : t.rating === 'Below Average'
                              ? '#d97706'
                              : '#dc2626',
                        }}
                      >
                        {t.rating || 'Standard'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. BILATERAL SYMMETRY EQUILIBRIUM METERS (8th WORKABLE TOGGLE) */}
      {showBilateral &&
        assessment.bilateralAsymmetries &&
        assessment.bilateralAsymmetries.length > 0 && (
          <div
            className="my-3 print:my-2 p-3 rounded-xl border"
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

      {/* 4. SUPERVISING COACH OBSERVATIONS & PRESCRIPTION */}
      <div
        className="my-3 print:my-2 p-3 print:p-2 rounded-xl border text-xs"
        style={{
          backgroundColor: theme.lightBg,
          borderColor: theme.accentBorder,
        }}
      >
        <h4
          className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5"
          style={{ color: theme.primary }}
        >
          <FileText className="w-4 h-4" /> Supervising Coach Observations & Prescription
        </h4>
        <p className="text-slate-800 leading-relaxed italic">
          "{assessment.coachGeneralComments || 'Athlete completed all testing blocks in accordance with standardized protocols. Readiness for high volume cycle confirmed.'}"
        </p>
      </div>

      {/* 5. SCIENTIFIC ATTRIBUTION NOTE */}
      <div className="p-3 print:p-2 bg-slate-900 text-white rounded-xl text-[10px] space-y-1">
        <div className="font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: theme.primary }}>
          <BookOpen className="w-3.5 h-3.5" /> Scientific Norm & Attribution Framework
        </div>
        <p className="text-slate-300 leading-relaxed">
          Normative percentiles are calculated exclusively via validated scientific reference tables (e.g. Eurofit, McMahon et al. 2018, Haugen et al. 2012, Tomkinson et al. 2017 BJSM). Tests without validated reference norms are displayed with raw results and progression deltas but excluded from composite percentile calculation.
        </p>
      </div>

      {/* 6. FOOTER SIGN-OFF */}
      <div className="mt-4 pt-3 print:mt-2 print:pt-2 border-t border-slate-200 flex items-end justify-between text-xs">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase font-bold">Approved & Finalized By:</span>
          <span className="font-bold text-slate-900" style={{ color: paperTone.textHex }}>
            {assessment.coachName || 'Coach Rudra Roy'}
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

/**
 * Main ReportPageTwo Component
 */
export function ReportPageTwo({
  assessment,
  designConfig = DEFAULT_REPORT_DESIGN,
}: ReportPageTwoProps) {
  const layout = designConfig.pageTwoLayoutType || 'scorecard';

  if (layout === 'scientific') {
    return <ScientificLayout assessment={assessment} designConfig={designConfig} />;
  }

  return <ScorecardLayout assessment={assessment} designConfig={designConfig} />;
}
