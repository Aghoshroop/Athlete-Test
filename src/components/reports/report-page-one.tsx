'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { AthleteProfile } from '@/types/athlete';
import { FITNESS_CATEGORIES_INFO, FitnessCategory } from '@/types/fitness';
import { FitnessRadarChart } from '@/components/intelligence/fitness-radar-chart';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle2, AlertTriangle, Calendar, User, Zap } from 'lucide-react';

interface ReportPageOneProps {
  assessment: Assessment;
  previousAssessment?: Assessment;
  athlete?: AthleteProfile;
}

export function ReportPageOne({ assessment, previousAssessment, athlete }: ReportPageOneProps) {
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
    <div className="w-full max-w-[210mm] mx-auto bg-white p-8 text-black border border-slate-300 shadow-lg print:shadow-none print:border-none print:p-6 print:m-0 page-break">
      {/* Editorial Header */}
      <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
              ATHLETICS PERFORMANCE REPORT
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PAGE 1 OF 2
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
            ATHLETE PHYSICAL FITNESS PROFILE
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            National Athletics High Performance Centre • Published Norm Reference Assessment
          </p>
        </div>

        {/* Overall Score Callout */}
        <div className="text-right bg-slate-900 text-white p-3 rounded-xl border border-amber-400/50 min-w-[140px]">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            Overall Fitness Index
          </div>
          <div className="text-3xl font-black text-white mt-0.5">
            {assessment.overallFitnessScore !== undefined
              ? assessment.overallFitnessScore.toFixed(1)
              : 'N/A'}
          </div>
          <div className="text-[11px] font-bold text-amber-400 uppercase mt-0.5">
            Rating: {assessment.overallRating ?? 'In Progress'}
          </div>
        </div>
      </div>

      {/* Athlete Demographic & Metadata Strip */}
      <div className="grid grid-cols-4 gap-3 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Athlete Name</span>
          <span className="font-bold text-slate-950 text-sm">{assessment.athleteName}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Athlete ID</span>
          <span className="font-mono font-bold text-slate-900">{assessment.athleteCode}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Age & Sex Group</span>
          <span className="font-bold text-slate-900 capitalize">
            {assessment.athleteAge} yrs • {assessment.sex}
          </span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Primary Event</span>
          <span className="font-bold text-amber-600">{assessment.primaryEvent} ({assessment.eventGroup})</span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Testing Battery</span>
          <span className="font-semibold text-slate-800">{assessment.batteryName}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Assessment Date</span>
          <span className="font-mono font-bold text-slate-900">{assessment.assessmentDate}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Supervising Coach</span>
          <span className="font-semibold text-slate-900">{assessment.coachName}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Data Coverage</span>
          <span className="font-bold text-emerald-700">{assessment.coveragePercentage}% of categories</span>
        </div>
      </div>

      {/* Main Page 1 Grid: Radar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-start">
        {/* Radar Chart (7 cols) */}
        <div className="md:col-span-7 bg-white p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1 pb-2 border-b border-slate-100">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
              10-Category Fitness Radar Chart
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">Percentile Ranks (0-100%)</span>
          </div>
          <FitnessRadarChart
            currentAssessment={assessment}
            previousAssessment={previousAssessment}
          />
        </div>

        {/* Category Scores Table (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-2 pb-2 border-b border-slate-100">
              Category Percentiles & Ratings
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const info = FITNESS_CATEGORIES_INFO[cat];
                const res = assessment.categoryScores?.[cat];
                const score = res?.categoryScorePercentile ?? 0;
                const prev = previousAssessment?.categoryScores?.[cat]?.categoryScorePercentile;
                const delta = prev !== undefined ? Math.round((score - prev) * 10) / 10 : undefined;

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-1.5 rounded bg-slate-50 text-xs border border-slate-100"
                  >
                    <span className="font-semibold text-slate-800">{info.label}</span>
                    <div className="flex items-center gap-2">
                      {delta !== undefined && (
                        <span
                          className={`font-mono font-bold text-[10px] ${
                            delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-rose-700' : 'text-slate-400'
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )}
                      <span className="font-bold text-slate-900 min-w-[32px] text-right">
                        {score > 0 ? `${score.toFixed(0)}%` : '—'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold min-w-[70px] text-center">
                        {res?.rating ?? 'Below Avg'}
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
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
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

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" /> Priority Areas to Improve
          </h4>
          <ul className="text-xs font-semibold text-amber-950 space-y-1 list-disc list-inside">
            {assessment.areasToImprove && assessment.areasToImprove.length > 0 ? (
              assessment.areasToImprove.map((area, i) => <li key={i}>{area}</li>)
            ) : (
              <li>All categories meeting national track & field standards</li>
            )}
          </ul>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>Athletics Intelligence Systems • Scoring Engine Version {assessment.scoringConfigVersion}</span>
        <span>Generated for official coaching review • Page 1 of 2</span>
      </div>
    </div>
  );
}
