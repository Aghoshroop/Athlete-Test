'use client';

import React from 'react';
import { AthleteProfile } from '@/types/athlete';
import { AlertTriangle, Trash2, X, Activity, Trophy, ShieldAlert } from 'lucide-react';

interface AthleteDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (athleteId: string) => void;
  athlete: AthleteProfile | null;
  assessmentCount?: number;
  performanceCount?: number;
}

export function AthleteDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  athlete,
  assessmentCount = 0,
  performanceCount = 0,
}: AthleteDeleteModalProps) {
  if (!isOpen || !athlete) return null;

  const handleConfirm = () => {
    onConfirm(athlete.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-athlete-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-red-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-red-50 p-5 border-b border-red-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-athlete-title" className="text-base font-bold text-red-950">
                Remove Athlete
              </h3>
              <p className="text-xs text-red-700">Permanent record deletion confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          <p className="text-slate-700 leading-relaxed">
            Are you sure you want to remove <strong className="text-slate-900 font-bold">{athlete.fullName}</strong> from the coaching roster?
          </p>

          {/* Athlete Info Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-rose-400 font-bold flex items-center justify-center text-sm shrink-0">
              {athlete.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm truncate">{athlete.fullName}</span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {athlete.athleteCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {athlete.primaryEventName} • {athlete.trainingSquad}
              </p>
            </div>
          </div>

          {/* Impact Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2 text-red-900">
            <div className="flex items-center gap-1.5 font-bold text-xs text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Associated Records Impact</span>
            </div>
            <p className="text-[11px] text-red-800 leading-normal">
              Removing this athlete will also delete the following connected entries:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded border border-red-200/60">
                <Activity className="w-3.5 h-3.5 text-red-600" />
                <span>{assessmentCount} Fitness {assessmentCount === 1 ? 'Assessment' : 'Assessments'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded border border-red-200/60">
                <Trophy className="w-3.5 h-3.5 text-red-600" />
                <span>{performanceCount} Competition {performanceCount === 1 ? 'Result' : 'Results'}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Note: An immutable audit entry will be recorded in the system audit log documenting this removal by the current coach.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition shadow-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Confirm Remove Athlete
          </button>
        </div>
      </div>
    </div>
  );
}

