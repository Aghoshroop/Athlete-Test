import { AthleteProfile } from './athlete';
import { Assessment } from './assessment';
import { Competition, PerformanceRecord } from './athletics';
import { ScoringConfiguration } from './benchmark';
import { ReportDesignConfig } from './report-design';
import { AiTrainingPlan } from './ai-training-plan';

export interface CloudBackupStats {
  athleteCount: number;
  assessmentCount: number;
  competitionCount: number;
  performanceCount: number;
  groupCount: number;
}

export interface CloudBackupPayload {
  email: string;
  coachName: string;
  timestamp: string;
  version: string;
  athletes: AthleteProfile[];
  assessments: Assessment[];
  competitions: Competition[];
  performances: PerformanceRecord[];
  trainingPlans?: AiTrainingPlan[];
  groups: string[];
  scoringConfig?: ScoringConfiguration;
  reportDesign?: ReportDesignConfig;
  stats: CloudBackupStats;
}

export interface CloudSyncResponse {
  success: boolean;
  message: string;
  found?: boolean;
  backup?: CloudBackupPayload;
  timestamp?: string;
  provider?: string;
}
