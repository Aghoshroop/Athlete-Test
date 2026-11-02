'use client';

import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { Competition, PerformanceRecord } from '@/types/athletics';
import { NormDataset, ScoringConfiguration } from '@/types/benchmark';
import { TestDefinition, TestingBattery } from '@/types/fitness';
import { AuditLog, UserProfile } from '@/types/user';
import { ReportSnapshot } from '@/types/report';

import { SEED_ATHLETES } from '../data/seed-athletes';
import { SEED_NORM_DATASETS } from '../data/seed-norm-datasets';
import { SEED_TEST_DEFINITIONS, SEED_TESTING_BATTERIES } from '../data/seed-tests';
import { SEED_COMPETITIONS, SEED_PERFORMANCES } from '../data/seed-competitions';
import { SEED_ASSESSMENTS } from '../data/seed-assessments';
import { DEFAULT_SCORING_CONFIG } from '../scoring/benchmark-engine';

const STORAGE_KEYS = {
  ATHLETES: 'athletics_intel_athletes_v1',
  ASSESSMENTS: 'athletics_intel_assessments_v1',
  COMPETITIONS: 'athletics_intel_competitions_v1',
  PERFORMANCES: 'athletics_intel_performances_v1',
  NORM_DATASETS: 'athletics_intel_norm_datasets_v1',
  TESTS: 'athletics_intel_tests_v1',
  BATTERIES: 'athletics_intel_batteries_v1',
  CONFIG: 'athletics_intel_scoring_config_v1',
  REPORTS: 'athletics_intel_reports_v1',
  AUDIT_LOGS: 'athletics_intel_audit_logs_v1',
  CURRENT_USER: 'athletics_intel_current_user_v1',
};

export const DEFAULT_CURRENT_USER: UserProfile = {
  id: 'coach-david-miller',
  email: 'david.miller@athletics.org',
  fullName: 'Coach David Miller',
  role: 'COACH',
  organizationId: 'org-nahpc',
  organizationName: 'National Athletics High Performance Centre',
  assignedSquads: ['Senior Sprint & Hurdle Group A', 'Jumps & Multi-Events'],
  createdAt: '2023-01-01T00:00:00Z',
};

class LocalStorageDB {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  // --- Current User & Role Management ---
  getCurrentUser(): UserProfile {
    return this.getItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_CURRENT_USER);
  }

  setCurrentUser(user: UserProfile): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    this.addAuditLog('update', 'users' as any, user.id, `User switched profile to ${user.fullName} (${user.role})`);
  }

  // --- Athletes ---
  getAthletes(): AthleteProfile[] {
    return this.getItem(STORAGE_KEYS.ATHLETES, SEED_ATHLETES);
  }

  getAthleteById(id: string): AthleteProfile | undefined {
    return this.getAthletes().find((a) => a.id === id);
  }

  saveAthlete(athlete: AthleteProfile): void {
    const list = this.getAthletes();
    const idx = list.findIndex((a) => a.id === athlete.id);
    if (idx >= 0) {
      list[idx] = { ...athlete, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(athlete);
    }
    this.setItem(STORAGE_KEYS.ATHLETES, list);
    this.addAuditLog('update', 'athlete', athlete.id, `Saved athlete profile ${athlete.fullName} (${athlete.athleteCode})`);
  }

  // --- Assessments ---
  getAssessments(): Assessment[] {
    return this.getItem(STORAGE_KEYS.ASSESSMENTS, SEED_ASSESSMENTS);
  }

  getAssessmentById(id: string): Assessment | undefined {
    return this.getAssessments().find((a) => a.id === id);
  }

  getAssessmentsForAthlete(athleteId: string): Assessment[] {
    return this.getAssessments()
      .filter((a) => a.athleteId === athleteId)
      .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime());
  }

  saveAssessment(assessment: Assessment): void {
    const list = this.getAssessments();
    const idx = list.findIndex((a) => a.id === assessment.id);
    if (idx >= 0) {
      list[idx] = { ...assessment, updatedAt: new Date().toISOString(), revision: (list[idx].revision ?? 1) + 1 };
    } else {
      list.unshift(assessment);
    }
    this.setItem(STORAGE_KEYS.ASSESSMENTS, list);
    this.addAuditLog(
      assessment.status === 'finalized' ? 'finalize' : 'create',
      'assessment',
      assessment.id,
      `${assessment.status.toUpperCase()} assessment for ${assessment.athleteName} on ${assessment.assessmentDate}`
    );
  }

  // --- Competitions ---
  getCompetitions(): Competition[] {
    return this.getItem(STORAGE_KEYS.COMPETITIONS, SEED_COMPETITIONS);
  }

  saveCompetition(comp: Competition): void {
    const list = this.getCompetitions();
    const idx = list.findIndex((c) => c.id === comp.id);
    if (idx >= 0) {
      list[idx] = comp;
    } else {
      list.unshift(comp);
    }
    this.setItem(STORAGE_KEYS.COMPETITIONS, list);
    this.addAuditLog('create', 'competition', comp.id, `Saved competition ${comp.name}`);
  }

  // --- Performance Records ---
  getPerformanceRecords(): PerformanceRecord[] {
    return this.getItem(STORAGE_KEYS.PERFORMANCES, SEED_PERFORMANCES);
  }

  getPerformanceRecordsForAthlete(athleteId: string): PerformanceRecord[] {
    return this.getPerformanceRecords()
      .filter((p) => p.athleteId === athleteId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  savePerformanceRecord(record: PerformanceRecord): void {
    const list = this.getPerformanceRecords();
    const idx = list.findIndex((p) => p.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    this.setItem(STORAGE_KEYS.PERFORMANCES, list);
    this.addAuditLog('create', 'performanceRecord', record.id, `Recorded performance for ${record.eventName}: ${record.timeSeconds ? record.timeSeconds + 's' : record.distanceOrHeightMeters + 'm'}`);
  }

  // --- Norm Datasets ---
  getNormDatasets(): NormDataset[] {
    return this.getItem(STORAGE_KEYS.NORM_DATASETS, SEED_NORM_DATASETS);
  }

  getNormDatasetForTest(testCode: string): NormDataset | undefined {
    return this.getNormDatasets().find((d) => d.testCode === testCode);
  }

  // --- Test Definitions & Batteries ---
  getTestDefinitions(): TestDefinition[] {
    return this.getItem(STORAGE_KEYS.TESTS, SEED_TEST_DEFINITIONS);
  }

  saveTestDefinition(test: TestDefinition): void {
    const list = this.getTestDefinitions();
    const idx = list.findIndex((t) => t.id === test.id);
    if (idx >= 0) {
      list[idx] = test;
    } else {
      list.push(test);
    }
    this.setItem(STORAGE_KEYS.TESTS, list);
    this.addAuditLog('create', 'settings', test.id, `Registered test definition ${test.name}`);
  }

  getTestingBatteries(): TestingBattery[] {
    return this.getItem(STORAGE_KEYS.BATTERIES, SEED_TESTING_BATTERIES);
  }

  // --- Scoring Configurations ---
  getScoringConfig(): ScoringConfiguration {
    return this.getItem(STORAGE_KEYS.CONFIG, DEFAULT_SCORING_CONFIG);
  }

  saveScoringConfig(config: ScoringConfiguration): void {
    this.setItem(STORAGE_KEYS.CONFIG, config);
    this.addAuditLog('update', 'settings', config.id, `Updated scoring configuration weights and thresholds`);
  }

  // --- Report Snapshots ---
  getReportSnapshots(): ReportSnapshot[] {
    return this.getItem(STORAGE_KEYS.REPORTS, []);
  }

  saveReportSnapshot(report: ReportSnapshot): void {
    const list = this.getReportSnapshots();
    list.unshift(report);
    this.setItem(STORAGE_KEYS.REPORTS, list);
    this.addAuditLog('export_report', 'assessment', report.assessmentId, `Generated immutable report snapshot ${report.reportCode}`);
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-seed-1',
        organizationId: 'org-nahpc',
        userId: 'coach-david-miller',
        userEmail: 'david.miller@athletics.org',
        userName: 'Coach David Miller',
        role: 'COACH',
        action: 'finalize',
        entityType: 'assessment',
        entityId: 'ass-mv-2024-10',
        details: 'FINALIZED assessment for Marcus Vance (ATH-2024-001) with 89.6 overall fitness score.',
        timestamp: '2024-10-15T12:30:00Z',
      },
    ]);
  }

  addAuditLog(
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ): void {
    if (!this.isBrowser()) return;
    const currentUser = this.getCurrentUser();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      role: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    const list = this.getAuditLogs();
    list.unshift(newLog);
    // Keep last 100 logs
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, list.slice(0, 100));
  }

  // Reset database back to default seed state
  resetToSeed(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.ATHLETES);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.COMPETITIONS);
    localStorage.removeItem(STORAGE_KEYS.PERFORMANCES);
    localStorage.removeItem(STORAGE_KEYS.NORM_DATASETS);
    localStorage.removeItem(STORAGE_KEYS.TESTS);
    localStorage.removeItem(STORAGE_KEYS.BATTERIES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export const db = new LocalStorageDB();
