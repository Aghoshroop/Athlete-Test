'use client';

import React from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { Badge } from '@/components/ui/badge';
import { User, Activity, Trophy, ChevronRight, Ruler, Weight } from 'lucide-react';

interface AthleteCardProps {
  athlete: AthleteProfile;
  onSelect: (athlete: AthleteProfile) => void;
  onNewAssessment?: (athlete: AthleteProfile) => void;
  onRecordPerformance?: (athlete: AthleteProfile) => void;
  userRole?: string;
}

export function AthleteCard({
  athlete,
  onSelect,
  onNewAssessment,
  onRecordPerformance,
  userRole,
}: AthleteCardProps) {
  const age = calculateAge(athlete.dateOfBirth);

  const statusVariantMap: Record<string, 'emerald' | 'yellow' | 'red' | 'blue' | 'gray'> = {
    active: 'emerald',
    injured: 'red',
    rehabilitation: 'yellow',
    'off-season': 'blue',
    retired: 'gray',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all hover:shadow-md p-5 flex flex-col justify-between group">
      <div>
        {/* Top Row: Code & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {athlete.athleteCode}
          </span>
          <Badge variant={statusVariantMap[athlete.status] ?? 'gray'} size="sm">
            {athlete.status.toUpperCase()}
          </Badge>
        </div>

        {/* Athlete Name & Photo */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg ring-2 ring-amber-400/30 shrink-0">
            {athlete.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-amber-600 transition">
              {athlete.fullName}
            </h3>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{age} yrs</span>
              <span>•</span>
              <span className="capitalize">{athlete.sex}</span>
              <span>•</span>
              <span className="truncate max-w-[120px]">{athlete.trainingSquad}</span>
            </div>
          </div>
        </div>

        {/* Events Hierarchy */}
        <div className="space-y-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Primary Event:</span>
            <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              {athlete.primaryEventName}
            </span>
          </div>
          {athlete.secondaryEventNames.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Secondary:</span>
              <span className="text-slate-700 font-medium truncate max-w-[150px]">
                {athlete.secondaryEventNames.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Current Body Measurements */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-white p-2 rounded border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-slate-400" />
            <span>{athlete.currentMeasurements?.heightCm ?? '—'} cm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-slate-400" />
            <span>{athlete.currentMeasurements?.weightKg ?? '—'} kg</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(athlete)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          View Profile
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {userRole !== 'ATHLETE' && onNewAssessment && (
          <button
            onClick={() => onNewAssessment(athlete)}
            title="Create Fitness Assessment"
            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
          >
            <Activity className="w-4 h-4" />
          </button>
        )}

        {userRole !== 'ATHLETE' && onRecordPerformance && (
          <button
            onClick={() => onRecordPerformance(athlete)}
            title="Record Competition Result"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
