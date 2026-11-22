export interface ExerciseDrill {
  name: string;
  sets: number;
  reps: string;
  intensity: string;
  rest: string;
  technicalCue: string;
}

export interface TrainingDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  warmupProtocol: string[];
  drills: ExerciseDrill[];
  correctivesAndPrehab: string[];
  recoveryNote: string;
}

export interface AiTrainingPlan {
  id: string;
  athleteId: string;
  athleteName: string;
  coachName: string;
  createdAt: string;
  focusGoal: string;
  cycleDuration: string;
  executiveSummary: string;
  keyDeficitAddressed: string;
  days: TrainingDay[];
  bilateralInterventions: string[];
  coachRudraFieldCues: string[];
  modelUsed: string;
}

export interface GenerateTrainingPlanRequest {
  athlete: {
    id: string;
    fullName: string;
    athleteCode: string;
    dateOfBirth?: string;
    sex: string;
    primaryEventName: string;
    eventGroup: string;
    trainingSquad?: string;
    club?: string;
  };
  assessment?: {
    id: string;
    overallFitnessScore?: number;
    overallRating?: string;
    assessmentDate: string;
    testResults?: Array<{
      testName: string;
      category: string;
      finalRawValue?: number;
      unit: string;
      percentile?: number;
      rating?: string;
      asymmetryPercent?: number;
    }>;
    categoryScores?: Record<string, { categoryScorePercentile: number; rating: string }>;
    topStrengths?: string[];
    areasToImprove?: string[];
    bilateralAsymmetries?: Array<{ testName: string; asymmetryPercent: number; description: string }>;
  };
  focusGoal?: string;
  cycleDuration?: string;
  coachCustomNotes?: string;
  apiKey?: string;
}
