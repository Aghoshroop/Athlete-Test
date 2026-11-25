'use client';

import React, { useState, useEffect } from 'react';
import { db, DEFAULT_CURRENT_USER } from '@/lib/storage/local-storage-db';
import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { Competition, PerformanceRecord } from '@/types/athletics';
import { UserProfile } from '@/types/user';
import { SportZone, getAthleteZone } from '@/types/zone';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar, ActiveTab } from '@/components/layout/sidebar';
import { KpiMetrics } from '@/components/dashboard/kpi-metrics';
import { FilterBar, DashboardFilterState } from '@/components/dashboard/filter-bar';
import { SquadDistributionChart } from '@/components/dashboard/squad-distribution-chart';
import { RecentActivityWidget } from '@/components/dashboard/recent-activity-widget';
import { AthleteCard } from '@/components/athletes/athlete-card';
import { AthleteProfileView } from '@/components/athletes/athlete-profile-view';
import { AthleteRegistrationModal } from '@/components/athletes/athlete-registration-modal';
import { AthleteDeleteModal } from '@/components/athletes/athlete-delete-modal';
import { BodyMeasurementsModal } from '@/components/athletes/body-measurements-modal';
import { CoachTestingEntry } from '@/components/fitness/coach-testing-entry';
import { SquadBatchTestingMatrix } from '@/components/fitness/squad-batch-testing-matrix';
import { CompetitionEntryModal } from '@/components/athletics/competition-entry-modal';
import { CombinedEventCard } from '@/components/athletics/combined-event-card';
import { EventsSpecificationCatalog } from '@/components/athletics/events-specification-catalog';
import { PerformanceTable } from '@/components/athletics/performance-table';
import { WACalculatorModal } from '@/components/athletics/wa-calculator-modal';
import { TestLibraryModal } from '@/components/fitness/test-library-modal';
import { ReportModal } from '@/components/reports/report-modal';
import { CombinedSquadReportModal } from '@/components/reports/combined-squad-report-modal';
import { ReportDesignModal } from '@/components/reports/report-design-modal';
import { ReportDesignConfig } from '@/types/report-design';
import { AuditSystemView } from '@/components/system/audit-system-view';
import { FitnessRadarChart } from '@/components/intelligence/fitness-radar-chart';
import { ProgressionChart } from '@/components/intelligence/progression-chart';
import { BilateralAsymmetryChart } from '@/components/intelligence/bilateral-asymmetry-chart';
import { InsightCards } from '@/components/intelligence/insight-cards';
import { DevelopmentIntelligenceView } from '@/components/intelligence/development-intelligence-view';
import { CinematicSplashModal } from '@/components/splash/cinematic-splash-modal';
import { CloudSyncModal } from '@/components/system/cloud-sync-modal';
import { ZoneSelectorPage } from '@/components/zones/zone-selector-page';

import {
  Users,
  Activity,
  Trophy,
  BookOpen,
  LineChart,
  FileText,
  Plus,
  ShieldAlert,
  Zap,
  Layers,
  Palette,
} from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [fitnessViewMode, setFitnessViewMode] = useState<'batch' | 'individual'>('batch');
  const [theme, setTheme] = useState<'bright' | 'dark'>('bright');
  
  // Data lists from local storage database
  const [athletes, setAthletes] = useState<AthleteProfile[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [performances, setPerformances] = useState<PerformanceRecord[]>([]);

  // Selected State
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(null);
  const [athleteToDelete, setAthleteToDelete] = useState<AthleteProfile | null>(null);
  const [reportModalAssessment, setReportModalAssessment] = useState<Assessment | null>(null);

  // Modal open states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isTestingModalOpen, setIsTestingModalOpen] = useState(false);
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
  const [isWACalcOpen, setIsWACalcOpen] = useState(false);
  const [isTestLibraryOpen, setIsTestLibraryOpen] = useState(false);
  const [isCombinedReportOpen, setIsCombinedReportOpen] = useState(false);
  const [combinedReportAthleteIds, setCombinedReportAthleteIds] = useState<string[] | null>(null);
  const [isReportDesignOpen, setIsReportDesignOpen] = useState(false);
  const [reportDesignConfig, setReportDesignConfig] = useState<ReportDesignConfig>(() =>
    db.getReportDesignConfig()
  );
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);

  // Cinematic Splash & Coach Roster Gate State
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [splashInitialPhase, setSplashInitialPhase] = useState<'typewriter' | 'prompt_coach'>('typewriter');
  const [activeCoachName, setActiveCoachName] = useState('');
  const [activeSquadAthleteIds, setActiveSquadAthleteIds] = useState<string[] | null>(null);
  const [organizationName, setOrganizationName] = useState('National Athletics High Performance Centre');

  // Zone Navigation Gate State ('track_and_field' | 'multi_sports' | null for post-login Zone Selector)
  const [activeZone, setActiveZone] = useState<SportZone | null>(null);

  // Filter state
  const [filters, setFilters] = useState<DashboardFilterState>({
    searchQuery: '',
    eventGroup: 'all',
    squad: 'all',
    status: 'all',
  });

  // Load database items & persisted theme on client mount
  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    setAthletes(db.getAthletes());
    setAssessments(db.getAssessments());
    setCompetitions(db.getCompetitions());
    setPerformances(db.getPerformanceRecords());

    const savedTheme = localStorage.getItem('athletics_theme');
    if (savedTheme === 'dark' || savedTheme === 'bright') {
      setTheme(savedTheme);
    }

    const savedCoach = localStorage.getItem('athletics_active_coach');
    const isOldHardcoded = savedCoach === 'Coach Rudra Roy' || savedCoach === 'Coach David Miller';
    if (savedCoach && savedCoach.trim() && !isOldHardcoded) {
      setActiveCoachName(savedCoach.trim());
      setCurrentUser((prev) => ({ ...prev, fullName: savedCoach.trim() }));
    } else {
      setActiveCoachName('');
      setIsSplashOpen(true);
    }

    const savedSquad = localStorage.getItem('athletics_active_squad_athletes');
    if (savedSquad) {
      try {
        const parsed = JSON.parse(savedSquad);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loadedAthletes = db.getAthletes();
          const existingIds = loadedAthletes.map((a) => a.id);
          const validIds = parsed.filter((id) => existingIds.includes(id));
          if (validIds.length > 0) {
            setActiveSquadAthleteIds(validIds);
          } else {
            setActiveSquadAthleteIds(null);
            localStorage.removeItem('athletics_active_squad_athletes');
          }
        }
      } catch (e) {}
    }

    const hasSeenSplash = localStorage.getItem('athletics_has_seen_splash');
    const savedZone = localStorage.getItem('wellperform_active_zone');
    if (!hasSeenSplash || !savedCoach || !savedCoach.trim() || isOldHardcoded) {
      setIsSplashOpen(true);
    } else if (savedZone === 'track_and_field' || savedZone === 'multi_sports') {
      setActiveZone(savedZone);
    }

    // Support PWA manifest shortcut deep-links (e.g. /?tab=fitness)
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    const validTabs: ActiveTab[] = [
      'dashboard',
      'athletes',
      'fitness',
      'competitions',
      'benchmarks',
      'intelligence',
      'reports',
      'system',
    ];
    if (tabParam && validTabs.includes(tabParam as ActiveTab)) {
      if (!(savedZone === 'multi_sports' && tabParam === 'competitions')) {
        setActiveTab(tabParam as ActiveTab);
      }
    }
  }, []);

  const handleCompleteSplash = (coach: string, athleteIds: string[], org: string, coachEmail?: string) => {
    setActiveCoachName(coach);
    setOrganizationName(org);
    setActiveSquadAthleteIds(athleteIds.length > 0 ? athleteIds : null);
    if (coachEmail) {
      db.setCoachEmail(coachEmail);
    }
    setCurrentUser((prev) => {
      const updated = { ...prev, fullName: coach, email: coachEmail || prev.email };
      db.setCurrentUser(updated);
      return updated;
    });

    localStorage.setItem('athletics_active_coach', coach);
    if (athleteIds.length > 0) {
      localStorage.setItem('athletics_active_squad_athletes', JSON.stringify(athleteIds));
    } else {
      localStorage.removeItem('athletics_active_squad_athletes');
    }
    localStorage.setItem('athletics_has_seen_splash', 'true');
    localStorage.removeItem('wellperform_active_zone');
    setActiveZone(null);
    setSelectedAthlete(null);
    setIsSplashOpen(false);
    setFilters({
      searchQuery: '',
      eventGroup: 'all',
      squad: 'all',
      status: 'all',
    });
    refreshData();
  };

  const handleToggleTheme = () => {
    const next = theme === 'bright' ? 'dark' : 'bright';
    setTheme(next);
    localStorage.setItem('athletics_theme', next);
  };

  const handleLogout = () => {
    db.syncToCloud().catch(() => {});
    localStorage.removeItem('athletics_active_coach');
    localStorage.removeItem('athletics_has_seen_splash');
    localStorage.removeItem('wellperform_active_zone');
    setActiveCoachName('');
    setActiveZone(null);
    setSelectedAthlete(null);
    setReportModalAssessment(null);
    setAthleteToDelete(null);
    setSplashInitialPhase('prompt_coach');
    setIsSplashOpen(true);
  };

  const handleSelectZone = (zone: SportZone) => {
    setActiveZone(zone);
    localStorage.setItem('wellperform_active_zone', zone);
    setSelectedAthlete(null);
    setReportModalAssessment(null);
    setAthleteToDelete(null);
    setFilters({
      searchQuery: '',
      eventGroup: 'all',
      squad: 'all',
      status: 'all',
    });
    if (zone === 'multi_sports' && activeTab === 'competitions') {
      setActiveTab('dashboard');
    }
  };

  const handleOpenZoneSelector = () => {
    setSelectedAthlete(null);
    setReportModalAssessment(null);
    setAthleteToDelete(null);
    setActiveZone(null);
    localStorage.removeItem('wellperform_active_zone');
  };

  const refreshData = () => {
    setAthletes(db.getAthletes());
    setAssessments(db.getAssessments());
    setCompetitions(db.getCompetitions());
    setPerformances(db.getPerformanceRecords());
  };

  // Athlete Management handlers
  const handleSaveAthlete = (newAthlete: AthleteProfile) => {
    db.saveAthlete(newAthlete);
    // If an active subset roster filter is already active, include the newly registered athlete;
    // otherwise keep null so all athletes registered in this zone remain visible.
    setActiveSquadAthleteIds((prev) => {
      if (!prev || prev.length === 0) return null;
      const next = Array.from(new Set([...prev, newAthlete.id]));
      localStorage.setItem('athletics_active_squad_athletes', JSON.stringify(next));
      return next;
    });
    // Reset search filter so newly registered athlete is not masked by prior search
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
    refreshData();
    db.syncToCloud().catch(() => {});
  };

  const handleDeleteAthlete = (athleteId: string) => {
    db.deleteAthlete(athleteId);
    setActiveSquadAthleteIds((prev) => {
      if (!prev) return null;
      const next = prev.filter((id) => id !== athleteId);
      localStorage.setItem('athletics_active_squad_athletes', JSON.stringify(next));
      return next;
    });
    refreshData();
    if (selectedAthlete?.id === athleteId) {
      setSelectedAthlete(null);
    }
    setAthleteToDelete(null);
    db.syncToCloud().catch(() => {});
  };

  const handleSaveMeasurement = (updatedAthlete: AthleteProfile) => {
    db.saveAthlete(updatedAthlete);
    refreshData();
    setSelectedAthlete(updatedAthlete);
    db.syncToCloud().catch(() => {});
  };

  const handleSaveAssessment = (assessment: Assessment) => {
    db.saveAssessment(assessment);
    refreshData();
    setIsTestingModalOpen(false);
    db.syncToCloud().catch(() => {});
  };

  const handleSaveBatchAssessments = (newAssessments: Assessment[]) => {
    refreshData();
    db.syncToCloud().catch(() => {});
  };

  const handleEnsureAllTests = () => {
    db.ensureAllAthletesHaveAssessments(resolvedZone);
    refreshData();
    db.syncToCloud().catch(() => {});
  };

  const handleSavePerformance = (perf: PerformanceRecord) => {
    db.savePerformanceRecord(perf);
    refreshData();
    db.syncToCloud().catch(() => {});
  };

  // Strict Zone Isolation: never merge Track & Field and Multi-Sports athletes/squads/assessments
  const resolvedZone: SportZone = activeZone ?? 'track_and_field';
  const trackAthletes = athletes.filter((a) => getAthleteZone(a) === 'track_and_field');
  const multiAthletes = athletes.filter((a) => getAthleteZone(a) === 'multi_sports');
  const zoneAthletes = resolvedZone === 'multi_sports' ? multiAthletes : trackAthletes;
  const zoneAthleteIds = new Set(zoneAthletes.map((a) => a.id));
  const zoneAssessments = assessments.filter((ass) => zoneAthleteIds.has(ass.athleteId));
  const zonePerformances =
    resolvedZone === 'track_and_field'
      ? performances.filter((p) => zoneAthleteIds.has(p.athleteId))
      : [];
  const zoneSquadGateIds = activeSquadAthleteIds
    ? activeSquadAthleteIds.filter((id) => zoneAthleteIds.has(id))
    : null;

  // Squad & sport options strictly scoped to active zone
  const squadOptions = Array.from(
    new Set([...db.getGroups(resolvedZone), ...zoneAthletes.map((a) => a.trainingSquad).filter(Boolean)])
  ).sort((a, b) => a.localeCompare(b));

  const sportOptions =
    resolvedZone === 'multi_sports'
      ? Array.from(new Set(zoneAthletes.map((a) => a.sportName || a.primaryEventName).filter(Boolean))).sort(
          (a, b) => a.localeCompare(b)
        )
      : [];

  // Filter athletes for dashboard views (respecting active zone + squad session filter)
  const filteredAthletes = zoneAthletes.filter((ath) => {
    const matchSquadGate =
      !zoneSquadGateIds || zoneSquadGateIds.length === 0 || zoneSquadGateIds.includes(ath.id);

    const matchSearch =
      ath.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.athleteCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.primaryEventName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (ath.sportName || '').toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchGroup =
      filters.eventGroup === 'all' ||
      (resolvedZone === 'multi_sports'
        ? (ath.sportName || ath.primaryEventName) === filters.eventGroup
        : ath.eventGroup === filters.eventGroup);
    const matchSquad = filters.squad === 'all' || ath.trainingSquad === filters.squad;
    const matchStatus = filters.status === 'all' || ath.status === filters.status;

    return matchSquadGate && matchSearch && matchGroup && matchSquad && matchStatus;
  });

  // Master roster of athletes for Athletes Management view (strictly within active zone)
  const managementAthletes = zoneAthletes.filter((ath) => {
    const matchSearch =
      ath.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.athleteCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.primaryEventName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (ath.sportName || '').toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchGroup =
      filters.eventGroup === 'all' ||
      (resolvedZone === 'multi_sports'
        ? (ath.sportName || ath.primaryEventName) === filters.eventGroup
        : ath.eventGroup === filters.eventGroup);
    const matchSquad = filters.squad === 'all' || ath.trainingSquad === filters.squad;
    const matchStatus = filters.status === 'all' || ath.status === filters.status;

    return matchSearch && matchGroup && matchSquad && matchStatus;
  });

  // Calculate KPIs scoped to the active zone
  const activeAthletesCount = zoneAthletes.filter((a) => a.status === 'active').length;
  const finalizedAssessmentsCount = zoneAssessments.filter((a) => a.status === 'finalized').length;
  const pendingAssessmentsCount = zoneAssessments.filter((a) => a.status === 'draft').length;
  const personalBestsCount = zonePerformances.filter((p) => p.isPersonalBest).length;
  const upcomingReassessmentsCount = zoneAthletes.filter((a) => a.status === 'rehabilitation').length;

  // Post-login Zone Selector Gate (shown right after Coach logs in until they pick a Zone)
  if (!isSplashOpen && activeZone === null && activeCoachName) {
    return (
      <>
        <ZoneSelectorPage
          coachName={currentUser.fullName || activeCoachName}
          coachEmail={currentUser.email}
          trackAthleteCount={trackAthletes.length}
          multiAthleteCount={multiAthletes.length}
          onSelectZone={handleSelectZone}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <CinematicSplashModal
          isOpen={isSplashOpen}
          onClose={() => setIsSplashOpen(false)}
          athletes={athletes}
          defaultCoachName=""
          defaultOrganization={organizationName}
          initialPhase={splashInitialPhase}
          onComplete={handleCompleteSplash}
          onAddNewAthlete={handleSaveAthlete}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'bright' ? 'bg-[#f6f7fb] text-slate-900' : 'bg-[#08080b] text-slate-100'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeZone={resolvedZone}
        trackCount={trackAthletes.length}
        multiCount={multiAthletes.length}
        onChangeZone={handleSelectZone}
        onOpenZoneSelector={handleOpenZoneSelector}
        onOpenTestingModal={() => setIsTestingModalOpen(true)}
        onOpenAthleteModal={() => setIsRegisterModalOpen(true)}
        onOpenCombinedReport={() => setIsCombinedReportOpen(true)}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-2.5 sm:px-6 pt-2 sm:pt-4 pb-6 sm:pb-8 gap-3 sm:gap-6 items-start min-w-0">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedAthlete(null);
          }}
          userRole={currentUser.role}
          activeZone={resolvedZone}
          onChangeZone={handleSelectZone}
          theme={theme}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-full min-w-0 overflow-x-clip space-y-4 sm:space-y-6">
          {/* Athlete Profile Detail View (If selected) */}
          {selectedAthlete ? (
            <AthleteProfileView
              athlete={selectedAthlete}
              assessments={zoneAssessments.filter((a) => a.athleteId === selectedAthlete.id)}
              performances={zonePerformances.filter((p) => p.athleteId === selectedAthlete.id)}
              onBack={() => setSelectedAthlete(null)}
              onNewAssessment={() => setIsTestingModalOpen(true)}
              onAddMeasurement={() => setIsMeasurementModalOpen(true)}
              onRecordPerformance={
                resolvedZone === 'track_and_field' ? () => setIsCompetitionModalOpen(true) : undefined
              }
              onDeleteAthlete={(ath) => setAthleteToDelete(ath)}
              onOpenReport={(ass) => setReportModalAssessment(ass)}
              onUpdateAthlete={(updated) => {
                setAthletes(db.getAthletes());
                setSelectedAthlete(updated);
              }}
              userRole={currentUser.role}
              theme={theme}
            />
          ) : (
            <>
              {/* TAB 1: COACHING DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Bar */}
                  <KpiMetrics
                    totalAthletes={zoneAthletes.length}
                    activeAthletes={activeAthletesCount}
                    registeredCoaches={3}
                    assessmentsCompleted={finalizedAssessmentsCount}
                    assessmentsPending={pendingAssessmentsCount}
                    recentPersonalBests={personalBestsCount}
                    upcomingReassessments={upcomingReassessmentsCount}
                    theme={theme}
                  />

                  {/* Filter Bar */}
                  <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    squadOptions={squadOptions}
                    activeZone={resolvedZone}
                    sportOptions={sportOptions}
                    theme={theme}
                  />

                  {/* Squad Distribution Chart */}
                  <SquadDistributionChart
                    athletes={filteredAthletes}
                    assessments={zoneAssessments}
                    theme={theme}
                  />

                  {/* Recent Activity: Assessments, PBs & Due Cycles */}
                  <RecentActivityWidget
                    recentAssessments={zoneAssessments}
                    recentPerformances={zonePerformances}
                    athletesRequiringReassessment={zoneAthletes.filter((a) => a.status === 'rehabilitation')}
                    onSelectAssessment={(ass) => setReportModalAssessment(ass)}
                    onSelectAthlete={(ath) => setSelectedAthlete(ath)}
                    activeZone={resolvedZone}
                    theme={theme}
                  />

                  {/* Active Coach Squad Indicator Banner */}
                  {zoneSquadGateIds && zoneSquadGateIds.length > 0 && zoneSquadGateIds.length < zoneAthletes.length && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-red-600/10 via-rose-500/10 to-amber-500/10 border border-rose-500/30 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            Active Coaching Roster: {currentUser.fullName || activeCoachName}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                            • Showing {filteredAthletes.length} of {zoneAthletes.length} athletes assigned to this zone
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsSplashOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500 transition shadow-xs"
                        >
                          Change Squad / Roster
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSquadAthleteIds(null);
                            localStorage.removeItem('athletics_active_squad_athletes');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                        >
                          Show All Athletes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Athletes Quick Directory */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <h3 className={`font-bold text-sm ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>
                        {resolvedZone === 'multi_sports' ? 'Multi-Sports Athletes Directory' : 'Track & Field Athletes Directory'} ({filteredAthletes.length})
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setIsCombinedReportOpen(true)}
                          className="text-xs font-black text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-3 py-1.5 rounded-lg shadow-md shadow-red-950/50 inline-flex items-center gap-1.5 transition"
                          title="View all athlete reports together in one unified dossier"
                        >
                          <Layers className="w-3.5 h-3.5" /> All Reports Together
                        </button>
                        {currentUser.role !== 'ATHLETE' && (
                          <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className={`text-xs font-bold inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition ${
                              theme === 'bright'
                                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5 text-rose-500" /> Add New Athlete
                          </button>
                        )}
                      </div>
                    </div>
                    {filteredAthletes.length === 0 ? (
                      <div className={`p-10 rounded-2xl border text-center space-y-3.5 ${
                        theme === 'bright'
                          ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 shadow-xl'
                      }`}>
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center mx-auto">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {zoneAthletes.length === 0
                              ? `0 Athletes in ${resolvedZone === 'multi_sports' ? 'Multi-Sports Zone' : 'Track & Field Zone'}`
                              : '0 Athletes Match Current Filter'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {zoneAthletes.length === 0
                              ? `This zone keeps its own isolated squad database. Register your first ${resolvedZone === 'multi_sports' ? 'multi-sport athlete' : 'track & field athlete'} under Coach ${currentUser.fullName || activeCoachName}.`
                              : `${zoneAthletes.length} athlete(s) registered in this zone. Click below to clear filters and view all zone athletes.`}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          {zoneAthletes.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSquadAthleteIds(null);
                                localStorage.removeItem('athletics_active_squad_athletes');
                                setFilters({
                                  searchQuery: '',
                                  eventGroup: 'all',
                                  squad: 'all',
                                  status: 'all',
                                });
                              }}
                              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              Show All {zoneAthletes.length} Zone Athletes
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-950/40 hover:from-red-500 hover:to-rose-500 transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{zoneAthletes.length === 0 ? 'Register First Athlete' : 'Add New Athlete'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredAthletes.map((ath) => (
                          <AthleteCard
                            key={ath.id}
                            athlete={ath}
                            onSelect={setSelectedAthlete}
                            onNewAssessment={() => {
                              setSelectedAthlete(ath);
                              setIsTestingModalOpen(true);
                            }}
                            onRecordPerformance={
                              resolvedZone === 'track_and_field'
                                ? () => {
                                    setSelectedAthlete(ath);
                                    setIsCompetitionModalOpen(true);
                                  }
                                : undefined
                            }
                            onDelete={(ath) => setAthleteToDelete(ath)}
                            userRole={currentUser.role}
                            theme={theme}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ATHLETES MANAGEMENT */}
              {activeTab === 'athletes' && (
                <div className="space-y-6">
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    theme === 'bright' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <h2 className={`text-xl font-black ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>
                        {resolvedZone === 'multi_sports' ? 'Multi-Sports Athletes Management' : 'Athletes Management'}
                      </h2>
                      <p className={`text-xs ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {resolvedZone === 'multi_sports'
                          ? 'Isolated multi-sport athlete roster, sport-specific roles & conditioning profiles'
                          : 'High performance registry, historical anthropometry and multi-event profiles'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsCombinedReportOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50 transition"
                      >
                        <Layers className="w-4 h-4 text-white" /> All Reports Together
                      </button>
                      {currentUser.role !== 'ATHLETE' && (
                        <button
                          onClick={() => setIsRegisterModalOpen(true)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border shadow-xs transition ${
                            theme === 'bright'
                              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                              : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                          }`}
                        >
                          <Plus className="w-4 h-4 text-rose-500" /> Register New Athlete
                        </button>
                      )}
                    </div>
                  </div>

                  <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    squadOptions={squadOptions}
                    activeZone={resolvedZone}
                    sportOptions={sportOptions}
                    theme={theme}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Showing {managementAthletes.length} of {zoneAthletes.length} registered {resolvedZone === 'multi_sports' ? 'multi-sports' : 'track & field'} athletes
                    </span>
                    {(filters.searchQuery || filters.eventGroup !== 'all' || filters.squad !== 'all' || filters.status !== 'all') && (
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({
                            searchQuery: '',
                            eventGroup: 'all',
                            squad: 'all',
                            status: 'all',
                          })
                        }
                        className="text-rose-500 hover:underline font-mono text-[11px]"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>

                  {managementAthletes.length === 0 ? (
                    <div className={`p-12 rounded-2xl border text-center space-y-3.5 ${
                      theme === 'bright'
                        ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 shadow-xl'
                    }`}>
                      <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {zoneAthletes.length === 0
                            ? `No ${resolvedZone === 'multi_sports' ? 'Multi-Sports' : 'Track & Field'} Athletes Registered`
                            : 'No Athletes Match Current Filter'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                          {zoneAthletes.length === 0
                            ? `Ready for your ${resolvedZone === 'multi_sports' ? 'multi-sports squad' : 'track & field training squad'}. Register your first athlete to begin isolated diagnostics.`
                            : 'Try adjusting your search query, discipline/sport filter, or squad filters.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-1">
                        {zoneAthletes.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFilters({
                                searchQuery: '',
                                eventGroup: 'all',
                                squad: 'all',
                                status: 'all',
                              })
                            }
                            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            Clear Filters
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsRegisterModalOpen(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-950/40 hover:from-red-500 hover:to-rose-500 transition"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Register New Athlete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {managementAthletes.map((ath) => (
                        <AthleteCard
                          key={ath.id}
                          athlete={ath}
                          onSelect={setSelectedAthlete}
                          onNewAssessment={() => {
                            setSelectedAthlete(ath);
                            setIsTestingModalOpen(true);
                          }}
                          onRecordPerformance={
                            resolvedZone === 'track_and_field'
                              ? () => {
                                  setSelectedAthlete(ath);
                                  setIsCompetitionModalOpen(true);
                                }
                              : undefined
                          }
                          onDelete={(ath) => setAthleteToDelete(ath)}
                          userRole={currentUser.role}
                          theme={theme}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FITNESS ASSESSMENTS ENGINE */}
              {activeTab === 'fitness' && (
                <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden">
                  {currentUser.role === 'ATHLETE' ? (
                    <div className={`p-6 rounded-xl border text-center ${
                      theme === 'bright'
                        ? 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
                        : 'bg-[#0e0e13] border-slate-800 text-white'
                    }`}>
                      <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                      <h3 className={`font-bold text-base ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>Athlete Read-Only Access Mode</h3>
                      <p className={`text-xs mt-1 max-w-md mx-auto ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                        In accordance with Phase 1 User Roles, official fitness assessment data entry is restricted to authorized coaches and administrators.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Coach Mode Switcher Bar */}
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-colors w-full max-w-full min-w-0 overflow-hidden ${
                        theme === 'bright'
                          ? 'bg-white border-slate-200/90 shadow-sm text-slate-900'
                          : 'bg-[#0e0e13] border-slate-800 shadow-xl text-white'
                      }`}>
                        <div className="min-w-0">
                          <h3 className={`font-bold text-sm flex items-center gap-2 ${
                            theme === 'bright' ? 'text-slate-900' : 'text-white'
                          }`}>
                            <Activity className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>
                              {resolvedZone === 'multi_sports'
                                ? 'Multi-Sports Testing Suite'
                                : 'Track & Field Fitness Assessment Suite'}
                            </span>
                          </h3>
                          <p className={`text-xs mt-0.5 truncate ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {fitnessViewMode === 'batch'
                              ? 'Squad Batch Testing Mode: Multi-athlete trial matrix'
                              : 'Individual Athlete Mode: Single-athlete diagnostics'}
                          </p>
                        </div>

                        <div className={`flex items-center gap-1.5 p-1 rounded-xl border w-full sm:w-auto shrink-0 ${
                          theme === 'bright'
                            ? 'bg-slate-100 border-slate-200'
                            : 'bg-slate-950 border-slate-800'
                        }`}>
                          <button
                            type="button"
                            onClick={() => setFitnessViewMode('batch')}
                            className={`flex-1 sm:flex-initial py-2 px-3 text-xs font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                              fitnessViewMode === 'batch'
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                                : theme === 'bright'
                                ? 'text-slate-700 hover:text-slate-900 hover:bg-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span>Squad Batch</span>
                            <span className="text-[10px] font-mono opacity-80">({zoneAthletes.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFitnessViewMode('individual')}
                            className={`flex-1 sm:flex-initial py-2 px-3 text-xs font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                              fitnessViewMode === 'individual'
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                                : theme === 'bright'
                                ? 'text-slate-700 hover:text-slate-900 hover:bg-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <Activity className="w-3.5 h-3.5 shrink-0" />
                            <span>Individual</span>
                          </button>
                        </div>
                      </div>

                      {/* Active Mode Render */}
                      {zoneAthletes.length === 0 ? (
                        <div className={`p-12 rounded-2xl border text-center space-y-3.5 ${
                          theme === 'bright'
                            ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 shadow-xl'
                        }`}>
                          <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center mx-auto">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              No {resolvedZone === 'multi_sports' ? 'Multi-Sports' : 'Track & Field'} Athletes Registered for Testing
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                              Register athletes inside this zone first to conduct batch matrix or individual diagnostic testing batteries.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-950/40 hover:from-red-500 hover:to-rose-500 transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Register Athlete to Begin Testing</span>
                          </button>
                        </div>
                      ) : fitnessViewMode === 'batch' ? (
                        <SquadBatchTestingMatrix
                          key={`batch-${resolvedZone}`}
                          athletes={zoneAthletes}
                          coachName={currentUser.fullName || activeCoachName}
                          onSaveBatchAssessments={handleSaveBatchAssessments}
                          onSwitchToIndividual={(athleteId) => {
                            if (athleteId) {
                              const a = zoneAthletes.find((ath) => ath.id === athleteId);
                              if (a) setSelectedAthlete(a);
                            }
                            setFitnessViewMode('individual');
                          }}
                        />
                      ) : (
                        <CoachTestingEntry
                          key={`entry-${resolvedZone}`}
                          athletes={zoneAthletes}
                          coachName={currentUser.fullName || activeCoachName}
                          onSaveAssessment={handleSaveAssessment}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: ATHLETICS COMPETITIONS & WA POINTS (Track & Field Only) */}
              {activeTab === 'competitions' && resolvedZone === 'track_and_field' && (
                <div className="space-y-6">
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    theme === 'bright' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <h2 className={`text-xl font-black flex items-center gap-2 ${
                        theme === 'bright' ? 'text-slate-900' : 'text-white'
                      }`}>
                        <Trophy className="w-6 h-6 text-rose-500" />
                        Athletics Performance Engine
                      </h2>
                      <p className={`text-xs ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                        World Athletics Official Scoring Tables • Track FAT Splits & Field Event Attempts
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsWACalcOpen(true)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          theme === 'bright'
                            ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-xs'
                            : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                        }`}
                      >
                        Open WA Calculator
                      </button>
                      {currentUser.role !== 'ATHLETE' && (
                        <button
                          onClick={() => setIsCompetitionModalOpen(true)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50"
                        >
                          + Record Competition Result
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Combined Events Score Card (Decathlon / Heptathlon) */}
                  <CombinedEventCard />

                  {/* World Athletics Events & Technical Parameters Catalog (Men & Women) */}
                  <EventsSpecificationCatalog theme={theme} />

                  {/* Competition Records Table */}
                  <div className="space-y-3">
                    <h3 className={`font-bold text-sm ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>
                      Official Competition Performances ({zonePerformances.length})
                    </h3>
                    <PerformanceTable performances={zonePerformances} />
                  </div>
                </div>
              )}

              {/* TAB 5: SCIENTIFIC NORMS & TEST LIBRARY */}
              {activeTab === 'benchmarks' && (
                <div className="space-y-6">
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    theme === 'bright' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <h2 className={`text-xl font-black flex items-center gap-2 ${
                        theme === 'bright' ? 'text-slate-900' : 'text-white'
                      }`}>
                        <BookOpen className="w-6 h-6 text-rose-500" />
                        Published Scientific Benchmark Norms
                      </h2>
                      <p className={`text-xs ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Peer-reviewed normative datasets with verified DOIs (Phase 4 Specification)
                      </p>
                    </div>
                    <button
                      onClick={() => setIsTestLibraryOpen(true)}
                      className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50 transition"
                    >
                      Browse Complete Test Catalog
                    </button>
                  </div>

                  <div className={`p-6 rounded-xl border space-y-4 ${
                    theme === 'bright'
                      ? 'bg-white border-slate-200/90 shadow-sm text-slate-900'
                      : 'bg-[#0e0e13] border-slate-800 text-white'
                  }`}>
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                      <Zap className="w-4 h-4 text-rose-600" />
                      Scientific Reference Engine Standards
                    </div>
                    <p className={`text-xs leading-relaxed ${theme === 'bright' ? 'text-slate-600' : 'text-slate-300'}`}>
                      WellPerform strictly prohibits invented benchmark values or fictitious percentile scores. All active physical fitness tests correlate with recognized, published studies including the Council of Europe Eurofit Battery, McMahon et al. (2018), Haugen et al. (2012) elite sprint curves, and Tomkinson et al. (2017 BJSM, N = 1.14M).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className={`p-4 rounded-lg border text-xs space-y-1 ${
                        theme === 'bright' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <div className={`font-bold ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>Eurofit Normative Standard</div>
                        <div className={theme === 'bright' ? 'text-slate-600' : 'text-slate-400'}>Council of Europe Committee for Sports Development (N &gt; 22,000)</div>
                        <div className={`${theme === 'bright' ? 'text-slate-500' : 'text-slate-500'} text-[11px]`}>Covers Standing Long Jump, Sit-and-Reach, Plate Tapping</div>
                      </div>
                      <div className={`p-4 rounded-lg border text-xs space-y-1 ${
                        theme === 'bright' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <div className={`font-bold ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>Tomkinson et al. 20m Shuttle Run (BJSM 2017)</div>
                        <div className={theme === 'bright' ? 'text-slate-600' : 'text-slate-400'}>DOI: 10.1136/bjsports-2016-095987 (N = 1,142,026 across 50 countries)</div>
                        <div className={`${theme === 'bright' ? 'text-slate-500' : 'text-slate-500'} text-[11px]`}>Continuous LMS growth curves for aerobic capacity</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DEVELOPMENT INTELLIGENCE */}
              {activeTab === 'intelligence' && (
                <DevelopmentIntelligenceView
                  key={`intel-${resolvedZone}`}
                  theme={theme}
                  athletes={zoneAthletes}
                  assessments={zoneAssessments}
                  competitions={resolvedZone === 'track_and_field' ? competitions : []}
                  performances={zonePerformances}
                  coachName={currentUser.fullName || activeCoachName}
                  onSelectAthlete={(ath) => {
                    setSelectedAthlete(ath);
                    setActiveTab('athletes');
                  }}
                  onOpenReport={(ass) => {
                    setReportModalAssessment(ass);
                  }}
                />
              )}

              {/* TAB 7: A4 REPORT GENERATOR */}
              {activeTab === 'reports' && (
                <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    theme === 'bright' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <h2 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${
                        theme === 'bright' ? 'text-slate-900' : 'text-white'
                      }`}>
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                        <span>A4 PDF Report Generator</span>
                      </h2>
                      <p className={`text-xs ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Editorial 2-page print & PDF dossiers with frozen calculation versioning ({resolvedZone === 'multi_sports' ? 'Multi-Sports Zone' : 'Track & Field Zone'})
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsReportDesignOpen(true)}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                          theme === 'bright'
                            ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-xs'
                            : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                        }`}
                        title="Customize report papers: brand colors, typography, and Page 2 metric graphing (Open in Desktop to customize)"
                      >
                        <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                        <span>Design Theme</span>
                        <span className="sm:hidden text-[9px] font-mono text-rose-400 bg-red-950/40 px-1 py-0.2 rounded border border-red-500/30">
                          Desktop
                        </span>
                      </button>
                      <button
                        onClick={() => setIsCombinedReportOpen(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-black rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/50 transition transform active:scale-95"
                      >
                        <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        <span>All Reports ({zoneAthletes.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Callout Banner for Instant Squad Dossier */}
                  <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm w-full max-w-full overflow-hidden ${
                    theme === 'bright'
                      ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-red-200 text-slate-900'
                      : 'bg-gradient-to-r from-[#0e0e13] via-[#14141c] to-[#0e0e13] text-white border-red-500/30 shadow-xl'
                  }`}>
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-sm sm:text-base shadow-md shadow-red-950/40 shrink-0">
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-extrabold text-xs sm:text-sm flex flex-wrap items-center gap-1.5 ${
                          theme === 'bright' ? 'text-slate-900' : 'text-white'
                        }`}>
                          <span>Consolidated Squad Performance Dossier</span>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-rose-600 text-white">
                            1-Click
                          </span>
                        </h4>
                        <p className={`text-[11px] sm:text-xs mt-0.5 ${theme === 'bright' ? 'text-slate-600' : 'text-slate-300'}`}>
                          Instantly view and print unified dossiers, leaderboards, and individual A4 reports for athletes in this zone.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCombinedReportOpen(true)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg shadow-md shadow-red-950/50 transition shrink-0 whitespace-nowrap text-center"
                    >
                      ⚡ Open All Reports
                    </button>
                  </div>

                  {zoneAssessments.length === 0 ? (
                    <div className={`p-12 rounded-2xl border text-center space-y-3.5 ${
                      theme === 'bright'
                        ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 shadow-xl'
                    }`}>
                      <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          No Assessment Reports Generated in This Zone Yet
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                          Conduct fitness tests inside the {resolvedZone === 'multi_sports' ? 'Multi-Sports Zone' : 'Track & Field Zone'} to produce official two-page printable A4 dossiers and PDF exports.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {zoneAssessments.map((ass) => {
                        return (
                          <div
                            key={ass.id}
                            className={`p-5 rounded-xl border flex flex-col justify-between ${
                              theme === 'bright'
                                ? 'bg-white border-slate-200/90 shadow-sm text-slate-900'
                                : 'bg-[#0e0e13] border-slate-800 shadow-xl text-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                                  theme === 'bright'
                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                    : 'bg-slate-900 text-slate-300 border-slate-800'
                                }`}>
                                  {ass.athleteCode}
                                </span>
                                <span className="text-xs font-bold text-rose-500">
                                  Score: {ass.overallFitnessScore?.toFixed(1) ?? '—'}
                                </span>
                              </div>
                              <h3 className={`font-bold text-base ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>{ass.athleteName}</h3>
                              <p className={`text-xs mt-1 ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                                Testing Date: {ass.assessmentDate} • Battery: {ass.batteryName}
                              </p>
                            </div>

                            <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                              theme === 'bright' ? 'border-slate-100' : 'border-slate-800'
                            }`}>
                              <span className={`text-xs ${theme === 'bright' ? 'text-slate-500' : 'text-slate-400'}`}>
                                Coach: {ass.coachName}
                              </span>
                              <button
                                onClick={() => setReportModalAssessment(ass)}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition ${
                                  theme === 'bright'
                                    ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                                    : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                                }`}
                              >
                                Generate A4 Dossier
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: SYSTEM & AUDIT LOGS */}
              {activeTab === 'system' && <AuditSystemView />}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Athlete Registration Modal */}
      <AthleteRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleSaveAthlete}
        existingAthletesCount={zoneAthletes.length}
        defaultCoachName={currentUser.fullName || activeCoachName}
        activeZone={resolvedZone}
      />

      {/* 2. Body Measurements Modal */}
      {selectedAthlete && (
        <BodyMeasurementsModal
          isOpen={isMeasurementModalOpen}
          onClose={() => setIsMeasurementModalOpen(false)}
          athlete={selectedAthlete}
          onSaveMeasurement={handleSaveMeasurement}
        />
      )}

      {/* 3. Fast Testing Entry Modal */}
      {isTestingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-1 sm:p-4 overflow-y-auto w-full max-w-full">
          <div className="max-w-4xl w-full h-[94vh] sm:h-[90vh] max-h-[920px] flex flex-col my-auto shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden min-w-0">
            <CoachTestingEntry
              key={`modal-entry-${resolvedZone}`}
              athletes={zoneAthletes}
              initialAthleteId={selectedAthlete?.id}
              coachName={currentUser.fullName || activeCoachName}
              onSaveAssessment={(ass) => {
                handleSaveAssessment(ass);
                setIsTestingModalOpen(false);
              }}
              onClose={() => setIsTestingModalOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* 4. Competition Entry Modal (Track & Field Only) */}
      <CompetitionEntryModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
        athletes={trackAthletes}
        competitions={competitions}
        initialAthleteId={selectedAthlete?.id}
        onSavePerformance={handleSavePerformance}
      />

      {/* 5. World Athletics Calculator Modal */}
      <WACalculatorModal
        isOpen={isWACalcOpen}
        onClose={() => setIsWACalcOpen(false)}
      />

      {/* 6. Test Library Modal */}
      <TestLibraryModal
        isOpen={isTestLibraryOpen}
        onClose={() => setIsTestLibraryOpen(false)}
        userRole={currentUser.role}
      />

      {/* 7. Two-Page A4 PDF / Print Report Modal */}
      {reportModalAssessment && (
        <ReportModal
          isOpen={!!reportModalAssessment}
          onClose={() => setReportModalAssessment(null)}
          assessment={reportModalAssessment}
          previousAssessment={zoneAssessments.find(
            (a) => a.athleteId === reportModalAssessment.athleteId && a.id !== reportModalAssessment.id
          )}
          athlete={zoneAthletes.find((a) => a.id === reportModalAssessment.athleteId)}
          performances={zonePerformances.filter((p) => p.athleteId === reportModalAssessment.athleteId)}
        />
      )}

      {/* 8. Athlete Removal Confirmation Modal */}
      {athleteToDelete && (
        <AthleteDeleteModal
          isOpen={!!athleteToDelete}
          onClose={() => setAthleteToDelete(null)}
          onConfirm={handleDeleteAthlete}
          athlete={athleteToDelete}
          assessmentCount={
            assessments.filter((a) => a.athleteId === athleteToDelete.id).length
          }
          performanceCount={
            performances.filter((p) => p.athleteId === athleteToDelete.id).length
          }
        />
      )}

      {/* 9. Consolidated Squad Reports Modal (Scoped to Active Zone) */}
      <CombinedSquadReportModal
        isOpen={isCombinedReportOpen}
        onClose={() => {
          setIsCombinedReportOpen(false);
          setCombinedReportAthleteIds(null);
        }}
        athletes={
          combinedReportAthleteIds
            ? zoneAthletes.filter((a) => combinedReportAthleteIds.includes(a.id))
            : zoneAthletes
        }
        assessments={zoneAssessments}
        coachName={currentUser.fullName || activeCoachName}
        onEnsureAllTests={handleEnsureAllTests}
      />

      {/* 10. Report Paper Design Customizer Modal */}
      <ReportDesignModal
        isOpen={isReportDesignOpen}
        onClose={() => setIsReportDesignOpen(false)}
        config={reportDesignConfig}
        onChange={(cfg) => {
          setReportDesignConfig(cfg);
          db.saveReportDesignConfig(cfg);
        }}
        sampleAssessment={zoneAssessments[0]}
        sampleAthlete={zoneAthletes[0]}
      />

      {/* 11. Cinematic Entry Splash & Coach Squad Gate Modal */}
      <CinematicSplashModal
        isOpen={isSplashOpen}
        onClose={() => setIsSplashOpen(false)}
        athletes={athletes}
        defaultCoachName=""
        defaultOrganization={organizationName}
        initialPhase={splashInitialPhase}
        onComplete={handleCompleteSplash}
        onAddNewAthlete={handleSaveAthlete}
      />

      {/* 12. Cross-Device Cloud Sync & Gmail Backup Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onDataRestored={refreshData}
        currentEmail={currentUser.email}
      />
    </div>
  );
}
