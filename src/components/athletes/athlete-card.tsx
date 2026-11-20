'use client';

import React from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { Badge } from '@/components/ui/badge';
import { User, Activity, Trophy, ChevronRight, Ruler, Weight, Trash2 } from 'lucide-react';

interface AthleteCardProps {
  athlete: AthleteProfile;
  onSelect: (athlete: AthleteProfile) => void;
  onNewAssessment?: (athlete: AthleteProfile) => void;
  onRecordPerformance?: (athlete: AthleteProfile) => void;
  onDelete?: (athlete: AthleteProfile) => void;
  userRole?: string;
}

export function AthleteCard({
  athlete,
  onSelect,
  onNewAssessment,
  onRecordPerformance,
  onDelete,
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
    <div className="bg-[#0e0e13] rounded-xl border border-slate-800 hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-950/40 p-5 flex flex-col justify-between group text-white">
      <div>
        {/* Top Row: Code & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {athlete.athleteCode}
          </span>
          <Badge variant={statusVariantMap[athlete.status] ?? 'gray'} size="sm">
            {athlete.status.toUpperCase()}
          </Badge>
        </div>

        {/* Athlete Name & Photo */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-rose-500 flex items-center justify-center font-bold text-lg ring-2 ring-red-500/30 shrink-0">
            {athlete.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight group-hover:text-rose-400 transition">
              {athlete.fullName}
            </h3>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{age} yrs</span>
              <span>•</span>
              <span className="capitalize">{athlete.sex}</span>
              <span>•</span>
              <span className="truncate max-w-[120px]">{athlete.trainingSquad}</span>
            </div>
          </div>
        </div>

        {/* Events Hierarchy */}
        <div className="space-y-2 mb-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Primary Event:</span>
            <span className="font-bold text-rose-300 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
              {athlete.primaryEventName}
            </span>
          </div>
          {athlete.secondaryEventNames.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Secondary:</span>
              <span className="text-slate-300 font-medium truncate max-w-[150px]">
                {athlete.secondaryEventNames.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Current Body Measurements */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-950 p-2 rounded border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-slate-500" />
            <span>{athlete.currentMeasurements?.heightCm ?? '—'} cm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-slate-500" />
            <span>{athlete.currentMeasurements?.weightKg ?? '—'} kg</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(athlete)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 transition"
        >
          View Profile
          <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
        </button>

        {userRole !== 'ATHLETE' && onNewAssessment && (
          <button
            onClick={() => onNewAssessment(athlete)}
            title="Create Fitness Assessment"
            className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-rose-400 border border-red-500/30 transition"
          >
            <Activity className="w-4 h-4" />
          </button>
        )}

        {userRole !== 'ATHLETE' && onRecordPerformance && (
          <button
            onClick={() => onRecordPerformance(athlete)}
            title="Record Competition Result"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}

        {userRole !== 'ATHLETE' && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(athlete);
            }}
            title="Remove Athlete"
            aria-label={`Remove ${athlete.fullName}`}
            className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-rose-500 border border-red-900/40 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
