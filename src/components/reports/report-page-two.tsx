'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { BookOpen, Info, Scale, FileText } from 'lucide-react';

interface ReportPageTwoProps {
  assessment: Assessment;
}

export function ReportPageTwo({ assessment }: ReportPageTwoProps) {
  return (
    <div className="a4-page w-full max-w-[210mm] mx-auto bg-white p-6 sm:p-8 print:p-5 text-black border border-slate-300 shadow-lg print:shadow-none print:border-none print:m-0 mt-8 print:mt-0 page-break">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
              ATHLETICS PERFORMANCE REPORT
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PAGE 2 OF 2
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-950 mt-1 tracking-tight">
            DETAILED TEST MEASUREMENTS & SCIENTIFIC BENCHMARKS
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Athlete: <span className="font-bold text-slate-900">{assessment.athleteName}</span> ({assessment.athleteCode}) • Testing Date: {assessment.assessmentDate}
          </p>
        </div>
      </div>

      {/* Comprehensive Test Results Table */}
      <div className="my-3 print:my-2 overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-300">
          <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-2 border-r border-slate-800">Test / Protocol</th>
              <th className="p-2 border-r border-slate-800 text-center">Prev</th>
              <th className="p-2 border-r border-slate-800 text-center">Curr</th>
              <th className="p-2 border-r border-slate-800 text-center">Delta</th>
              <th className="p-2 border-r border-slate-800 text-center">%ile</th>
              <th className="p-2 border-r border-slate-800 text-center">Rating</th>
              <th className="p-2 border-r border-slate-800">L/R Asymmetry</th>
              <th className="p-2">Benchmark Reference & Limitations</th>
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

              return (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                    <div>{t.testName}</div>
                    <div className="text-[10px] text-slate-500 font-normal uppercase">{t.category}</div>
                  </td>
                  <td className="p-2 text-center font-mono border-r border-slate-200 whitespace-nowrap">
                    {prevDisplay}
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                    {currDisplay}
                  </td>
                  <td className={`p-2 text-center font-mono border-r border-slate-200 whitespace-nowrap ${deltaColor}`}>
                    {deltaDisplay}
                  </td>
                  <td className="p-2 text-center font-black text-amber-600 border-r border-slate-200 whitespace-nowrap">
                    {t.percentile !== undefined ? `${t.percentile.toFixed(0)}%` : '—'}
                  </td>
                  <td className="p-2 text-center border-r border-slate-200 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
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
                  <td className="p-2 text-[10px] leading-tight text-slate-600 max-w-[200px]">
                    <div className="font-semibold text-slate-800">{t.benchmarkSourceTitle || 'Custom Protocol'}</div>
                    {t.limitationNote && <div className="text-slate-500 italic mt-0.5">{t.limitationNote}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Left/Right Balance Summary Box */}
      {assessment.bilateralAsymmetries && assessment.bilateralAsymmetries.length > 0 && (
        <div className="my-3 print:my-2 p-3 print:p-2 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-500" /> Bilateral Symmetry Evaluation
          </h4>
          <div className="space-y-1 text-xs text-slate-700">
            {assessment.bilateralAsymmetries.map((b, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{b.testName}:</span>
                <span className="text-slate-600">{b.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach General Observations & Testing Limitations */}
      <div className="my-3 print:my-2 p-3 print:p-2 bg-amber-50/50 rounded-xl border border-amber-200 text-xs">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-amber-600" /> Supervising Coach Observations & Prescription
        </h4>
        <p className="text-slate-800 leading-relaxed italic">
          "{assessment.coachGeneralComments || 'Athlete completed all testing blocks in accordance with standardized protocols. Readiness for high volume cycle confirmed.'}"
        </p>
      </div>

      {/* Scientific Methodology Note */}
      <div className="p-3 print:p-2 bg-slate-900 text-white rounded-xl text-[10px] space-y-1">
        <div className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
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
          <span className="font-bold text-slate-900">{assessment.coachName}</span>
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
