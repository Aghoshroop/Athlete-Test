'use client';

import React from 'react';
import { UserRole, UserProfile } from '@/types/user';
import { db } from '@/lib/storage/local-storage-db';
import {
  Shield,
  UserCheck,
  Plus,
  Calculator,
  RefreshCw,
  Layers,
  Activity,
  Users,
  Award,
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenWACalculator?: () => void;
  onOpenCombinedReport?: () => void;
  onOpenBatchMatrix?: () => void;
}

export function Navbar({
  currentUser,
  onUserChange,
  onOpenTestingModal,
  onOpenAthleteModal,
  onOpenWACalculator,
  onOpenCombinedReport,
  onOpenBatchMatrix,
}: NavbarProps) {
  const handleResetData = () => {
    if (
      confirm(
        'Reset demo database to standard factory seed state? All test measurements will be restored to verified defaults.'
      )
    ) {
      db.resetToSeed();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Coach Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-black text-xl tracking-tighter">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  ATHLETICS <span className="text-amber-400">INTELLIGENCE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  Coach Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                National High Performance Athletics Centre • Squad Command
              </p>
            </div>
          </div>

          {/* Quick Coaching Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Combined Squad Dossier Button */}
            {onOpenCombinedReport && (
              <button
                type="button"
                onClick={onOpenCombinedReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition shadow-sm"
                title="View all athlete test reports together in one combined dossier"
              >
                <Layers className="w-3.5 h-3.5" />
                All Reports Together
              </button>
            )}

            {/* Squad Batch Testing Button */}
            {onOpenBatchMatrix && (
              <button
                type="button"
                onClick={onOpenBatchMatrix}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 transition shadow-xs"
                title="Open spreadsheet matrix to enter test results for all athletes together"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Squad Batch Testing
              </button>
            )}

            {/* Single New Assessment */}
            {onOpenTestingModal && (
              <button
                type="button"
                onClick={onOpenTestingModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-xs"
                title="Record new test assessment"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                New Test
              </button>
            )}

            {/* Add Athlete */}
            {onOpenAthleteModal && (
              <button
                type="button"
                onClick={onOpenAthleteModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Add Athlete
              </button>
            )}

            {/* WA Calculator */}
            {onOpenWACalculator && (
              <button
                type="button"
                onClick={onOpenWACalculator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Official World Athletics Scoring Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                WA Points
              </button>
            )}
          </div>

          {/* Coach Profile & Utilities (Dedicated for Coaches - No Admin) */}
          <div className="flex items-center gap-3">
            {/* Coach Profile Card */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                DM
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Coach David Miller</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded uppercase">
                    Coach
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Head Athletics Coach • Senior Squad
                </div>
              </div>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetData}
              title="Reset sample data to verified defaults"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
