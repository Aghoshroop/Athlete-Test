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
import { CheckCircle2, Zap } from 'lucide-react';

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

  return (
    <div
      className={`a4-page w-full max-w-[210mm] mx-auto p-6 sm:p-8 print:p-5 border shadow-lg print:shadow-none print:border-none print:m-0 page-break transition-colors duration-200 ${fontPreset.className}`}
      style={{
        backgroundColor: paperTone.bgHex,
        color: paperTone.textHex,
        borderColor: paperTone.borderHex,
      }}
    >
      {/* Editorial Header */}
      <div
        className="flex items-start justify-between pb-4 border-b-2"
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
            National Athletics High Performance Centre • Published Norm Reference Assessment
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

      {/* Athlete Demographic & Metadata Strip */}
      <div
        className="grid grid-cols-4 gap-2.5 my-3 print:my-2 p-2.5 print:p-2 rounded-xl border text-xs"
        style={{
          backgroundColor: isDarkPaper ? '#15151c' : '#f8fafc',
          borderColor: isDarkPaper ? '#2a2a36' : '#e2e8f0',
        }}
      >
        <div>
          <span className="text-slate-400 font-medium block">Athlete Name</span>
          <span className="font-bold text-sm" style={{ color: paperTone.textHex }}>
            {assessment.athleteName}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Athlete ID</span>
          <span className="font-mono font-bold" style={{ color: paperTone.textHex }}>
            {assessment.athleteCode}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Age & Sex Group</span>
          <span className="font-bold capitalize" style={{ color: paperTone.textHex }}>
            {assessment.athleteAge} yrs • {assessment.sex}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Primary Event</span>
          <span className="font-bold" style={{ color: theme.primary }}>
            {assessment.primaryEvent} ({assessment.eventGroup})
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">Testing Battery</span>
          <span className="font-semibold text-slate-700" style={{ color: isDarkPaper ? '#cbd5e1' : undefined }}>
            {assessment.batteryName}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Assessment Date</span>
          <span className="font-mono font-bold" style={{ color: paperTone.textHex }}>
            {assessment.assessmentDate}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Supervising Coach</span>
          <span className="font-semibold" style={{ color: paperTone.textHex }}>
            {assessment.coachName}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Data Coverage</span>
          <span className="font-bold text-emerald-600">
            {assessment.coveragePercentage}% of categories
          </span>
        </div>
      </div>

      {/* Main Page 1 Grid: Radar Chart + Category Breakdown */}
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
            <span className="text-[10px] text-slate-500 font-medium">Percentile Ranks (0-100%)</span>
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
                  isAssessed && prev !== undefined && prev > 0
                    ? Math.round((score - prev) * 10) / 10
                    : undefined;

                return (
                  <div
                    key={cat}
                    className={`flex items-center justify-between p-1.5 rounded text-xs border ${
                      isAssessed
                        ? isDarkPaper
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-slate-50 border-slate-200'
                        : isDarkPaper
                        ? 'bg-slate-950/40 border-slate-900 opacity-50'
                        : 'bg-slate-50/40 border-slate-100 opacity-60'
                    }`}
                  >
                    <span className="font-semibold text-slate-800" style={{ color: paperTone.textHex }}>
                      {info.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {delta !== undefined && (
                        <span
                          className={`font-mono font-bold text-[10px] ${
                            delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-slate-400'
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )}
                      <span className="font-bold min-w-[32px] text-right" style={{ color: paperTone.textHex }}>
                        {isAssessed ? `${score.toFixed(0)}%` : '—'}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-semibold min-w-[70px] text-center border bg-white border-slate-200 text-slate-800"
                      >
                        {isAssessed ? res.rating : 'Unassessed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Targeted Development Areas */}
      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 print:mt-2 print:pt-2 border-t border-slate-200">
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
          <h4 className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: theme.primary }}>
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
        <span>Athletics Intelligence Systems • Scoring Engine Version {assessment.scoringConfigVersion}</span>
        <span>Generated for official coaching review • Page 1 of 2</span>
      </div>
    </div>
  );
}
