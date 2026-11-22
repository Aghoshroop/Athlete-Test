'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile, AthleteStatus, DominantSide, SexGroup, calculateAge } from '@/types/athlete';
import { SEED_ATHLETICS_EVENTS } from '@/lib/data/seed-events';
import { db } from '@/lib/storage/local-storage-db';
import { X, UserPlus, Check, AlertCircle, Users, Sparkles } from 'lucide-react';

interface AthleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: AthleteProfile) => void;
  existingAthletesCount: number;
  defaultCoachName?: string;
}

export function AthleteRegistrationModal({
  isOpen,
  onClose,
  onSave,
  existingAthletesCount,
  defaultCoachName = '',
}: AthleteRegistrationModalProps) {
  const currentYear = 2026;
  const nextCodeNum = String(existingAthletesCount + 1).padStart(3, '0');
  const generatedAthleteCode = `ATH-${currentYear}-${nextCodeNum}`;

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2005-06-15');
  const [sex, setSex] = useState<SexGroup>('male');
  const [club, setClub] = useState('National Athletics High Performance Centre');
  const [coachName, setCoachName] = useState(() => {
    if (defaultCoachName) return defaultCoachName;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('athletics_active_coach') || '';
    }
    return '';
  });

  // Dynamic Group / Squad states
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({});
  const [trainingSquad, setTrainingSquad] = useState('');
  const [dominantHand, setDominantHand] = useState<DominantSide>('right');
  const [dominantFoot, setDominantFoot] = useState<DominantSide>('left');

  useEffect(() => {
    if (defaultCoachName) {
      setCoachName(defaultCoachName);
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('athletics_active_coach');
      if (saved) setCoachName(saved);
    }

    if (isOpen) {
      // Load registered groups and athlete count per group
      const groups = db.getGroups();
      setAvailableGroups(groups);

      const athletes = db.getAthletes();
      const counts: Record<string, number> = {};
      athletes.forEach((a: AthleteProfile) => {
        const sq = a.trainingSquad?.trim();
        if (sq) counts[sq] = (counts[sq] || 0) + 1;
      });
      setGroupCounts(counts);

      // Default to last used group if available, otherwise first registered group, or empty
      const lastUsed = typeof window !== 'undefined' ? localStorage.getItem('athletics_last_used_group') : null;
      if (lastUsed && lastUsed.trim()) {
        setTrainingSquad(lastUsed.trim());
      } else if (groups.length > 0) {
        setTrainingSquad(groups[0]);
      } else {
        setTrainingSquad('');
      }
    }
  }, [defaultCoachName, isOpen]);
  
  // Events
  const [primaryEventId, setPrimaryEventId] = useState('evt-100m');
  const [secondaryEventIds, setSecondaryEventIds] = useState<string[]>(['evt-200m']);
  
  // Measurements
  const [heightCm, setHeightCm] = useState(180.0);
  const [weightKg, setWeightKg] = useState(72.5);
  const [armSpanCm, setArmSpanCm] = useState(185.0);
  
  const [status, setStatus] = useState<AthleteStatus>('active');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculatedAge = calculateAge(dateOfBirth);
  const selectedPrimaryEvent = SEED_ATHLETICS_EVENTS.find((e) => e.id === primaryEventId);

  const cleanSquad = trainingSquad.trim();
  const isExistingGroup = availableGroups.includes(cleanSquad);

  const handleToggleSecondary = (eventId: string) => {
    if (eventId === primaryEventId) return;
    if (secondaryEventIds.includes(eventId)) {
      setSecondaryEventIds(secondaryEventIds.filter((id) => id !== eventId));
    } else {
      setSecondaryEventIds([...secondaryEventIds, eventId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide the athlete full legal name.');
      return;
    }
    if (!dateOfBirth) {
      setError('Date of birth is required for norm matching.');
      return;
    }
    if (!cleanSquad) {
      setError('Please provide or select a Training Squad / Group name.');
      return;
    }

    // Persist group for future suggestions
    db.saveGroup(cleanSquad);
    if (typeof window !== 'undefined') {
      localStorage.setItem('athletics_last_used_group', cleanSquad);
    }

    const newId = `ath-${Date.now()}`;
    const measurementId = `meas-${Date.now()}`;

    const newMeasurement = {
      id: measurementId,
      athleteId: newId,
      date: new Date().toISOString().split('T')[0],
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      armSpanCm: Number(armSpanCm),
      notes: 'Initial registration baseline body measurements.',
    };

    const newAthlete: AthleteProfile = {
      id: newId,
      organizationId: 'org-nahpc',
      athleteCode: generatedAthleteCode,
      fullName: fullName.trim(),
      dateOfBirth,
      sex,
      club,
      coachId: 'coach-lead',
      coachName,
      trainingSquad: cleanSquad,
      dominantHand,
      dominantFoot,
      primaryEventId,
      primaryEventName: selectedPrimaryEvent?.name ?? '100m',
      eventGroup: selectedPrimaryEvent?.eventGroup ?? 'sprints',
      secondaryEventIds,
      secondaryEventNames: secondaryEventIds.map(
        (id) => SEED_ATHLETICS_EVENTS.find((e) => e.id === id)?.name ?? id
      ),
      status,
      currentMeasurements: newMeasurement,
      measurementHistory: [newMeasurement],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newAthlete);
    onClose();
  };

  const primaryGenderParams = sex === 'male'
    ? selectedPrimaryEvent?.genderParameters?.male
    : selectedPrimaryEvent?.genderParameters?.female;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600 text-white font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register Track & Field Athlete</h2>
              <p className="text-xs text-slate-400">
                System Code: <span className="font-mono text-rose-400 font-semibold">{generatedAthleteCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Personal & Norm Identification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Personal & Norm Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Athlete Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth * (Calculated Age: <span className="text-red-600 font-bold">{calculatedAge} yrs</span>)
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sex / Gender-Specific Testing Norms *
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as SexGroup)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium text-slate-900"
                >
                  <option value="male">Male (Senior Men Implements & Barriers)</option>
                  <option value="female">Female (Senior Women Implements & Barriers)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Athletics Event Assignments & Training Group */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Athletics Event & Squad Grouping
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Athletics Event *
                </label>
                <select
                  value={primaryEventId}
                  onChange={(e) => setPrimaryEventId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-semibold text-slate-900"
                >
                  {SEED_ATHLETICS_EVENTS.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      [{evt.category.toUpperCase()}] {evt.name}
                    </option>
                  ))}
                </select>

                {/* Live Gender-Specific Parameter Preview */}
                {selectedPrimaryEvent && primaryGenderParams && (
                  <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1 text-slate-600">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Parameters for {sex === 'male' ? 'Men (M)' : 'Women (F)'}:</span>
                      <span className="text-[10px] text-red-600 uppercase font-mono">{selectedPrimaryEvent.category}</span>
                    </div>
                    {primaryGenderParams.implementSpec && (
                      <p><strong className="text-slate-700">Implement:</strong> {primaryGenderParams.implementSpec}</p>
                    )}
                    {primaryGenderParams.hurdleHeightM && (
                      <p>
                        <strong className="text-slate-700">Hurdles:</strong> {primaryGenderParams.hurdleHeightM}m ({primaryGenderParams.barrierCount || 10} barriers)
                        {primaryGenderParams.hurdleSpacing && ` • ${primaryGenderParams.hurdleSpacing}`}
                      </p>
                    )}
                    {primaryGenderParams.worldRecord && (
                      <p><strong className="text-slate-700">WR:</strong> {primaryGenderParams.worldRecord.mark} ({primaryGenderParams.worldRecord.athlete})</p>
                    )}
                  </div>
                )}
              </div>

              {/* Group / Squad with Dropdown Suggestions & Auto-save */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-red-600" />
                    Training Squad / Group *
                  </label>
                  {isExistingGroup ? (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Existing Group ({groupCounts[cleanSquad] || 0} athlete{groupCounts[cleanSquad] === 1 ? '' : 's'})
                    </span>
                  ) : cleanSquad ? (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> New Group
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  {availableGroups.length > 0 && (
                    <select
                      value={isExistingGroup ? cleanSquad : '__new__'}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setTrainingSquad('');
                        } else {
                          setTrainingSquad(e.target.value);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-slate-50 font-medium text-slate-800"
                    >
                      <option value="__new__">+ Write / Create a new group name below...</option>
                      {availableGroups.map((grp) => (
                        <option key={grp} value={grp}>
                          📁 {grp} ({groupCounts[grp] || 0} athlete{groupCounts[grp] === 1 ? '' : 's'})
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    required
                    value={trainingSquad}
                    onChange={(e) => setTrainingSquad(e.target.value)}
                    placeholder="e.g. Senior Sprint & Hurdle Group A"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    Select an existing squad or type a new name. Newly created groups automatically save and will be suggested for future athletes.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary Events (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg max-h-36 overflow-y-auto">
                  {SEED_ATHLETICS_EVENTS.filter((e) => e.id !== primaryEventId).map((evt) => {
                    const isSelected = secondaryEventIds.includes(evt.id);
                    return (
                      <button
                        type="button"
                        key={evt.id}
                        onClick={() => handleToggleSecondary(evt.id)}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                          isSelected
                            ? 'bg-red-600 text-white font-bold shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {evt.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Baseline Body Measurements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              3. Baseline Body Measurements
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arm Span (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={armSpanCm}
                  onChange={(e) => setArmSpanCm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Coaching & Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              4. Coaching & Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Coach
                </label>
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Athlete Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AthleteStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="active">Active (Full Training)</option>
                  <option value="injured">Injured</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="off-season">Off-Season</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-500 hover:to-rose-500 transition shadow"
            >
              <Check className="w-4 h-4" />
              Save Athlete Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
