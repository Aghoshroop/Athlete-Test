import { SexGroup } from './athlete';
import { EventGroup } from './athletics';

export type FitnessCategory =
  | 'mobility'
  | 'flexibility'
  | 'strength'
  | 'speed'
  | 'acceleration'
  | 'explosive_power'
  | 'agility'
  | 'coordination'
  | 'endurance'
  | 'balance';

export const FITNESS_CATEGORIES_INFO: Record<
  FitnessCategory,
  { label: string; description: string; color: string; iconName: string }
> = {
  mobility: {
    label: 'Mobility',
    description: 'Active range of motion around joints under muscular control.',
    color: '#0284C7', // Sky blue
    iconName: 'RotateCw',
  },
  flexibility: {
    label: 'Flexibility',
    description: 'Passive elongation capability of muscle-tendon units.',
    color: '#06B6D4', // Cyan
    iconName: 'Maximize2',
  },
  strength: {
    label: 'Strength',
    description: 'Maximal force production against external resistance.',
    color: '#DC2626', // Red
    iconName: 'Dumbbell',
  },
  speed: {
    label: 'Speed',
    description: 'Maximal velocity over fly-in and sprint segments.',
    color: '#EAB308', // Yellow
    iconName: 'Zap',
  },
  acceleration: {
    label: 'Acceleration',
    description: 'Rate of velocity development from stationary start (0-30m).',
    color: '#F97316', // Orange
    iconName: 'Flame',
  },
  explosive_power: {
    label: 'Explosive Power',
    description: 'Rate of force development (RFD) in vertical and horizontal jumps.',
    color: '#8B5CF6', // Purple
    iconName: 'TrendingUp',
  },
  agility: {
    label: 'Agility',
    description: 'Multi-directional change of direction speed and deceleration.',
    color: '#10B981', // Emerald
    iconName: 'Shuffle',
  },
  coordination: {
    label: 'Coordination',
    description: 'Spatial awareness, neuromuscular timing and rhythm.',
    color: '#14B8A6', // Teal
    iconName: 'Activity',
  },
  endurance: {
    label: 'Endurance',
    description: 'Aerobic capacity, VO2max proxy, and fatigue resistance.',
    color: '#3B82F6', // Blue
    iconName: 'HeartPulse',
  },
  balance: {
    label: 'Balance',
    description: 'Static and dynamic postural stability and vestibular control.',
    color: '#6366F1', // Indigo
    iconName: 'Scale',
  },
};

export type MeasurementDirection = 'higher_is_better' | 'lower_is_better';

export type AggregationMethod = 'best' | 'average' | 'sum' | 'last';

export interface TestDefinition {
  id: string;
  code: string; // e.g. "CMJ", "SPRINT_30M", "SIT_AND_REACH"
  name: string;
  category: FitnessCategory;
  description: string;
  unit: 'cm' | 'm' | 's' | 'kg' | 'reps' | 'degrees' | 'laps' | 'level_shuttle' | 'points' | 'ml/kg/min';
  protocol: string;
  measurementDirection: MeasurementDirection;
  permittedAttempts: number; // e.g. 2 or 3
  resultAggregation: AggregationMethod;
  equipmentRequirements: string[];
  isBilateral: boolean; // Has left and right measurements (e.g. unilateral hop, shoulder mobility, hip mobility)
  
  // Criteria for applicability
  applicableAgeRange: [number, number]; // e.g. [12, 40]
  applicableEventGroups: EventGroup[];  // Which track & field disciplines
  applicableSexGroups: SexGroup[];
  
  // Scientific Benchmark
  benchmarkSourceId?: string;
  hasValidatedBenchmark: boolean;
  benchmarkStatus: 'valid' | 'limited' | 'none';
  notes?: string;
  isCustom?: boolean;
}

export interface TestingBattery {
  id: string;
  organizationId: string;
  name: string; // e.g. "Sprint & Hurdles Baseline Battery", "Jumps Power Profile", "Annual Eurofit"
  description: string;
  eventGroups: EventGroup[];
  testIds: string[];
  isDefault: boolean;
  createdAt: string;
}
