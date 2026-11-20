'use client';

import React, { useState, useEffect } from 'react';
import { db, DEFAULT_CURRENT_USER } from '@/lib/storage/local-storage-db';
import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { Competition, PerformanceRecord } from '@/types/athletics';
import { UserProfile } from '@/types/user';

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
import { PerformanceTable } from '@/components/athletics/performance-table';
import { WACalculatorModal } from '@/components/athletics/wa-calculator-modal';
import { TestLibraryModal } from '@/components/fitness/test-library-modal';
import { ReportModal } from '@/components/reports/report-modal';
import { CombinedSquadReportModal } from '@/components/reports/combined-squad-report-modal';
import { AuditSystemView } from '@/components/system/audit-system-view';
import { FitnessRadarChart } from '@/components/intelligence/fitness-radar-chart';
import { ProgressionChart } from '@/components/intelligence/progression-chart';
import { BilateralAsymmetryChart } from '@/components/intelligence/bilateral-asymmetry-chart';
import { InsightCards } from '@/components/intelligence/insight-cards';

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
} from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [fitnessViewMode, setFitnessViewMode] = useState<'batch' | 'individual'>('batch');
  
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

  // Filter state
  const [filters, setFilters] = useState<DashboardFilterState>({
    searchQuery: '',
    eventGroup: 'all',
    squad: 'all',
    status: 'all',
  });

  // Load database items on client mount
  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    setAthletes(db.getAthletes());
    setAssessments(db.getAssessments());
    setCompetitions(db.getCompetitions());
    setPerformances(db.getPerformanceRecords());
  }, []);

  const refreshData = () => {
    setAthletes(db.getAthletes());
    setAssessments(db.getAssessments());
    setCompetitions(db.getCompetitions());
    setPerformances(db.getPerformanceRecords());
  };

  // Athlete Management handlers
  const handleSaveAthlete = (newAthlete: AthleteProfile) => {
    db.saveAthlete(newAthlete);
    refreshData();
  };

  const handleDeleteAthlete = (athleteId: string) => {
    db.deleteAthlete(athleteId);
    refreshData();
    if (selectedAthlete?.id === athleteId) {
      setSelectedAthlete(null);
    }
    setAthleteToDelete(null);
  };

  const handleSaveMeasurement = (updatedAthlete: AthleteProfile) => {
    db.saveAthlete(updatedAthlete);
    refreshData();
    setSelectedAthlete(updatedAthlete);
  };

  const handleSaveAssessment = (assessment: Assessment) => {
    db.saveAssessment(assessment);
    refreshData();
    setIsTestingModalOpen(false);
  };

  const handleSaveBatchAssessments = (newAssessments: Assessment[]) => {
    refreshData();
  };

  const handleEnsureAllTests = () => {
    db.ensureAllAthletesHaveAssessments();
    refreshData();
  };

  const handleSavePerformance = (perf: PerformanceRecord) => {
    db.savePerformanceRecord(perf);
    refreshData();
  };

  // Squad options for filter
  const squadOptions = Array.from(new Set(athletes.map((a) => a.trainingSquad).filter(Boolean)));

  // Filter athletes
  const filteredAthletes = athletes.filter((ath) => {
    const matchSearch =
      ath.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.athleteCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ath.primaryEventName.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchGroup = filters.eventGroup === 'all' || ath.eventGroup === filters.eventGroup;
    const matchSquad = filters.squad === 'all' || ath.trainingSquad === filters.squad;
    const matchStatus = filters.status === 'all' || ath.status === filters.status;

    return matchSearch && matchGroup && matchSquad && matchStatus;
  });

  // Calculate KPIs
  const activeAthletesCount = athletes.filter((a) => a.status === 'active').length;
  const finalizedAssessmentsCount = assessments.filter((a) => a.status === 'finalized').length;
  const pendingAssessmentsCount = assessments.filter((a) => a.status === 'draft').length;
  const personalBestsCount = performances.filter((p) => p.isPersonalBest).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onOpenTestingModal={() => setIsTestingModalOpen(true)}
        onOpenAthleteModal={() => setIsRegisterModalOpen(true)}
        onOpenWACalculator={() => setIsWACalcOpen(true)}
        onOpenCombinedReport={() => setIsCombinedReportOpen(true)}
        onOpenBatchMatrix={() => {
          setActiveTab('fitness');
          setFitnessViewMode('batch');
          setSelectedAthlete(null);
        }}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedAthlete(null);
          }}
          userRole={currentUser.role}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Athlete Profile Detail View (If selected) */}
          {selectedAthlete ? (
            <AthleteProfileView
              athlete={selectedAthlete}
              assessments={assessments.filter((a) => a.athleteId === selectedAthlete.id)}
              performances={performances.filter((p) => p.athleteId === selectedAthlete.id)}
              onBack={() => setSelectedAthlete(null)}
              onNewAssessment={() => setIsTestingModalOpen(true)}
              onAddMeasurement={() => setIsMeasurementModalOpen(true)}
              onRecordPerformance={() => setIsCompetitionModalOpen(true)}
              onDeleteAthlete={(ath) => setAthleteToDelete(ath)}
              onOpenReport={(ass) => setReportModalAssessment(ass)}
              userRole={currentUser.role}
            />
          ) : (
            <>
              {/* TAB 1: COACHING DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Bar */}
                  <KpiMetrics
                    totalAthletes={athletes.length}
                    activeAthletes={activeAthletesCount}
                    registeredCoaches={3}
                    assessmentsCompleted={finalizedAssessmentsCount}
                    assessmentsPending={pendingAssessmentsCount}
                    recentPersonalBests={personalBestsCount}
                    upcomingReassessments={2}
                  />

                  {/* Filter Bar */}
                  <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    squadOptions={squadOptions}
                  />

                  {/* Squad Distribution Chart */}
                  <SquadDistributionChart
                    athletes={filteredAthletes}
                    assessments={assessments}
                  />

                  {/* Recent Activity: Assessments, PBs & Due Cycles */}
                  <RecentActivityWidget
                    recentAssessments={assessments}
                    recentPerformances={performances}
                    athletesRequiringReassessment={athletes.filter((a) => a.status === 'rehabilitation' || a.id === 'ath-sophia-chen')}
                    onSelectAssessment={(ass) => setReportModalAssessment(ass)}
                    onSelectAthlete={(ath) => setSelectedAthlete(ath)}
                  />

                  {/* Athletes Quick Directory */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">
                        Athletes Directory ({filteredAthletes.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsCombinedReportOpen(true)}
                          className="text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg shadow-xs inline-flex items-center gap-1.5 transition"
                          title="View all athlete reports together in one unified dossier"
                        >
                          <Layers className="w-3.5 h-3.5" /> All Reports Together
                        </button>
                        {currentUser.role !== 'ATHLETE' && (
                          <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Athlete
                          </button>
                        )}
                      </div>
                    </div>
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
                          onRecordPerformance={() => {
                            setSelectedAthlete(ath);
                            setIsCompetitionModalOpen(true);
                          }}
                          onDelete={(ath) => setAthleteToDelete(ath)}
                          userRole={currentUser.role}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ATHLETES MANAGEMENT */}
              {activeTab === 'athletes' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Athletes Management</h2>
                      <p className="text-xs text-slate-500">
                        High performance registry, historical anthropometry and multi-event profiles
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsCombinedReportOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs transition"
                      >
                        <Layers className="w-4 h-4 text-slate-950" /> All Reports Together
                      </button>
                      {currentUser.role !== 'ATHLETE' && (
                        <button
                          onClick={() => setIsRegisterModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition"
                        >
                          <Plus className="w-4 h-4" /> Register New Athlete
                        </button>
                      )}
                    </div>
                  </div>

                  <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    squadOptions={squadOptions}
                  />

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
                        onRecordPerformance={() => {
                          setSelectedAthlete(ath);
                          setIsCompetitionModalOpen(true);
                        }}
                        onDelete={(ath) => setAthleteToDelete(ath)}
                        userRole={currentUser.role}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FITNESS ASSESSMENTS ENGINE */}
              {activeTab === 'fitness' && (
                <div className="space-y-6">
                  {currentUser.role === 'ATHLETE' ? (
                    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
                      <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                      <h3 className="font-bold text-base text-slate-900">Athlete Read-Only Access Mode</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        In accordance with Phase 1 User Roles, official fitness assessment data entry is restricted to authorized coaches and administrators.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Coach Mode Switcher Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-500" />
                            Fitness Assessment Suite
                          </h3>
                          <p className="text-xs text-slate-500">
                            {fitnessViewMode === 'batch'
                              ? 'Squad Batch Testing Mode: Select events once, enter trial scores for all athletes simultaneously, and view combined report.'
                              : 'Individual Athlete Mode: Single-athlete comprehensive testing battery with multi-attempt, trial, and bilateral tracking.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                          <button
                            type="button"
                            onClick={() => setFitnessViewMode('batch')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition ${
                              fitnessViewMode === 'batch'
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5" />
                            Squad Batch Matrix ({athletes.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFitnessViewMode('individual')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition ${
                              fitnessViewMode === 'individual'
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Activity className="w-3.5 h-3.5" />
                            Individual Athlete
                          </button>
                        </div>
                      </div>

                      {/* Active Mode Render */}
                      {fitnessViewMode === 'batch' ? (
                        <SquadBatchTestingMatrix
                          athletes={athletes}
                          onSaveBatchAssessments={handleSaveBatchAssessments}
                          onOpenCombinedReport={() => setIsCombinedReportOpen(true)}
                          onSwitchToIndividual={(athleteId) => {
                            if (athleteId) {
                              const a = athletes.find((ath) => ath.id === athleteId);
                              if (a) setSelectedAthlete(a);
                            }
                            setFitnessViewMode('individual');
                          }}
                        />
                      ) : (
                        <CoachTestingEntry
                          athletes={athletes}
                          onSaveAssessment={handleSaveAssessment}
                          onOpenReport={(ass) => setReportModalAssessment(ass)}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: ATHLETICS COMPETITIONS & WA POINTS */}
              {activeTab === 'competitions' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Athletics Performance Engine
                      </h2>
                      <p className="text-xs text-slate-500">
                        World Athletics Official Scoring Tables • Track FAT Splits & Field Event Attempts
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsWACalcOpen(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                      >
                        Open WA Calculator
                      </button>
                      {currentUser.role !== 'ATHLETE' && (
                        <button
                          onClick={() => setIsCompetitionModalOpen(true)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300"
                        >
                          + Record Competition Result
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Combined Events Score Card (Decathlon / Heptathlon) */}
                  <CombinedEventCard />

                  {/* Competition Records Table */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-slate-900">
                      Official Competition Performances ({performances.length})
                    </h3>
                    <PerformanceTable performances={performances} />
                  </div>
                </div>
              )}

              {/* TAB 5: SCIENTIFIC NORMS & TEST LIBRARY */}
              {activeTab === 'benchmarks' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-amber-500" />
                        Published Scientific Benchmark Norms
                      </h2>
                      <p className="text-xs text-slate-500">
                        Peer-reviewed normative datasets with verified DOIs (Phase 4 Specification)
                      </p>
                    </div>
                    <button
                      onClick={() => setIsTestLibraryOpen(true)}
                      className="px-4 py-2 text-xs font-bold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition"
                    >
                      Browse Complete Test Catalog
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      Scientific Reference Engine Standards
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Athletics Intelligence strictly prohibits invented benchmark values or fictitious percentile scores. All active physical fitness tests correlate with recognized, published studies including the Council of Europe Eurofit Battery, McMahon et al. (2018), Haugen et al. (2012) elite sprint curves, and Tomkinson et al. (2017 BJSM, N = 1.14M).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">Eurofit Normative Standard</div>
                        <div className="text-slate-600">Council of Europe Committee for Sports Development (N &gt; 22,000)</div>
                        <div className="text-slate-500 text-[11px]">Covers Standing Long Jump, Sit-and-Reach, Plate Tapping</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">Tomkinson et al. 20m Shuttle Run (BJSM 2017)</div>
                        <div className="text-slate-600">DOI: 10.1136/bjsports-2016-095987 (N = 1,142,026 across 50 countries)</div>
                        <div className="text-slate-500 text-[11px]">Continuous LMS growth curves for aerobic capacity</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DEVELOPMENT INTELLIGENCE */}
              {activeTab === 'intelligence' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <LineChart className="w-6 h-6 text-amber-500" />
                      Longitudinal Athlete Development Intelligence
                    </h2>
                    <p className="text-xs text-slate-500">
                      Longitudinal progress analytics, athletic event radar profiling & bilateral asymmetry monitoring
                    </p>
                  </div>

                  {assessments.length > 0 ? (
                    <div className="space-y-6">
                      <InsightCards
                        currentAssessment={assessments[0]}
                        previousAssessment={assessments[1]}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                          <h3 className="font-bold text-sm text-slate-900 mb-2">
                            Latest Assessment Radar Profile ({assessments[0].athleteName})
                          </h3>
                          <FitnessRadarChart
                            currentAssessment={assessments[0]}
                            previousAssessment={assessments[1]}
                          />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                          <h3 className="font-bold text-sm text-slate-900 mb-2">
                            Longitudinal Progress Trajectory
                          </h3>
                          <ProgressionChart assessments={assessments} />
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                        <h3 className="font-bold text-sm text-slate-900 mb-2">
                          Bilateral Symmetry & Limb Deficit Analysis
                        </h3>
                        <BilateralAsymmetryChart assessment={assessments[0]} />
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                      No assessment data available. Complete testing to activate development intelligence.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: A4 REPORT GENERATOR */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-amber-500" />
                        A4 PDF Report Generator (Phase 7)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Editorial 2-page print & PDF dossiers with frozen calculation versioning
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCombinedReportOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md transition transform active:scale-95"
                    >
                      <Layers className="w-4 h-4 text-slate-950" />
                      View All Athlete Reports Together ({athletes.length})
                    </button>
                  </div>

                  {/* Hero Callout Banner for Instant Squad Dossier */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-amber-500/20 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          Consolidated Squad Performance Dossier
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                            Instant 1-Click
                          </span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Suppose all athletes have completed testing: compile every official 2-page physical dossier, executive leaderboard, and multi-page printable PDF in a single second.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCombinedReportOpen(true)}
                      className="px-4 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition shrink-0 whitespace-nowrap"
                    >
                      ⚡ Open All Reports Together
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessments.map((ass) => {
                      const ath = athletes.find((a) => a.id === ass.athleteId);
                      return (
                        <div
                          key={ass.id}
                          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {ass.athleteCode}
                              </span>
                              <span className="text-xs font-bold text-amber-600">
                                Score: {ass.overallFitnessScore?.toFixed(1) ?? '—'}
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">{ass.athleteName}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Testing Date: {ass.assessmentDate} • Battery: {ass.batteryName}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Coach: {ass.coachName}
                            </span>
                            <button
                              onClick={() => setReportModalAssessment(ass)}
                              className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                            >
                              Generate A4 Dossier
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
        existingAthletesCount={athletes.length}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <CoachTestingEntry
              athletes={athletes}
              initialAthleteId={selectedAthlete?.id}
              onSaveAssessment={handleSaveAssessment}
              onClose={() => setIsTestingModalOpen(false)}
              onOpenReport={(ass) => {
                setIsTestingModalOpen(false);
                setReportModalAssessment(ass);
              }}
            />
          </div>
        </div>
      )}

      {/* 4. Competition Entry Modal */}
      <CompetitionEntryModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
        athletes={athletes}
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
          previousAssessment={assessments.find(
            (a) => a.athleteId === reportModalAssessment.athleteId && a.id !== reportModalAssessment.id
          )}
          athlete={athletes.find((a) => a.id === reportModalAssessment.athleteId)}
          performances={performances.filter((p) => p.athleteId === reportModalAssessment.athleteId)}
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

      {/* 9. Consolidated Squad Reports Modal (All Athletes Together) */}
      <CombinedSquadReportModal
        isOpen={isCombinedReportOpen}
        onClose={() => setIsCombinedReportOpen(false)}
        athletes={athletes}
        assessments={assessments}
        onEnsureAllTests={handleEnsureAllTests}
      />
    </div>
  );
}
