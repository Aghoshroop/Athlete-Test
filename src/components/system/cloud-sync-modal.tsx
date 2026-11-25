'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/storage/local-storage-db';
import { CloudBackupPayload } from '@/types/cloud-backup';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FileJson,
  Upload,
  Download,
  Users,
  Activity,
  Trophy,
  Layers,
  Database,
  ShieldCheck,
  Smartphone,
  Laptop,
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
  currentEmail?: string;
}

export function CloudSyncModal({
  isOpen,
  onClose,
  onDataRestored,
  currentEmail,
}: CloudSyncModalProps) {
  const [email, setEmail] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    provider?: string;
  } | null>(null);

  // Current stats
  const [stats, setStats] = useState({
    athletes: 0,
    assessments: 0,
    competitions: 0,
    groups: 0,
  });

  const refreshStats = () => {
    const athletes = db.getAthletes();
    const assessments = db.getAssessments();
    const competitions = db.getCompetitions();
    const groupsCount = db.getGroups('track_and_field').length + db.getGroups('multi_sports').length;
    setStats({
      athletes: athletes.length,
      assessments: assessments.length,
      competitions: competitions.length,
      groups: groupsCount,
    });
    setLastSyncTime(db.getLastCloudSyncTime());
  };

  useEffect(() => {
    if (isOpen) {
      const active = currentEmail || db.getCoachEmail();
      setEmail(active);
      refreshStats();
      setStatusMessage(null);
    }
  }, [isOpen, currentEmail]);

  if (!isOpen) return null;

  // Handle Backup to Cloud
  const handleBackupNow = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid Gmail address to link your backup.',
      });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);
    db.setCoachEmail(email);

    try {
      const res = await db.syncToCloud(email);
      if (res.success) {
        setLastSyncTime(new Date().toISOString());
        setStatusMessage({
          type: 'success',
          text: `Cloud Backup Successful! Synced ${stats.athletes} athletes & ${stats.assessments} assessments under ${email}.`,
          provider: res.provider,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Cloud backup failed.',
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: e?.message || 'Error communicating with cloud sync engine.',
      });
    } finally {
      setIsSyncing(false);
      refreshStats();
    }
  };

  // Handle Restore from Cloud
  const handleRestoreNow = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid Gmail address to search for backups.',
      });
      return;
    }

    setIsRestoring(true);
    setStatusMessage(null);

    try {
      const res = await db.fetchCloudBackup(email);
      if (res.found && res.backup) {
        const ok = db.restoreFromBackupPayload(res.backup);
        if (ok) {
          const recoveredName = res.backup.coachName?.trim();
          const nameBadge =
            recoveredName && recoveredName !== 'Lead Coach' ? ` for ${recoveredName}` : '';
          setStatusMessage({
            type: 'success',
            text: `Backup restored${nameBadge}! Loaded ${res.backup.stats?.athleteCount ?? res.backup.athletes?.length} athletes and ${res.backup.stats?.assessmentCount ?? res.backup.assessments?.length} assessments from ${new Date(res.backup.timestamp).toLocaleDateString()}.`,
            provider: res.provider,
          });
          refreshStats();
          if (onDataRestored) onDataRestored();
        } else {
          setStatusMessage({
            type: 'error',
            text: 'Failed to unpack cloud backup payload into local database.',
          });
        }
      } else {
        setStatusMessage({
          type: 'info',
          text: `No cloud backup found yet for ${email}. Tap "Backup Current State to Cloud" to create your first cloud snapshot.`,
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: e?.message || 'Error restoring from cloud.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Export Local JSON File
  const handleExportJson = () => {
    const payload = db.getBackupPayload(email);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    const cleanName = (payload.coachName || 'coach').replace(/\s+/g, '-').toLowerCase();
    downloadAnchor.setAttribute('download', `athletics-backup-${cleanName}-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({
      type: 'success',
      text: 'Exported backup JSON file successfully to your downloads!',
    });
  };

  // Import Local JSON File
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as CloudBackupPayload;
        if (!parsed || (!parsed.athletes && !parsed.assessments)) {
          setStatusMessage({
            type: 'error',
            text: 'Invalid athletics backup JSON file structure.',
          });
          return;
        }

        const ok = db.restoreFromBackupPayload(parsed);
        if (ok) {
          if (parsed.email) setEmail(parsed.email);
          refreshStats();
          setStatusMessage({
            type: 'success',
            text: `Successfully imported backup file! Restored ${parsed.athletes?.length || 0} athletes & ${parsed.assessments?.length || 0} assessments.`,
          });
          if (onDataRestored) onDataRestored();
        }
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: 'Failed to parse JSON backup file.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/40 font-bold shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Cross-Device Cloud Sync & Backup
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gmail Linked
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log in with the same Gmail on any phone, tablet or laptop to load all your data.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Message Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium leading-relaxed">{statusMessage.text}</p>
                {statusMessage.provider && (
                  <p className="text-[10px] font-mono opacity-80 mt-1">
                    Database Provider: {statusMessage.provider}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Connected Gmail Box */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Your Gmail Address</span>
              {lastSyncTime && (
                <span className="text-[10px] text-slate-400 font-normal normal-case">
                  Last Synced: {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. coach.rudra@gmail.com"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Whenever you open this website on another phone or computer, typing this same Gmail will immediately restore all your athletes and test history.
            </p>
          </div>

          {/* Sync Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBackupNow}
              disabled={isSyncing || isRestoring}
              className="py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing to Cloud...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  <span>Backup Now to Cloud</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestoreNow}
              disabled={isSyncing || isRestoring}
              className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching Cloud Data...</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-4 h-4 text-rose-400" />
                  <span>Restore from Cloud</span>
                </>
              )}
            </button>
          </div>

          {/* Current Local Snapshot Stats */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Local Snapshot Ready for Sync
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-base font-black text-white">{stats.athletes}</div>
                <div className="text-[10px] text-slate-400">Athletes</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-base font-black text-rose-400">{stats.assessments}</div>
                <div className="text-[10px] text-slate-400">Assessments</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-base font-black text-amber-400">{stats.competitions}</div>
                <div className="text-[10px] text-slate-400">Competitions</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-base font-black text-white">{stats.groups}</div>
                <div className="text-[10px] text-slate-400">Groups</div>
              </div>
            </div>
          </div>

          {/* Offline / Portable File Export & Import */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileJson className="w-3.5 h-3.5 text-rose-400" />
                Portable Offline Backup (.json)
              </span>
              <span className="text-[10px] text-slate-500">Zero Internet Required</span>
            </div>
            <p className="text-[11px] text-slate-400">
              You can also download a direct backup file to your phone/computer to transfer via WhatsApp, Drive or USB anytime.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                Export Backup File (.json)
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                Import Backup File (.json)
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* How Cross-Device Works Callout */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300">
            <Smartphone className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">How Cross-Device Sync Works:</span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Open <span className="font-mono text-rose-300">athlete-test-five.vercel.app</span> on your mobile or another device, enter your Gmail on entry, and all your athletes, squad groups, and assessment reports will load instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted snapshot versioning (v1.0.0)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
