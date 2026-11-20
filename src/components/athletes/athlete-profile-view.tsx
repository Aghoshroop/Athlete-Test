'use client';

import React, { useState } from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { PerformanceRecord } from '@/types/athletics';
import { Badge } from '@/components/ui/badge';
import { PerformanceTable } from '@/components/athletics/performance-table';
import { FitnessRadarChart } from '@/components/intelligence/fitness-radar-chart';
import { ProgressionChart } from '@/components/intelligence/progression-chart';
import { BilateralAsymmetryChart } from '@/components/intelligence/bilateral-asymmetry-chart';
import { InsightCards } from '@/components/intelligence/insight-cards';
import {
  User,
  Activity,
  Trophy,
  Scale,
  LineChart,
  Calendar,
  FileText,
  Plus,
  ChevronLeft,
  Ruler,
  Weight,
  Trash2,
} from 'lucide-react';

interface AthleteProfileViewProps {
  athlete: AthleteProfile;
  assessments: Assessment[];
  performances: PerformanceRecord[];
  onBack: () => void;
  onNewAssessment: () => void;
  onAddMeasurement: () => void;
  onRecordPerformance: () => void;
  onDeleteAthlete?: (athlete: AthleteProfile) => void;
  onOpenReport: (assessment: Assessment) => void;
  userRole?: string;
}

export function AthleteProfileView({
  athlete,
  assessments,
  performances,
  onBack,
  onNewAssessment,
  onAddMeasurement,
  onRecordPerformance,
  onDeleteAthlete,
  onOpenReport,
  userRole,
}: AthleteProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'fitness' | 'competitions' | 'anthropometry'>('overview');

  const age = calculateAge(athlete.dateOfBirth);
  const latestAssessment = assessments[0];
  const previousAssessment = assessments[1];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Athletes Directory
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {userRole !== 'ATHLETE' && (
            <>
              <button
                onClick={onNewAssessment}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 transition shadow-md shadow-red-950/40"
              >
                <Activity className="w-3.5 h-3.5" /> New Assessment
              </button>
              <button
                onClick={onRecordPerformance}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 transition"
              >
                <Trophy className="w-3.5 h-3.5 text-rose-400" /> Record Competition
              </button>
              <button
                onClick={onAddMeasurement}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition"
              >
                <Scale className="w-3.5 h-3.5 text-slate-400" /> Log Body Stats
              </button>
              {onDeleteAthlete && (
                <button
                  onClick={() => onDeleteAthlete(athlete)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-950/20 border border-red-900/40 hover:bg-red-900/40 text-rose-400 transition"
                  title="Remove Athlete"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Athlete
                </button>
              )}
            </>
          )}

          {latestAssessment && (
            <button
              onClick={() => onOpenReport(latestAssessment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-rose-400 hover:bg-slate-800 transition"
            >
              <FileText className="w-3.5 h-3.5" /> View A4 Dossier
            </button>
          )}
        </div>
      </div>

      {/* Athlete Header Card */}
      <div className="p-6 rounded-2xl bg-[#0e0e13] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-rose-500 flex items-center justify-center font-black text-2xl shadow-lg ring-2 ring-red-500/40">
            {athlete.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {athlete.athleteCode}
              </span>
              <Badge variant="emerald" size="sm">
                {athlete.status.toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{athlete.fullName}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{age} years old</span>
              <span>•</span>
              <span className="capitalize">{athlete.sex}</span>
              <span>•</span>
              <span>{athlete.trainingSquad}</span>
              <span>•</span>
              <span>Coach: {athlete.coachName}</span>
            </p>
          </div>
        </div>

        {/* Current Body Measurements */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Height</span>
            <span className="font-black text-slate-900 text-base">
              {athlete.currentMeasurements?.heightCm ?? '—'} <span className="text-xs font-normal text-slate-500">cm</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Weight</span>
            <span className="font-black text-slate-900 text-base">
              {athlete.currentMeasurements?.weightKg ?? '—'} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Arm Span</span>
            <span className="font-black text-slate-900 text-base">
              {athlete.currentMeasurements?.armSpanCm ?? '—'} <span className="text-xs font-normal text-slate-500">cm</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Event</span>
            <span className="font-bold text-rose-400 block">{athlete.primaryEventName}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-red-500 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Intelligence & Radar Overview
        </button>
        <button
          onClick={() => setActiveTab('fitness')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'fitness'
              ? 'border-red-500 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Fitness Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('competitions')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'competitions'
              ? 'border-red-500 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Track & Field Competitions ({performances.length})
        </button>
        <button
          onClick={() => setActiveTab('anthropometry')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'anthropometry'
              ? 'border-red-500 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Body History ({athlete.measurementHistory?.length ?? 1})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {latestAssessment ? (
            <>
              {/* Insight Cards */}
              <InsightCards
                currentAssessment={latestAssessment}
                previousAssessment={previousAssessment}
              />

              {/* Radar Chart + Progression Line */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-5 shadow-xl text-white">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">
                      Athletic Fitness Radar Profile
                    </h3>
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      {latestAssessment.assessmentDate}
                    </span>
                  </div>
                  <FitnessRadarChart
                    currentAssessment={latestAssessment}
                    previousAssessment={previousAssessment}
                  />
                </div>

                <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-5 shadow-xl text-white">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">
                      Longitudinal Progress Analytics
                    </h3>
                    <span className="text-xs text-slate-400">Historical Assessments</span>
                  </div>
                  <ProgressionChart assessments={assessments} />
                </div>
              </div>

              {/* Bilateral Balance */}
              <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-5 shadow-xl text-white">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white">
                    Bilateral Limb Balance & Functional Asymmetry
                  </h3>
                  <span className="text-xs text-slate-400">Left vs Right Performance Index</span>
                </div>
                <BilateralAsymmetryChart assessment={latestAssessment} />
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-[#0e0e13] rounded-xl border border-slate-800 text-white">
              <Activity className="w-10 h-10 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No fitness assessment recorded yet.</p>
              <button
                onClick={onNewAssessment}
                className="mt-3 px-4 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50"
              >
                Create First Physical Assessment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Fitness Assessments History */}
      {activeTab === 'fitness' && (
        <div className="space-y-4">
          {assessments.map((ass) => (
            <div
              key={ass.id}
              className="p-5 bg-[#0e0e13] rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{ass.batteryName}</span>
                  <Badge variant={ass.status === 'finalized' ? 'emerald' : 'yellow'} size="sm">
                    {ass.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Testing Date: <strong>{ass.assessmentDate}</strong></span>
                  <span>•</span>
                  <span>Coach: {ass.coachName}</span>
                  <span>•</span>
                  <span>Coverage: {ass.coveragePercentage}%</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Fitness Score</span>
                  <span className="text-2xl font-black text-rose-400">
                    {ass.overallFitnessScore !== undefined ? `${ass.overallFitnessScore.toFixed(1)} pts` : '—'}
                  </span>
                  <div className="text-[10px] text-slate-400 font-bold">{ass.overallRating ?? 'Review'}</div>
                </div>

                <button
                  onClick={() => onOpenReport(ass)}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 rounded-lg transition"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Track & Field Competitions */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <PerformanceTable performances={performances} />
        </div>
      )}

      {/* Tab 4: Historical Body Measurements */}
      {activeTab === 'anthropometry' && (
        <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Historical Body Measurements Timeline</h3>
              <p className="text-xs text-slate-400">Continuous body composition log without overwriting past entries</p>
            </div>
            {userRole !== 'ATHLETE' && (
              <button
                onClick={onAddMeasurement}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50"
              >
                + Log Measurement
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Height (cm)</th>
                  <th className="p-3">Weight (kg)</th>
                  <th className="p-3">Arm Span (cm)</th>
                  <th className="p-3">Sitting Height (cm)</th>
                  <th className="p-3">Body Fat %</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(athlete.measurementHistory || [athlete.currentMeasurements]).map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{m.date}</td>
                    <td className="p-3 font-semibold">{m.heightCm}</td>
                    <td className="p-3 font-semibold">{m.weightKg}</td>
                    <td className="p-3 font-semibold">{m.armSpanCm ?? '—'}</td>
                    <td className="p-3 font-semibold">{m.sittingHeightCm ?? '—'}</td>
                    <td className="p-3 font-semibold">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '—'}</td>
                    <td className="p-3 text-slate-500 italic">{m.notes || 'Routine weigh-in'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
