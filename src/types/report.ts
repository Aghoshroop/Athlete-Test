import { Assessment } from './assessment';
import { PerformanceRecord } from './athletics';

export interface ReportSnapshot {
  id: string;
  reportCode: string; // e.g. "REP-2024-008"
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  athleteId: string;
  athleteCode: string;
  athleteName: string;
  athleteDob: string;
  ageOnTestingDate: number;
  sex: string;
  primaryEvent: string;
  eventGroup: string;
  coachName: string;
  testingDate: string;
  assessmentId: string;
  
  // Frozen Assessment copy to guarantee historical reproducibility
  assessmentSnapshot: Assessment;
  
  // Optional performance section
  recentCompetitionRecords?: PerformanceRecord[];
  
  generatedByUserId: string;
  generatedByUserName: string;
  generatedAt: string;
  scoringVersion: string;
  benchmarkSourcesCited: {
    sourceName: string;
    doi: string;
    population: string;
  }[];
}
