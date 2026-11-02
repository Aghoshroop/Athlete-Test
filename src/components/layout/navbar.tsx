'use client';

import React from 'react';
import { UserRole, UserProfile } from '@/types/user';
import { db } from '@/lib/storage/local-storage-db';
import { Shield, UserCheck, Flame, Plus, Calculator, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenWACalculator?: () => void;
}

export function Navbar({
  currentUser,
  onUserChange,
  onOpenTestingModal,
  onOpenAthleteModal,
  onOpenWACalculator,
}: NavbarProps) {
  const handleRoleSelect = (role: UserRole) => {
    let updated: UserProfile = { ...currentUser, role };
    if (role === 'ADMIN') {
      updated = {
        ...updated,
        id: 'admin-sarah-connor',
        fullName: 'Sarah Connor (Director)',
        email: 'director@athletics.org',
      };
    } else if (role === 'COACH') {
      updated = {
        ...updated,
        id: 'coach-david-miller',
        fullName: 'Coach David Miller',
        email: 'david.miller@athletics.org',
      };
    } else {
      updated = {
        ...updated,
        id: 'ath-user-marcus',
        fullName: 'Marcus Vance (Athlete)',
        email: 'marcus.vance@athletes.org',
        athleteId: 'ath-marcus-vance',
      };
    }
    db.setCurrentUser(updated);
    onUserChange(updated);
  };

  const handleResetData = () => {
    if (confirm('Reset demo database to standard factory seed state? All test measurements will be restored to verified defaults.')) {
      db.resetToSeed();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl tracking-tighter">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  ATHLETICS <span className="text-amber-400">INTELLIGENCE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-400/30">
                  Track & Field Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                National High Performance Athletics Centre
              </p>
            </div>
          </div>

          {/* Quick Action Buttons (Coach & Admin) */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser.role !== 'ATHLETE' && (
              <>
                <button
                  onClick={onOpenTestingModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Assessment
                </button>
                <button
                  onClick={onOpenAthleteModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  Add Athlete
                </button>
              </>
            )}
            <button
              onClick={onOpenWACalculator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Official World Athletics Scoring Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              WA Points Calc
            </button>
          </div>

          {/* Role Switcher & Profile */}
          <div className="flex items-center gap-3">
            {/* Live Role Switcher */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2 hidden sm:inline">Role:</span>
              <button
                onClick={() => handleRoleSelect('COACH')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  currentUser.role === 'COACH'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Coach
              </button>
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSelect('ATHLETE')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  currentUser.role === 'ATHLETE'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Athlete
              </button>
            </div>

            {/* Reset Seed Button */}
            <button
              onClick={handleResetData}
              title="Reset sample data"
              className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
