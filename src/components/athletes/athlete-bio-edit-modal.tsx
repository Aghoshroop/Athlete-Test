'use client';

import React, { useState } from 'react';
import { AthleteProfile, AthleteStatus, DominantSide, SexGroup, calculateAge } from '@/types/athlete';
import { SEED_ATHLETICS_EVENTS } from '@/lib/data/seed-events';
import { db } from '@/lib/storage/local-storage-db';
import { X, UserCheck, AlertCircle, Save, Sparkles, User, Calendar, MapPin, Trophy, Shield } from 'lucide-react';

interface AthleteBioEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: AthleteProfile;
  onSave: (updated: AthleteProfile) => void;
}

export function AthleteBioEditModal({
  isOpen,
  onClose,
  athlete,
  onSave,
}: AthleteBioEditModalProps) {
  const [fullName, setFullName] = useState(athlete.fullName);
  const [athleteCode, setAthleteCode] = useState(athlete.athleteCode);
  const [dateOfBirth, setDateOfBirth] = useState(athlete.dateOfBirth);
  const [sex, setSex] = useState<SexGroup>(athlete.sex);
  const [club, setClub] = useState(athlete.club || 'National Athletics High Performance Centre');
  const [coachName, setCoachName] = useState(athlete.coachName || 'Coach Rudra Roy');
  const [trainingSquad, setTrainingSquad] = useState(
    athlete.trainingSquad || 'Senior Sprint & Hurdle Group A'
  );
  const [dominantHand, setDominantHand] = useState<DominantSide>(athlete.dominantHand || 'right');
  const [dominantFoot, setDominantFoot] = useState<DominantSide>(athlete.dominantFoot || 'left');

  // Primary Event
  const initialEvent =
    SEED_ATHLETICS_EVENTS.find((e) => e.name === athlete.primaryEventName) ||
    SEED_ATHLETICS_EVENTS[0];
  const [primaryEventId, setPrimaryEventId] = useState(initialEvent?.id || 'evt-100m');
  const [secondaryEventIds, setSecondaryEventIds] = useState<string[]>(
    athlete.secondaryEventNames
      ? SEED_ATHLETICS_EVENTS.filter((e) => athlete.secondaryEventNames?.includes(e.name)).map(
          (e) => e.id
        )
      : []
  );

  const [status, setStatus] = useState<AthleteStatus>(athlete.status);
  const [notes, setNotes] = useState(athlete.notes || '');
  const [emergencyContactName, setEmergencyContactName] = useState(
    athlete.emergencyContact?.name || ''
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    athlete.emergencyContact?.phone || ''
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculatedAge = calculateAge(dateOfBirth);
  const selectedPrimaryEvent = SEED_ATHLETICS_EVENTS.find((e) => e.id === primaryEventId);

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
      setError('Athlete legal full name cannot be empty.');
      return;
    }
    if (!dateOfBirth) {
      setError('Date of birth is required for scientific age-group norm calibration.');
      return;
    }

    const secondaryEventNames = secondaryEventIds
      .map((id) => SEED_ATHLETICS_EVENTS.find((e) => e.id === id)?.name)
      .filter((n): n is string => Boolean(n));

    const updatedAthlete: AthleteProfile = {
      ...athlete,
      fullName: fullName.trim(),
      athleteCode: athleteCode.trim(),
      dateOfBirth,
      sex,
      club,
      coachName,
      trainingSquad,
      dominantHand,
      dominantFoot,
      primaryEventName: selectedPrimaryEvent?.name || athlete.primaryEventName,
      eventGroup: selectedPrimaryEvent?.eventGroup || athlete.eventGroup,
      secondaryEventNames,
      status,
      notes: notes.trim(),
      emergencyContact:
        emergencyContactName || emergencyContactPhone
          ? {
              name: emergencyContactName.trim(),
              relationship: athlete.emergencyContact?.relationship || 'Guardian / Emergency Contact',
              phone: emergencyContactPhone.trim(),
            }
          : athlete.emergencyContact,
      updatedAt: new Date().toISOString(),
    };

    db.saveAthlete(updatedAthlete);
    onSave(updatedAthlete);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto no-print"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-md shadow-red-950/40">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Edit Athlete Bio Data & Profile</h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white">
                  {athlete.athleteCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Update legal name, primary discipline, date of birth, squad placement and bio info
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-rose-300 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Core Bio Data */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <User className="w-4 h-4" /> 1. Athlete Legal Identity & Demographics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Athlete System Code *
                </label>
                <input
                  type="text"
                  required
                  value={athleteCode}
                  onChange={(e) => setAthleteCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Date of Birth *</span>
                  <span className="text-[10px] text-rose-400 font-mono">
                    Age: {calculatedAge} years
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Biological Sex *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSex('male')}
                    className={`py-2 px-3 rounded-lg border font-bold transition text-center ${
                      sex === 'male'
                        ? 'bg-red-600 border-red-500 text-white shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Male (M)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('female')}
                    className={`py-2 px-3 rounded-lg border font-bold transition text-center ${
                      sex === 'female'
                        ? 'bg-red-600 border-red-500 text-white shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Female (F)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Discipline & Squad */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Trophy className="w-4 h-4" /> 2. Athletics Event & Training Placement
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Primary Athletics Event *
                </label>
                <select
                  value={primaryEventId}
                  onChange={(e) => setPrimaryEventId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500 font-semibold"
                >
                  {SEED_ATHLETICS_EVENTS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.eventGroup.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Athlete Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AthleteStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500 font-semibold"
                >
                  <option value="active">Active Competitor</option>
                  <option value="injured">Injured (Medical Hold)</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Training Squad *
                </label>
                <input
                  type="text"
                  value={trainingSquad}
                  onChange={(e) => setTrainingSquad(e.target.value)}
                  placeholder="e.g. Senior Sprint & Hurdle Group A"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Supervising Coach *
                </label>
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Secondary Events Chips */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Secondary Events / Multi-Event Specialties
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                {SEED_ATHLETICS_EVENTS.filter((e) => e.id !== primaryEventId).map((e) => {
                  const isSelected = secondaryEventIds.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => handleToggleSecondary(e.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
                        isSelected
                          ? 'bg-red-600/30 border-red-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {e.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Biomechanical Profile & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4" /> 3. Biomechanics & Emergency Contacts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dominant Hand</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDominantHand('left')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold transition ${
                      dominantHand === 'left'
                        ? 'bg-slate-800 border-red-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setDominantHand('right')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold transition ${
                      dominantHand === 'right'
                        ? 'bg-slate-800 border-red-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dominant Foot</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDominantFoot('left')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold transition ${
                      dominantFoot === 'left'
                        ? 'bg-slate-800 border-red-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setDominantFoot('right')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold transition ${
                      dominantFoot === 'right'
                        ? 'bg-slate-800 border-red-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Parent / Guardian Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 / +44 Phone Number"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Athlete Bio, Training Notes & Medical Remarks
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document training history, past injuries, physical screening notes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-hidden focus:ring-2 focus:ring-red-500 text-xs"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-950/40 inline-flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Save Athlete Bio Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
