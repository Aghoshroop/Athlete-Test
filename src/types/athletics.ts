export type AthleticsCategory = 'track' | 'jumps' | 'throws' | 'combined' | 'road_and_walk';

export type EventGroup = 
  | 'sprints'
  | 'hurdles'
  | 'middle_distance'
  | 'long_distance'
  | 'jumps'
  | 'throws'
  | 'combined'
  | 'race_walk';

export type TimingMethod = 'FAT' | 'hand' | 'transponder'; // Fully Automatic Timing vs Hand Timing
export type WindLegalStatus = 'legal' | 'wind_assisted' | 'nwi'; // No Wind Information

export interface EventGenderParameters {
  implementWeightKg?: number;
  implementSpec?: string;
  hurdleHeightM?: number;
  hurdleSpacing?: string;
  barrierCount?: number;
  worldRecord?: {
    mark: string;
    athlete: string;
    year: number;
    notes?: string;
  };
  qualifyingStandard?: string; // Olympic / World qualifying standard
  benchmarks?: {
    elite: string;
    national: string;
    club: string;
  };
}

export interface AthleticsEventDefinition {
  id: string;
  code: string; // e.g. "100M", "LJ", "SP", "DEC"
  name: string;
  category: AthleticsCategory;
  eventGroup: EventGroup;
  unit: 'seconds' | 'meters' | 'points';
  measurementDirection: 'lower_is_better' | 'higher_is_better';
  isWindApplicable: boolean;
  implementWeightKg?: number; // legacy fallback
  hurdleHeightM?: number;    // legacy fallback
  isCombinedEvent: boolean;
  combinedSubEventIds?: string[];
  description: string;
  genderParameters?: {
    male: EventGenderParameters;
    female: EventGenderParameters;
  };
}

export type CompetitionLevel = 
  | 'club'
  | 'district'
  | 'state'
  | 'national'
  | 'international_invitational'
  | 'world_athletics_continental'
  | 'major_championships';

export type SurfaceType = 'synthetic_tartan' | 'synthetic_mondo' | 'cinder' | 'grass' | 'road';

export interface Competition {
  id: string;
  organizationId: string;
  name: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  venue: string;
  city: string;
  country: string;
  category: AthleticsCategory;
  level: CompetitionLevel;
  surface: SurfaceType;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface FieldAttempt {
  attemptNumber: number;
  result: number; // in meters
  isValid: boolean;
  isPass: boolean;
  windReading?: number; // m/s
  notes?: string;
}

export interface TrackSplit {
  splitDistanceM: number;
  splitTimeSec: number;
  cumulativeTimeSec: number;
}

export interface PerformanceRecord {
  id: string;
  athleteId: string;
  organizationId: string;
  competitionId?: string;
  competitionName: string;
  eventId: string;
  eventName: string;
  eventCategory: AthleticsCategory;
  date: string; // YYYY-MM-DD
  
  // Round
  round: 'heats' | 'semifinal' | 'final' | 'time_trial' | 'combined_discipline';
  position?: number;
  
  // Track Specifics
  timeSeconds?: number;
  reactionTimeSeconds?: number;
  splits?: TrackSplit[];
  
  // Field Specifics
  distanceOrHeightMeters?: number;
  attempts?: FieldAttempt[];
  implementWeightKg?: number;
  
  // Common Condition Factors
  windReading?: number; // e.g. +1.4 or +2.4 (wind assisted if > +2.0)
  windLegalStatus: WindLegalStatus;
  timingMethod: TimingMethod;
  isLegalForRecords: boolean;
  
  // Scoring
  worldAthleticsPoints?: number;
  combinedDisciplinePoints?: number;
  waTableVersion?: string; // e.g. "2022_OUTDOOR_TABLES"
  
  // Milestone flags
  isPersonalBest: boolean;
  isSeasonBest: boolean;
  
  notes?: string;
  recordedByCoachId: string;
  verifiedByAdmin: boolean;
  createdAt: string;
}

export interface CombinedEventScoreSheet {
  athleteId: string;
  competitionId: string;
  combinedEventCode: 'DEC' | 'HEP' | 'PEN';
  disciplines: {
    eventId: string;
    eventName: string;
    rawResult: number;
    unit: string;
    wind?: number;
    points: number;
    day: 1 | 2;
  }[];
  totalPoints: number;
  day1Points: number;
  day2Points: number;
  rank?: number;
}
