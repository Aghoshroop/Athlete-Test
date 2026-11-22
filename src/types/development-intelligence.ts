export interface AthleteDevelopmentInsight {
  athleteId: string;
  athleteName: string;
  athleteCode: string;
  primaryEvent: string;
  eventGroup: string;
  readinessScore: number; // 0-100
  eventBiomechanicalDiagnosis: string;
  longitudinalProgressAnalysis: string;
  topPriorityBottleneck: string;
  coachingActionPlan: string[];
  coachRudraFieldCues: string[];
  recommendedDrills: Array<{
    name: string;
    focus: string;
    prescription: string;
    technicalCue: string;
  }>;
  bilateralPrehabAlert: string;
  periodizationRecommendation: string;
  modelUsed: string;
  generatedAt: string;
}

export interface SquadDevelopmentInsight {
  squadName: string;
  totalAthletes: number;
  averageFitnessScore: number;
  eventGroupFocus: string;
  squadStrengthsOverview: string;
  systemicBottlenecks: string[];
  highRiskAthletes: Array<{
    athleteName: string;
    athleteCode: string;
    riskFactor: string;
    recommendedIntervention: string;
  }>;
  teamPeriodizationDirective: string;
  coachRudraWeeklyActionPlan: string[];
  teamPrehabProtocol: string[];
  modelUsed: string;
  generatedAt: string;
}

export interface DevelopmentIntelligenceRequest {
  mode: 'individual' | 'squad';
  apiKey?: string;
  athlete?: {
    id: string;
    fullName: string;
    athleteCode: string;
    sex: string;
    primaryEventName: string;
    eventGroup: string;
    trainingSquad: string;
    club?: string;
  };
  assessment?: any;
  assessmentHistory?: any[];
  squadAthletes?: Array<{
    id: string;
    fullName: string;
    athleteCode: string;
    primaryEventName: string;
    eventGroup: string;
    latestFitnessScore?: number;
    highestAsymmetryPercent?: number;
    highestAsymmetryTest?: string;
    trend?: 'improving' | 'stable' | 'declining';
  }>;
  coachQuery?: string;
  focusTopic?: string;
}
