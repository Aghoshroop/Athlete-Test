'use client';

import { AthleteProfile } from '@/types/athlete';
import { getAthleteZone, SportZone } from '@/types/zone';
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
import { createDefaultAssessmentForAthlete } from '../data/generate-athlete-assessment';
import { ReportDesignConfig, DEFAULT_REPORT_DESIGN } from '@/types/report-design';
import { AiTrainingPlan } from '@/types/ai-training-plan';
import { CloudBackupPayload, CloudSyncResponse } from '@/types/cloud-backup';

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
  REPORT_DESIGN: 'athletics_intel_report_design_v1',
  TRAINING_PLANS: 'athletics_intel_training_plans_v1',
  GROUPS: 'athletics_intel_groups_v1',
  MULTI_GROUPS: 'athletics_intel_groups_multi_v1',
  COACH_EMAIL: 'athletics_coach_gmail',
  LAST_SYNC: 'athletics_last_cloud_sync',
};

export const DEFAULT_CURRENT_USER: UserProfile = {
  id: 'coach-lead',
  email: 'coach@athletics.org',
  fullName: '',
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
    const user = this.getItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_CURRENT_USER);
    if (this.isBrowser()) {
      const activeCoach = localStorage.getItem('athletics_active_coach');
      if (activeCoach && activeCoach.trim() && activeCoach !== 'Coach Rudra Roy' && activeCoach !== 'Coach David Miller') {
        user.fullName = activeCoach.trim();
      }
    }
    // Auto-migrate legacy coach identity from previous browser local storage
    if (user && (user.id === 'coach-david-miller' || user.fullName?.includes('David Miller') || user.fullName === 'Coach Rudra Roy')) {
      const activeCoach = this.isBrowser() ? localStorage.getItem('athletics_active_coach') : null;
      const cleanCoach = activeCoach && activeCoach !== 'Coach Rudra Roy' && activeCoach !== 'Coach David Miller' ? activeCoach : '';
      const migratedUser: UserProfile = {
        ...DEFAULT_CURRENT_USER,
        fullName: cleanCoach,
        role: user.role || 'COACH',
      };
      this.setItem(STORAGE_KEYS.CURRENT_USER, migratedUser);
      return migratedUser;
    }
    return user;
  }

  setCurrentUser(user: UserProfile): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    this.addAuditLog('update', 'users' as any, user.id, `User switched profile to ${user.fullName} (${user.role})`);
  }

  // --- Clean Production Slate (0 Dummy Athletes) ---
  purgeInitialSeedData(): void {
    if (!this.isBrowser()) return;
    const purged = localStorage.getItem('athletics_seed_data_purged_v3');
    if (!purged) {
      localStorage.setItem(STORAGE_KEYS.ATHLETES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.PERFORMANCES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify([]));
      localStorage.removeItem('athletics_active_squad_athletes');
      localStorage.setItem('athletics_seed_data_purged_v3', 'true');
    }
  }

  // --- Athletes ---
  getAthletes(): AthleteProfile[] {
    this.purgeInitialSeedData();
    const list = this.getItem<AthleteProfile[]>(STORAGE_KEYS.ATHLETES, []);
    return list;
  }

  getAthleteById(id: string): AthleteProfile | undefined {
    return this.getAthletes().find((a) => a.id === id);
  }

  // --- Squad / Training Groups Management (Zone-Isolated) ---
  getGroups(zone?: SportZone): string[] {
    if (zone === 'multi_sports') {
      const storedMulti = this.getItem<string[]>(STORAGE_KEYS.MULTI_GROUPS, []);
      const multiAthleteGroups = this.getAthletes()
        .filter((a) => getAthleteZone(a) === 'multi_sports')
        .map((a) => a.trainingSquad?.trim())
        .filter((s): s is string => Boolean(s && s.length > 0));
      return Array.from(new Set([...storedMulti, ...multiAthleteGroups]))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    }

    if (zone === 'track_and_field') {
      const storedTrack = this.getItem<string[]>(STORAGE_KEYS.GROUPS, []);
      const trackAthleteGroups = this.getAthletes()
        .filter((a) => getAthleteZone(a) === 'track_and_field')
        .map((a) => a.trainingSquad?.trim())
        .filter((s): s is string => Boolean(s && s.length > 0));
      return Array.from(new Set([...storedTrack, ...trackAthleteGroups]))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    }

    const storedGroups = this.getItem<string[]>(STORAGE_KEYS.GROUPS, []);
    const storedMultiGroups = this.getItem<string[]>(STORAGE_KEYS.MULTI_GROUPS, []);
    const athleteGroups = this.getAthletes()
      .map((a) => a.trainingSquad?.trim())
      .filter((s): s is string => Boolean(s && s.length > 0));

    return Array.from(new Set([...storedGroups, ...storedMultiGroups, ...athleteGroups]))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  saveGroup(groupName: string, zone: SportZone = 'track_and_field'): string[] {
    const trimmed = groupName?.trim();
    if (!trimmed) return this.getGroups(zone);

    const key = zone === 'multi_sports' ? STORAGE_KEYS.MULTI_GROUPS : STORAGE_KEYS.GROUPS;
    const current = this.getItem<string[]>(key, []);
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed].sort((a, b) => a.localeCompare(b));
      this.setItem(key, updated);
    }
    return this.getGroups(zone);
  }

  deleteGroup(groupName: string, zone: SportZone = 'track_and_field'): string[] {
    const trimmed = groupName?.trim();
    const key = zone === 'multi_sports' ? STORAGE_KEYS.MULTI_GROUPS : STORAGE_KEYS.GROUPS;
    const current = this.getItem<string[]>(key, []);
    const filtered = current.filter((g) => g !== trimmed);
    this.setItem(key, filtered);
    return this.getGroups(zone);
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
    if (athlete.trainingSquad?.trim()) {
      this.saveGroup(athlete.trainingSquad.trim(), getAthleteZone(athlete));
    }
    this.addAuditLog('update', 'athlete', athlete.id, `Saved athlete profile ${athlete.fullName} (${athlete.athleteCode})`);
  }

  deleteAthlete(athleteId: string): void {
    const list = this.getAthletes();
    const athlete = list.find((a) => a.id === athleteId);
    if (!athlete) return;

    // Remove athlete
    const remainingAthletes = list.filter((a) => a.id !== athleteId);
    this.setItem(STORAGE_KEYS.ATHLETES, remainingAthletes);

    // Cascade remove assessments associated with this athlete
    const allAssessments = this.getAssessments();
    const deletedAssessmentIds = new Set(allAssessments.filter((a) => a.athleteId === athleteId).map((a) => a.id));
    const remainingAssessments = allAssessments.filter((a) => a.athleteId !== athleteId);
    this.setItem(STORAGE_KEYS.ASSESSMENTS, remainingAssessments);

    // Cascade remove performance records associated with this athlete
    const allPerformances = this.getPerformanceRecords();
    const remainingPerformances = allPerformances.filter((p) => p.athleteId !== athleteId);
    this.setItem(STORAGE_KEYS.PERFORMANCES, remainingPerformances);

    // Cascade remove snapshots associated with deleted assessments
    const allReports = this.getReportSnapshots();
    const remainingReports = allReports.filter((r) => !deletedAssessmentIds.has(r.assessmentId));
    this.setItem(STORAGE_KEYS.REPORTS, remainingReports);

    this.addAuditLog(
      'delete',
      'athlete',
      athleteId,
      `Removed athlete profile ${athlete.fullName} (${athlete.athleteCode}) and associated records`
    );
  }

  // --- Assessments ---
  getAssessments(): Assessment[] {
    this.purgeInitialSeedData();
    const list = this.getItem<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, []);
    return list;
  }

  ensureAllAthletesHaveAssessments(zone?: SportZone): Assessment[] {
    const allAthletes = this.getAthletes();
    const athletes = zone ? allAthletes.filter((a) => getAthleteZone(a) === zone) : allAthletes;
    if (athletes.length === 0) return this.getAssessments();
    const currentAssessments = this.getAssessments();
    const existingAthleteIds = new Set(currentAssessments.map((a) => a.athleteId));

    let hasNew = false;
    const updated = [...currentAssessments];

    for (const ath of athletes) {
      if (!existingAthleteIds.has(ath.id)) {
        const generated = createDefaultAssessmentForAthlete(ath);
        updated.push(generated);
        existingAthleteIds.add(ath.id);
        hasNew = true;
      }
    }

    if (hasNew) {
      this.setItem(STORAGE_KEYS.ASSESSMENTS, updated);
      this.addAuditLog(
        'finalize',
        'assessment',
        'all-athletes-batch',
        `Completed standardized physical fitness test batteries for all remaining squad athletes`
      );
    }

    return updated;
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
    this.purgeInitialSeedData();
    return this.getItem<Competition[]>(STORAGE_KEYS.COMPETITIONS, []);
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
    this.purgeInitialSeedData();
    return this.getItem<PerformanceRecord[]>(STORAGE_KEYS.PERFORMANCES, []);
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
    const list = this.getItem(STORAGE_KEYS.NORM_DATASETS, SEED_NORM_DATASETS);
    const existingIds = new Set(list.map((d) => d.id));
    let hasAdditions = false;
    const merged = [...list];

    for (const seedNorm of SEED_NORM_DATASETS) {
      if (!existingIds.has(seedNorm.id)) {
        merged.push(seedNorm);
        existingIds.add(seedNorm.id);
        hasAdditions = true;
      }
    }

    if (hasAdditions && this.isBrowser()) {
      this.setItem(STORAGE_KEYS.NORM_DATASETS, merged);
    }
    return merged;
  }

  getNormDatasetForTest(testCode: string): NormDataset | undefined {
    return this.getNormDatasets().find((d) => d.testCode === testCode);
  }

  saveNormDataset(dataset: NormDataset): void {
    const list = this.getNormDatasets();
    const idx = list.findIndex((d) => d.id === dataset.id || d.testCode === dataset.testCode);
    if (idx >= 0) {
      list[idx] = dataset;
    } else {
      list.push(dataset);
    }
    this.setItem(STORAGE_KEYS.NORM_DATASETS, list);
    this.addAuditLog('create', 'settings', dataset.id, `Saved benchmark norm dataset for test ${dataset.testCode}`);
  }

  // --- Test Definitions & Batteries ---
  getTestDefinitions(): TestDefinition[] {
    const list = this.getItem(STORAGE_KEYS.TESTS, SEED_TEST_DEFINITIONS);
    const existingIds = new Set(list.map((t) => t.id));
    let hasAdditions = false;
    const merged = [...list];

    for (const seedTest of SEED_TEST_DEFINITIONS) {
      if (!existingIds.has(seedTest.id)) {
        merged.push(seedTest);
        existingIds.add(seedTest.id);
        hasAdditions = true;
      }
    }

    if (hasAdditions && this.isBrowser()) {
      this.setItem(STORAGE_KEYS.TESTS, merged);
    }
    return merged;
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

  deleteTestDefinition(testId: string): void {
    const list = this.getTestDefinitions();
    const test = list.find((t) => t.id === testId);
    if (!test) return;
    const remaining = list.filter((t) => t.id !== testId);
    this.setItem(STORAGE_KEYS.TESTS, remaining);

    // Cascade remove associated norm dataset
    const normList = this.getNormDatasets();
    const remainingNorms = normList.filter((d) => d.testCode !== test.code);
    this.setItem(STORAGE_KEYS.NORM_DATASETS, remainingNorms);

    this.addAuditLog('delete', 'settings', testId, `Deleted test definition ${test.name} (${test.code})`);
  }

  getTestingBatteries(): TestingBattery[] {
    const list = this.getItem(STORAGE_KEYS.BATTERIES, SEED_TESTING_BATTERIES);
    const existingIds = new Set(list.map((b) => b.id));
    let hasAdditions = false;
    const merged = [...list];

    for (const seedBattery of SEED_TESTING_BATTERIES) {
      if (!existingIds.has(seedBattery.id)) {
        merged.push(seedBattery);
        existingIds.add(seedBattery.id);
        hasAdditions = true;
      }
    }

    if (hasAdditions && this.isBrowser()) {
      this.setItem(STORAGE_KEYS.BATTERIES, merged);
    }
    return merged;
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
        userId: 'coach-rudra-roy',
        userEmail: 'rudra.roy@athletics.org',
        userName: 'Coach Rudra Roy',
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

  // Report Design Configuration
  getReportDesignConfig(): ReportDesignConfig {
    const saved = this.getItem<ReportDesignConfig>(STORAGE_KEYS.REPORT_DESIGN, DEFAULT_REPORT_DESIGN);
    return { ...DEFAULT_REPORT_DESIGN, ...saved };
  }

  saveReportDesignConfig(config: ReportDesignConfig): void {
    this.setItem(STORAGE_KEYS.REPORT_DESIGN, config);
  }

  // AI Training Plans
  getTrainingPlans(): AiTrainingPlan[] {
    return this.getItem<AiTrainingPlan[]>(STORAGE_KEYS.TRAINING_PLANS, []);
  }

  getTrainingPlansForAthlete(athleteId: string): AiTrainingPlan[] {
    return this.getTrainingPlans()
      .filter((p) => p.athleteId === athleteId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  saveTrainingPlan(plan: AiTrainingPlan): void {
    const list = this.getTrainingPlans();
    const idx = list.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      list[idx] = plan;
    } else {
      list.unshift(plan);
    }
    this.setItem(STORAGE_KEYS.TRAINING_PLANS, list);
    this.addAuditLog(
      'create',
      'training_plan',
      plan.id,
      `Generated AI Training Plan (${plan.focusGoal}) for ${plan.athleteName} via ${plan.modelUsed}`
    );
  }

  // --- Cloud Backup & Gmail Sync Engine ---
  getCoachEmail(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(STORAGE_KEYS.COACH_EMAIL) || this.getCurrentUser().email || '';
  }

  setCoachEmail(email: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.COACH_EMAIL, email.toLowerCase().trim());
    const user = this.getCurrentUser();
    user.email = email.toLowerCase().trim();
    this.setCurrentUser(user);
  }

  getLastCloudSyncTime(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  }

  setLastCloudSyncTime(time: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, time);
  }

  getBackupPayload(customEmail?: string): CloudBackupPayload {
    const email = customEmail || this.getCoachEmail() || 'coach@athletics.org';
    const athletes = this.getAthletes();
    const assessments = this.getAssessments();
    const competitions = this.getCompetitions();
    const performances = this.getPerformanceRecords();
    const trainingPlans = this.getTrainingPlans();
    const groups = this.getGroups();
    const scoringConfig = this.getScoringConfig();
    const reportDesign = this.getReportDesignConfig();
    const coachName =
      (this.isBrowser() ? localStorage.getItem('athletics_active_coach') : '') ||
      this.getCurrentUser().fullName ||
      'Lead Coach';

    return {
      email,
      coachName,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      athletes,
      assessments,
      competitions,
      performances,
      trainingPlans,
      groups,
      scoringConfig,
      reportDesign,
      stats: {
        athleteCount: athletes.length,
        assessmentCount: assessments.length,
        competitionCount: competitions.length,
        performanceCount: performances.length,
        groupCount: groups.length,
      },
    };
  }

  restoreFromBackupPayload(payload: CloudBackupPayload): boolean {
    if (!this.isBrowser() || !payload) return false;
    try {
      if (Array.isArray(payload.athletes)) {
        this.setItem(STORAGE_KEYS.ATHLETES, payload.athletes);
      }
      if (Array.isArray(payload.assessments)) {
        this.setItem(STORAGE_KEYS.ASSESSMENTS, payload.assessments);
      }
      if (Array.isArray(payload.competitions)) {
        this.setItem(STORAGE_KEYS.COMPETITIONS, payload.competitions);
      }
      if (Array.isArray(payload.performances)) {
        this.setItem(STORAGE_KEYS.PERFORMANCES, payload.performances);
      }
      if (Array.isArray(payload.trainingPlans)) {
        this.setItem(STORAGE_KEYS.TRAINING_PLANS, payload.trainingPlans);
      }
      if (Array.isArray(payload.groups)) {
        this.setItem(STORAGE_KEYS.GROUPS, payload.groups);
      }
      if (payload.scoringConfig) {
        this.setItem(STORAGE_KEYS.CONFIG, payload.scoringConfig);
      }
      if (payload.reportDesign) {
        this.setItem(STORAGE_KEYS.REPORT_DESIGN, payload.reportDesign);
      }
      if (payload.coachName) {
        localStorage.setItem('athletics_active_coach', payload.coachName);
        const user = this.getCurrentUser();
        user.fullName = payload.coachName;
        if (payload.email) user.email = payload.email;
        this.setCurrentUser(user);
      }
      if (payload.email) {
        this.setCoachEmail(payload.email);
      }
      this.setLastCloudSyncTime(payload.timestamp || new Date().toISOString());
      this.addAuditLog(
        'update',
        'users' as any,
        payload.email || 'cloud',
        `Restored complete cloud backup with ${payload.athletes?.length ?? 0} athletes and ${payload.assessments?.length ?? 0} assessments`
      );
      return true;
    } catch (e) {
      console.error('Error restoring cloud backup payload:', e);
      return false;
    }
  }

  async syncToCloud(customEmail?: string): Promise<{ success: boolean; message: string; provider?: string }> {
    const email = customEmail || this.getCoachEmail();
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Valid Gmail address is required to sync to cloud.' };
    }

    try {
      const payload = this.getBackupPayload(email);
      const res = await fetch('/api/cloud-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, payload }),
      });
      const data: CloudSyncResponse = await res.json();
      if (data.success) {
        this.setLastCloudSyncTime(data.timestamp || new Date().toISOString());
        return { success: true, message: data.message, provider: data.provider };
      }
      return { success: false, message: data.message || 'Sync failed.' };
    } catch (e: any) {
      console.error('Cloud sync exception:', e);
      return { success: false, message: e?.message || 'Network error during cloud sync.' };
    }
  }

  async fetchCloudBackup(
    email: string
  ): Promise<{ found: boolean; backup?: CloudBackupPayload; message?: string; provider?: string }> {
    if (!email || !email.includes('@')) {
      return { found: false, message: 'Please enter a valid Gmail address.' };
    }

    try {
      const res = await fetch(`/api/cloud-sync?email=${encodeURIComponent(email.toLowerCase().trim())}`, {
        cache: 'no-store',
      });
      const data: CloudSyncResponse = await res.json();
      if (data.success && data.found && data.backup) {
        return { found: true, backup: data.backup, provider: data.provider, message: data.message };
      }
      return { found: false, message: data.message || 'No backup found.' };
    } catch (e: any) {
      console.error('Cloud fetch exception:', e);
      return { found: false, message: e?.message || 'Network error looking up cloud backup.' };
    }
  }

  // Reset database back to clean empty state (0 dummy athletes)
  resetToSeed(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ATHLETES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PERFORMANCES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify([]));
    localStorage.removeItem('athletics_active_squad_athletes');
    localStorage.setItem('athletics_seed_data_purged_v3', 'true');
  }
}

export const db = new LocalStorageDB();
