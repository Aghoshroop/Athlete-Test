export type SexGroup = 'male' | 'female';

export type AthleteStatus = 'active' | 'injured' | 'rehabilitation' | 'off-season' | 'retired';

export type DominantSide = 'left' | 'right' | 'ambidextrous';

export interface EmergencyContact {
  name: string;
  relationship?: string;
  phone: string;
}

export interface BodyMeasurement {
  id: string;
  athleteId: string;
  date: string; // ISO date string YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  armSpanCm?: number;
  sittingHeightCm?: number;
  bodyFatPercent?: number;
  recordedByCoachId?: string;
  notes?: string;
}

export interface AthleteProfile {
  id: string;
  organizationId: string;
  athleteCode: string; // e.g. "ATH-2024-001"
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  sex: SexGroup;
  photoUrl?: string;
  club: string;
  coachId: string;
  coachName: string;
  trainingSquad: string; // e.g. "Sprint Squad A", "Throws Elite"
  dominantHand: DominantSide;
  dominantFoot?: DominantSide;
  
  // Athletics Events
  primaryEventId: string;
  primaryEventName: string;
  eventGroup: 'sprints' | 'hurdles' | 'middle_distance' | 'long_distance' | 'jumps' | 'throws' | 'combined' | 'race_walk';
  secondaryEventIds: string[];
  secondaryEventNames: string[];
  
  status: AthleteStatus;
  
  // Bio notes & emergency contact
  notes?: string;
  emergencyContact?: EmergencyContact;
  
  // Current Body Measurements snapshot
  currentMeasurements: BodyMeasurement;
  
  // Historical Measurements array
  measurementHistory: BodyMeasurement[];
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Utility to calculate exact decimal age on a given date from Date of Birth.
 * Defaults to current year 2026 reference date ('2026-11-22') to preserve stable Next.js 16 prerendering.
 */
export function calculateAge(dobString: string, targetDateString: string = '2026-11-22'): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  const target = new Date(targetDateString);
  
  let years = target.getFullYear() - dob.getFullYear();
  const m = target.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && target.getDate() < dob.getDate())) {
    years--;
  }
  
  // Decimal age calculation
  const lastBirthdayYear = target.getFullYear() - (m < 0 || (m === 0 && target.getDate() < dob.getDate()) ? 1 : 0);
  const lastBirthday = new Date(lastBirthdayYear, dob.getMonth(), dob.getDate());
  const nextBirthday = new Date(lastBirthdayYear + 1, dob.getMonth(), dob.getDate());
  const diffTotal = nextBirthday.getTime() - lastBirthday.getTime();
  const fraction = diffTotal > 0 ? (target.getTime() - lastBirthday.getTime()) / diffTotal : 0;
  
  return Math.max(0, Math.round((years + Math.min(Math.max(fraction, 0), 0.999)) * 10) / 10);
}

export function calculateAgeInteger(dobString: string, targetDateString: string = '2026-11-22'): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  const target = new Date(targetDateString);
  let age = target.getFullYear() - dob.getFullYear();
  const m = target.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && target.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}
