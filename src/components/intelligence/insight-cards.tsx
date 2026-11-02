'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Award, Zap } from 'lucide-react';

interface InsightCardsProps {
  currentAssessment: Assessment;
  previousAssessment?: Assessment;
}

export function InsightCards({ currentAssessment, previousAssessment }: InsightCardsProps) {
  // 1. Improved Tests (rawDelta > 0 for higher is better, or < 0 for lower is better)
  const improvedTests = currentAssessment.testResults.filter((t) => {
    if (t.rawDelta === undefined || t.rawDelta === 0) return false;
    return t.measurementDirection === 'lower_is_better' ? t.rawDelta < 0 : t.rawDelta > 0;
  });

  // 2. Declining Tests
  const decliningTests = currentAssessment.testResults.filter((t) => {
    if (t.rawDelta === undefined || t.rawDelta === 0) return false;
    return t.measurementDirection === 'lower_is_better' ? t.rawDelta > 0 : t.rawDelta < 0;
  });

  // 3. Significant asymmetries requiring review (> 10%)
  const notableAsymmetries = currentAssessment.testResults.filter(
    (t) => t.isBilateral && t.asymmetryPercent !== undefined && Math.abs(t.asymmetryPercent) > 10
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Top Strengths */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Top Athletic Strengths
        </div>
        <div className="space-y-1.5">
          {currentAssessment.topStrengths && currentAssessment.topStrengths.length > 0 ? (
            currentAssessment.topStrengths.map((str, idx) => (
              <div key={idx} className="text-xs font-semibold text-slate-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                {str}
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400">Baseline in progress</div>
          )}
        </div>
      </div>

      {/* Areas to Target */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Primary Target Areas
        </div>
        <div className="space-y-1.5">
          {currentAssessment.areasToImprove && currentAssessment.areasToImprove.length > 0 ? (
            currentAssessment.areasToImprove.map((area, idx) => (
              <div key={idx} className="text-xs font-semibold text-slate-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {area}
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400">All categories within expected bounds</div>
          )}
        </div>
      </div>

      {/* Longitudinal Improvements */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Test Gains (Progression)
        </div>
        <div className="space-y-1.5">
          {improvedTests.length > 0 ? (
            improvedTests.slice(0, 3).map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                <span className="font-semibold text-slate-800 truncate max-w-[130px]">{t.testName}</span>
                <span className="font-bold text-blue-700 font-mono">
                  {t.rawDelta! > 0 ? `+${t.rawDelta}${t.unit}` : `${t.rawDelta}${t.unit}`}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400">First assessment cycle recorded</div>
          )}
        </div>
      </div>

      {/* Coach Action Required Alerts */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Coach Review Alerts
        </div>
        <div className="space-y-1.5">
          {notableAsymmetries.length > 0 ? (
            notableAsymmetries.map((t, idx) => (
              <div key={idx} className="text-xs bg-rose-50 p-1.5 rounded border border-rose-200 text-rose-900 font-medium leading-tight">
                <span className="font-bold">{t.testName}:</span> {Math.abs(t.asymmetryPercent!).toFixed(1)}% asymmetry deficit
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
              No significant asymmetries (&gt;10%) or anomalies detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
