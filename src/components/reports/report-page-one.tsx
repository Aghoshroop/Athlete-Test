'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { AthleteProfile } from '@/types/athlete';
import { FITNESS_CATEGORIES_INFO, FitnessCategory } from '@/types/fitness';
import { FitnessRadarChart } from '@/components/intelligence/fitness-radar-chart';
import {
  ReportDesignConfig,
  DEFAULT_REPORT_DESIGN,
  getResolvedThemeColor,
  REPORT_FONT_PRESETS,
  REPORT_PAPER_TONES,
} from '@/types/report-design';
import { CheckCircle2, Zap, Scale, Award, ShieldCheck, UserCheck } from 'lucide-react';

interface ReportPageOneProps {
  assessment: Assessment;
  previousAssessment?: Assessment;
  athlete?: AthleteProfile;
  designConfig?: ReportDesignConfig;
}

export function ReportPageOne({
  assessment,
  previousAssessment,
  athlete,
  designConfig = DEFAULT_REPORT_DESIGN,
}: ReportPageOneProps) {
  const theme = getResolvedThemeColor(designConfig);
  const fontPreset = REPORT_FONT_PRESETS[designConfig.fontFamily] || REPORT_FONT_PRESETS.sans;
  const paperTone = REPORT_PAPER_TONES[designConfig.paperTone] || REPORT_PAPER_TONES.white;
  const isDarkPaper = designConfig.paperTone === 'dark';

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

  const bioStyle = designConfig.athleteBioBoxStyle || 'athletic-badge';
  const perfCenterName =
    designConfig.performanceCenterName || 'National Athletics High Performance Centre';

  // Get athlete initials
  const initials = assessment.athleteName
    ? assessment.athleteName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AT';

  return (
    <div
      className={`a4-page w-full max-w-[210mm] mx-auto p-6 sm:p-8 print:p-5 border shadow-lg print:shadow-none print:border-none print:m-0 page-break transition-colors duration-200 ${fontPreset.className}`}
      style={{
        backgroundColor: paperTone.bgHex,
        color: paperTone.textHex,
        borderColor: paperTone.borderHex,
      }}
    >
      {/* ============================================================== */}
      {/* 1. EDITORIAL HEADER & PERFORMANCE CENTRE NAME (SPORTY FONT)    */}
      {/* ============================================================== */}
      <div
        className="flex items-start justify-between pb-3.5 border-b-2"
        style={{ borderColor: theme.primary }}
      >
        <div>
          {/* Performance Center Name with Sporty Font */}
          <div
            className="text-xs font-black tracking-widest uppercase font-mono flex items-center gap-1.5 mb-1"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              PAGE 1 OF 2
            </span>
          </div>

          <h1
            className="text-2xl font-black mt-1 tracking-tight"
            style={{ color: paperTone.textHex }}
          >
            ATHLETE PHYSICAL FITNESS PROFILE
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Standardized Physical Diagnostics & Published Scientific Norm Calibrations
          </p>
        </div>

        {/* Overall Score Callout */}
        <div
          className="text-right p-3 rounded-xl border min-w-[145px] shadow-sm"
          style={{
            backgroundColor: isDarkPaper ? '#1b1b24' : '#0f172a',
            borderColor: theme.primary,
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            Overall Fitness Index
          </div>
          <div className="text-3xl font-black text-white mt-0.5">
            {assessment.overallFitnessScore !== undefined
              ? assessment.overallFitnessScore.toFixed(1)
              : 'N/A'}
          </div>
          <div
            className="text-[11px] font-bold uppercase mt-0.5"
            style={{ color: theme.accentBorder || '#f87171' }}
          >
            Rating: {assessment.overallRating ?? 'In Progress'}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ATHLETE BIO DATA SECTION SPECIFIC (3 WORKABLE STYLES)       */}
      {/* ============================================================== */}
      {bioStyle === 'athletic-badge' && (
        <div
          className="my-3 print:my-2 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
            borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
          }}
        >
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl text-white font-black text-base flex items-center justify-center shrink-0 shadow-md"
              style={{ backgroundColor: theme.primary }}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base" style={{ color: paperTone.textHex }}>
                  {assessment.athleteName}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-2xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  {assessment.athleteCode}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                <span className="capitalize font-semibold text-slate-700" style={{ color: isDarkPaper ? '#cbd5e1' : undefined }}>
                  {assessment.athleteAge} yrs • {assessment.sex}
                </span>
                <span>•</span>
                <span className="font-bold" style={{ color: theme.primary }}>
                  {assessment.primaryEvent} ({assessment.eventGroup})
                </span>
                {athlete?.trainingSquad && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600 truncate max-w-[160px] font-medium">{athlete.trainingSquad}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metadata Micro-Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-4 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Tested On</span>
              <span className="font-bold text-slate-900" style={{ color: paperTone.textHex }}>
                {assessment.assessmentDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Coach</span>
              <span className="font-bold text-slate-900 truncate block max-w-[100px]" style={{ color: paperTone.textHex }}>
                {assessment.coachName || 'Coach Rudra Roy'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Data Coverage</span>
              <span className="font-bold text-emerald-600">
                {assessment.coveragePercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {bioStyle === 'card-grid' && (
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 print:my-2 p-2.5 print:p-2 rounded-xl border text-xs"
          style={{
            backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
            borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
          }}
        >
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Athlete Name</span>
            <span className="font-bold text-sm" style={{ color: paperTone.textHex }}>
              {assessment.athleteName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Athlete ID</span>
            <span className="font-mono font-bold" style={{ color: paperTone.textHex }}>
              {assessment.athleteCode}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Age & Sex Group</span>
            <span className="font-bold capitalize" style={{ color: paperTone.textHex }}>
              {assessment.athleteAge} yrs • {assessment.sex}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Primary Event</span>
            <span className="font-bold" style={{ color: theme.primary }}>
              {assessment.primaryEvent} ({assessment.eventGroup})
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Testing Battery</span>
            <span className="font-semibold text-slate-700 truncate block" style={{ color: isDarkPaper ? '#cbd5e1' : undefined }}>
              {assessment.batteryName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Assessment Date</span>
            <span className="font-mono font-bold" style={{ color: paperTone.textHex }}>
              {assessment.assessmentDate}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Supervising Coach</span>
            <span className="font-semibold" style={{ color: paperTone.textHex }}>
              {assessment.coachName || 'Coach Rudra Roy'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">Data Coverage</span>
            <span className="font-bold text-emerald-600">
              {assessment.coveragePercentage}% of categories
            </span>
          </div>
        </div>
      )}

      {bioStyle === 'federation-dossier' && (
        <div
          className="my-3 print:my-2 p-3 rounded-xl border-l-4 border text-xs shadow-xs relative overflow-hidden"
          style={{
            backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
            borderColor: isDarkPaper ? '#2a2a36' : '#cbd5e1',
            borderLeftColor: theme.primary,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="font-black text-xs uppercase tracking-wider text-slate-900" style={{ color: paperTone.textHex }}>
                National Federation Athlete Record Dossier
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              REG: {assessment.athleteCode} • ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Athlete Legal Name</span>
              <span className="font-black text-xs text-slate-900" style={{ color: paperTone.textHex }}>
                {assessment.athleteName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Event & Group</span>
              <span className="font-bold" style={{ color: theme.primary }}>
                {assessment.primaryEvent} ({assessment.eventGroup})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Demographics</span>
              <span className="font-semibold capitalize text-slate-700" style={{ color: isDarkPaper ? '#cbd5e1' : undefined }}>
                {assessment.athleteAge} yrs • {assessment.sex}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Supervising Coach</span>
              <span className="font-semibold text-slate-900" style={{ color: paperTone.textHex }}>
                {assessment.coachName || 'Coach Rudra Roy'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RADAR CHART + CATEGORY SCORES                               */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-3 print:my-2 items-start">
        {/* Radar Chart (7 cols) */}
        <div
          className="md:col-span-7 p-3 rounded-xl border"
          style={{
            backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
            borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
          }}
        >
          <div className="flex items-center justify-between mb-1 pb-2 border-b border-slate-100">
            <h3
              className="font-black text-xs uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              Physical Fitness Radar Profile
            </h3>

            {/* 7th Workable Norm Zones Legend on Page 1 */}
            {designConfig.showNormZones ? (
              <div className="flex items-center gap-1 text-[9px] font-bold p-1 rounded-md border border-slate-200/80 bg-white/70">
                <span className="px-1 rounded bg-slate-100 text-slate-700">&lt;50%</span>
                <span className="px-1 rounded bg-amber-100 text-amber-900">50-74%</span>
                <span className="px-1 rounded bg-teal-100 text-teal-900">75-89%</span>
                <span className="px-1 rounded bg-emerald-100 text-emerald-900">90%+</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium">Percentile Ranks (0-100%)</span>
            )}
          </div>

          <FitnessRadarChart
            currentAssessment={assessment}
            previousAssessment={previousAssessment}
            accentColor={theme.primary}
          />
        </div>

        {/* Category Scores Table (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: isDarkPaper ? '#15151c' : '#ffffff',
              borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
            }}
          >
            <h3
              className="font-black text-xs uppercase tracking-wider mb-2 pb-2 border-b border-slate-100"
              style={{ color: theme.primary }}
            >
              Evaluated Category Percentiles
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const info = FITNESS_CATEGORIES_INFO[cat];
                const res = assessment.categoryScores?.[cat];
                const isAssessed = res && res.validTestsCount > 0 && res.categoryScorePercentile > 0;
                const score = isAssessed ? res.categoryScorePercentile : 0;
                const prev = previousAssessment?.categoryScores?.[cat]?.categoryScorePercentile;
                const delta =
                  isAssessed && prev !== undefined && prev > 0 ? score - prev : undefined;

                return (
                  <div key={cat} className="flex items-center justify-between text-xs py-0.5">
                    <span className="font-medium text-slate-700" style={{ color: paperTone.textHex }}>
                      {info.label}
                    </span>

                    <div className="flex items-center gap-2 font-mono">
                      {isAssessed ? (
                        <>
                          <span
                            className="font-bold text-xs"
                            style={{ color: score >= 75 ? theme.primary : undefined }}
                          >
                            {Math.round(score)}%
                          </span>
                          {delta !== undefined && (
                            <span
                              className={`text-[10px] font-semibold ${
                                delta > 0
                                  ? 'text-emerald-600'
                                  : delta < 0
                                  ? 'text-rose-600'
                                  : 'text-slate-400'
                              }`}
                            >
                              {delta > 0 ? `+${delta.toFixed(0)}` : delta.toFixed(0)}
                            </span>
                          )}
                          <span
                            className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold text-white shadow-2xs"
                            style={{
                              backgroundColor:
                                score >= 90
                                  ? '#059669'
                                  : score >= 75
                                  ? '#0d9488'
                                  : score >= 50
                                  ? '#d97706'
                                  : '#dc2626',
                            }}
                          >
                            {res?.rating ?? 'Good'}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Not Tested</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8th Workable Bilateral Balance Summary Pill */}
          {designConfig.showBilateralGauges &&
            assessment.bilateralAsymmetries &&
            assessment.bilateralAsymmetries.length > 0 && (
              <div
                className="p-2.5 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
                  borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
                }}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4" style={{ color: theme.primary }} />
                  <span className="font-bold" style={{ color: paperTone.textHex }}>
                    Bilateral Equilibrium:
                  </span>
                </div>
                <span
                  className="font-mono font-bold text-[11px]"
                  style={{
                    color:
                      assessment.bilateralAsymmetries.filter((b) => Math.abs(b.asymmetryPercent) > 10)
                        .length > 0
                        ? theme.primary
                        : '#059669',
                  }}
                >
                  {assessment.bilateralAsymmetries.filter((b) => Math.abs(b.asymmetryPercent) > 10)
                    .length === 0
                    ? '✓ Optimal Symmetry'
                    : `◆ ${assessment.bilateralAsymmetries.filter((b) => Math.abs(b.asymmetryPercent) > 10).length} Focus Areas`}
                </span>
              </div>
            )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. ATHLETIC STRENGTHS & PRIORITIES                             */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 print:my-2">
        <div className="p-2.5 print:p-2 bg-emerald-50 rounded-xl border border-emerald-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top Athletic Strengths
          </h4>
          <ul className="text-xs font-semibold text-emerald-950 space-y-1 list-disc list-inside">
            {assessment.topStrengths && assessment.topStrengths.length > 0 ? (
              assessment.topStrengths.map((str, i) => <li key={i}>{str}</li>)
            ) : (
              <li>Baseline development profile in progress</li>
            )}
          </ul>
        </div>

        <div
          className="p-2.5 print:p-2 rounded-xl border"
          style={{
            backgroundColor: theme.lightBg,
            borderColor: theme.accentBorder,
          }}
        >
          <h4
            className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5"
            style={{ color: theme.primary }}
          >
            <Zap className="w-4 h-4" /> Priority Areas to Improve
          </h4>
          <ul className="text-xs font-semibold space-y-1 list-disc list-inside text-slate-900">
            {assessment.areasToImprove && assessment.areasToImprove.length > 0 ? (
              assessment.areasToImprove.map((area, i) => <li key={i}>{area}</li>)
            ) : (
              <li>All categories meeting national track & field standards</li>
            )}
          </ul>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-4 pt-2 print:mt-2 print:pt-1 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>{perfCenterName} • Official Coaching Review</span>
        <span>Page 1 of 2</span>
      </div>
    </div>
  );
}
