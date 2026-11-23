'use client';

import React, { useState } from 'react';
import { Assessment } from '@/types/assessment';
import { AthleteProfile } from '@/types/athlete';
import { PerformanceRecord } from '@/types/athletics';
import { ReportDesignConfig, DEFAULT_REPORT_DESIGN } from '@/types/report-design';
import { db } from '@/lib/storage/local-storage-db';
import { ReportPageOne } from './report-page-one';
import { ReportPageTwo } from './report-page-two';
import { CompetitionReport } from './competition-report';
import { ReportDesignModal } from './report-design-modal';
import { AiTrainingPlanModal } from '@/components/intelligence/ai-training-plan-modal';
import { Printer, X, Download, FileText, Trophy, Palette, Sparkles } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment;
  previousAssessment?: Assessment;
  athlete?: AthleteProfile;
  performances?: PerformanceRecord[];
}

export function ReportModal({
  isOpen,
  onClose,
  assessment,
  previousAssessment,
  athlete,
  performances = [],
}: ReportModalProps) {
  const [activeReportTab, setActiveReportTab] = useState<'fitness' | 'competition'>('fitness');
  const [designConfig, setDesignConfig] = useState<ReportDesignConfig>(() =>
    db.getReportDesignConfig()
  );
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isAiPlanModalOpen, setIsAiPlanModalOpen] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDesignChange = (newConfig: ReportDesignConfig) => {
    setDesignConfig(newConfig);
    db.saveReportDesignConfig(newConfig);
  };

  return (
    <div className="printable-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="printable-modal-card bg-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-300 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden when printing!) */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 no-print shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xs sm:text-sm shadow-md shadow-red-950/40 shrink-0">
              A4
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Official Athletics Assessment Report
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
                {assessment.athleteName} ({assessment.athleteCode}) • {assessment.assessmentDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 sm:p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setActiveReportTab('fitness')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-md transition ${
                  activeReportTab === 'fitness'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Fitness Dossier
                </span>
              </button>
              <button
                onClick={() => setActiveReportTab('competition')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-md transition ${
                  activeReportTab === 'competition'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Competition & WA
                </span>
              </button>
            </div>

            {/* Design Customizer Button */}
            <button
              type="button"
              onClick={() => setIsDesignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition shadow-xs"
              title="Customize colors, typography, paper tone & Page 2 metric graphing style"
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Design & Layout</span>
              <span className="sm:hidden">Theme</span>
            </button>

            {/* AI Prescription Button */}
            <button
              type="button"
              onClick={() => setIsAiPlanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white rounded-lg shadow-sm transition"
              title="Generate IAAF Periodized AI Training Prescription based on assessment results"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">AI Prescription</span>
              <span className="sm:hidden">AI Plan</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40 rounded-lg shadow-sm transition"
            >
              <Printer className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              Print / Save
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition ml-auto sm:ml-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="printable-scroll-body p-2 sm:p-8 overflow-y-auto overflow-x-auto flex-1 bg-slate-200/80">
          {activeReportTab === 'fitness' ? (
            <div className="space-y-8">
              {/* PAGE 1 */}
              <ReportPageOne
                assessment={assessment}
                previousAssessment={previousAssessment}
                athlete={athlete}
                designConfig={designConfig}
              />

              {/* PAGE 2 */}
              <ReportPageTwo assessment={assessment} designConfig={designConfig} />
            </div>
          ) : (
            <div>
              {athlete ? (
                <CompetitionReport athlete={athlete} performances={performances} />
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">Athlete profile required for competition dossier.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Design Customizer Modal */}
      <ReportDesignModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        config={designConfig}
        onChange={handleDesignChange}
        sampleAssessment={assessment}
        sampleAthlete={athlete}
      />

      {/* AI Training Plan Modal */}
      <AiTrainingPlanModal
        isOpen={isAiPlanModalOpen}
        onClose={() => setIsAiPlanModalOpen(false)}
        assessment={assessment}
        athlete={athlete}
      />
    </div>
  );
}
