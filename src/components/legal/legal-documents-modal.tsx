'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  FileText,
  Scale,
  HeartPulse,
  Cookie,
  BookOpen,
  X,
  Lock,
} from 'lucide-react';

export type LegalDocTab =
  | 'privacy'
  | 'terms'
  | 'biometric'
  | 'medical'
  | 'cookies'
  | 'legal';

interface LegalDocumentsModalProps {
  isOpen: boolean;
  initialTab?: LegalDocTab;
  onClose: () => void;
}

const LEGAL_TABS: { id: LegalDocTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'privacy', label: 'Privacy Policy', icon: Lock },
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'biometric', label: 'Athlete Data & DPDP', icon: ShieldCheck },
  { id: 'medical', label: 'Medical & Anti-Doping', icon: HeartPulse },
  { id: 'cookies', label: 'Offline & Cookies', icon: Cookie },
  { id: 'legal', label: 'Legal & Attributions', icon: Scale },
];

export function LegalDocumentsModal({
  isOpen,
  initialTab = 'privacy',
  onClose,
}: LegalDocumentsModalProps) {
  const [selectedTab, setSelectedTab] = useState<LegalDocTab | null>(null);

  if (!isOpen) return null;

  const activeTab = selectedTab ?? initialTab;

  const handleClose = () => {
    setSelectedTab(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="WellPerform Legal and Privacy Documentation"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[#0c0c11] border border-red-500/35 text-slate-200 shadow-[0_25px_80px_-10px_rgba(220,38,38,0.4)] overflow-hidden my-auto flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#160a0d] via-[#0c0c11] to-[#0c0c11] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/wp-192.png"
              alt="WellPerform Logo"
              width={36}
              height={36}
              unoptimized
              className="w-9 h-9 rounded-xl shadow-md border border-red-500/30 shrink-0"
            />
            <div>
              <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                WellPerform — Privacy, Legal &amp; Governance Center
              </h3>
              <p className="text-[11px] text-slate-400">
                Effective Date: November 25, 2026 • High-Performance Athletics &amp; Sports Science Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close legal documentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Pills */}
        <div className="p-2.5 sm:px-5 bg-slate-950/70 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {LEGAL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Document Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300 flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                Privacy Policy
              </h4>
              <p>
                <strong>WellPerform</strong> respects the confidentiality of every coach, sports scientist, athletic
                federation, and athlete using this platform. We follow a <strong>local-first privacy design</strong>:
              </p>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Information We Process:</strong> Coach identification (full name,
                  organization, optional Gmail sync identifier) and athlete testing data entered by authorized staff
                  (names, sex/age groups, anthropometry, timing-gate results, power/strength scores, and competition marks).
                </p>
                <p>
                  <strong className="text-white">2. Local Storage &amp; Optional Cloud Backup:</strong> All squad profiles,
                  assessments, and custom benchmark tests are stored directly in your browser&apos;s local database
                  (<code>localStorage</code> &amp; offline PWA cache). When you enable Coach Gmail Sync, encrypted JSON
                  snapshots are backed up strictly to your linked backup endpoint so you can restore across mobile, tablet,
                  and laptop devices.
                </p>
                <p>
                  <strong className="text-white">3. AI Analytics Processing:</strong> When a coach invokes AI Development
                  Intelligence or AI Periodization Planning, only the performance context required to synthesize coaching
                  directives is transmitted to the configured AI inference API. We do not use athlete data to serve
                  third-party advertisements or sell data to data brokers.
                </p>
                <p>
                  <strong className="text-white">4. Access, Portability &amp; Deletion:</strong> Coaches can export the
                  entire database at any time via Cloud Sync (JSON), generate print/PDF A4 athlete dossiers, delete
                  individual athlete records (cascading across assessments &amp; performances), or reset local data.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                Terms of Service &amp; Acceptable Use
              </h4>
              <p>
                By entering coach authorization and accessing <strong>WellPerform</strong>, you agree to the following
                terms governing platform operation:
              </p>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Authorized Sports Performance Use:</strong> WellPerform is designed
                  for qualified track &amp; field coaches, strength &amp; conditioning specialists, athletic clubs, academies,
                  and national/state high-performance squads.
                </p>
                <p>
                  <strong className="text-white">2. Measurement Calibration &amp; Verification:</strong> Automated percentile
                  calculations, World Athletics points, and developmental classifications depend on accurate coach input
                  (electronic FAT vs manual timing, wind gauge readings, distance/weight measurements, and athlete age/sex
                  accuracy). You remain responsible for verifying field-testing protocol compliance.
                </p>
                <p>
                  <strong className="text-white">3. Account &amp; Device Security:</strong> Because WellPerform maintains
                  local records on your device and optional email-linked backups, you agree to safeguard physical and browser
                  access to any device containing junior or senior athlete profiles.
                </p>
                <p>
                  <strong className="text-white">4. Service Modification &amp; Warranties:</strong> WellPerform is provided
                  &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; While engineered with high-availability and offline
                  Service Worker fallbacks, we recommend maintaining periodic JSON backups before major championships or
                  device migrations.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'biometric' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Athlete Biometric Protection &amp; DPDP / GDPR Compliance
              </h4>
              <p>
                Athletic anthropometry, limb-asymmetry diagnostics, maximal force outputs, and physiological readiness data
                are treated with heightened sensitivity in alignment with the{' '}
                <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong> and global sports-data privacy
                standards:
              </p>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Verifiable Consent &amp; Youth Athletes:</strong> When registering or
                  assessing youth/junior athletes (under 18 years of age), the operating coach or sporting academy confirms
                  that lawful parental, guardian, or institutional consent has been obtained prior to logging physical
                  testing metrics.
                </p>
                <p>
                  <strong className="text-white">2. Purpose Limitation:</strong> Performance metrics are used exclusively for
                  athletic talent identification, workload monitoring, injury-risk reduction (such as bilateral asymmetry
                  screening), and evidence-based periodization.
                </p>
                <p>
                  <strong className="text-white">3. Right to Erasure:</strong> Deleting an athlete inside Athletes Management
                  immediately purges associated body measurements, assessments, competition records, and saved report
                  snapshots from local device storage.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                Medical Safety &amp; Clean Sport (Anti-Doping) Disclaimer
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-950/35 border border-amber-500/35 text-amber-100">
                <strong>Important Health &amp; Medical Notice:</strong> WellPerform is a sports-science benchmarking and
                analytics platform — <strong>not a licensed medical device or clinical diagnostic service</strong>.
              </div>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Pre-Participation Medical Clearance:</strong> High-intensity tests
                  (maximal sprints, 1RM squats, plyometric depth/drop jumps, Yo-Yo IR2, and lactate tolerance intervals)
                  impose high musculoskeletal and cardiovascular load. Athletes must be medically screened and warmed up
                  under certified supervision before maximal exertion.
                </p>
                <p>
                  <strong className="text-white">2. Asymmetry &amp; Injury Flags:</strong> Bilateral limb asymmetry alerts
                  (e.g., &gt;10–15%) are informational screening indicators only and should be evaluated by a qualified
                  sports physiotherapist or sports physician.
                </p>
                <p>
                  <strong className="text-white">3. WADA &amp; NADA Clean Sport Commitment:</strong> WellPerform operates
                  strictly in support of drug-free athletics under World Anti-Doping Agency (WADA) and National
                  Anti-Doping Agency (NADA) guidelines. No training directive generated by this system permits or recommends
                  prohibited substances or methods.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Cookie className="w-4 h-4 text-rose-400" />
                Cookie, Local Storage &amp; Offline App Policy
              </h4>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Zero Advertising Trackers:</strong> WellPerform sets <strong>no
                  third-party advertising, behavioral profiling, or cross-site tracking cookies</strong>.
                </p>
                <p>
                  <strong className="text-white">2. Strictly Functional Browser Storage:</strong> We use HTML5{' '}
                  <code>localStorage</code> solely to retain your athlete squad registry, assessment trials, custom test
                  definitions, theme selection (Bright/Dark), and report design preferences cleanly on your own device.
                </p>
                <p>
                  <strong className="text-white">3. Service Worker Cache (PWA):</strong> When installed or cached by your
                  browser, WellPerform&apos;s Service Worker stores static application interface files locally so coaches
                  can inspect standards and enter trials offline in stadiums with limited mobile signal.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" />
                Intellectual Property, Citations &amp; Legal Notices
              </h4>
              <div className="space-y-2">
                <p>
                  <strong className="text-white">1. Ownership:</strong> &ldquo;WellPerform,&rdquo; the WellPerform brand
                  emblem, user interface, software implementation, and compilation of scoring workflows are proprietary to{' '}
                  <strong>WellPerform (&copy; 2026)</strong>. Unauthorized commercial redistribution or cloning is
                  prohibited.
                </p>
                <p>
                  <strong className="text-white">2. Peer-Reviewed Scientific Attributions:</strong> Physical test norms and
                  equations incorporate published methodologies and empirical cohorts including <em>Tomkinson et al. (BJSM
                  2017, DOI: 10.1136/bjsports-2016-095987)</em>, <em>Council of Europe Eurofit Battery</em>,{' '}
                  <em>McMahon et al. (2018)</em>, <em>Haugen et al. (2012)</em>, <em>Suchomel et al. (2016)</em>,{' '}
                  <em>Pauole et al. (2000)</em>, and <em>Bangsbo et al. (2008)</em>.
                </p>
                <p>
                  <strong className="text-white">3. Federation Trademarks &amp; Standards:</strong> References to{' '}
                  <strong>World Athletics (WA)</strong>, <strong>Athletics Federation of India (AFI)</strong>,{' '}
                  <strong>Olympic qualifying standards</strong>, and <strong>Eurofit</strong> identify publicly recognized
                  competitive performance benchmarks only. WellPerform is an independent coaching analytics platform and
                  these marks remain the property of their respective governing bodies.
                </p>
                <p>
                  <strong className="text-white">4. Dispute Resolution &amp; Governing Law:</strong> Any legal notice or
                  dispute arising from institutional usage shall be governed in accordance with applicable statutory laws and
                  good-faith resolution mechanisms.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
          <span>&copy; 2026 WellPerform &bull; Privacy-First High-Performance Athletics Software</span>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
