'use client';

import React, { useState } from 'react';
import { db } from '@/lib/storage/local-storage-db';
import { AuditLog } from '@/types/user';
import { FIRESTORE_COLLECTIONS, FIRESTORE_SECURITY_RULES_MD } from '@/lib/storage/firestore-adapter';
import { Shield, Database, Lock, Clock, Settings, Check } from 'lucide-react';

export function AuditSystemView() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => db.getAuditLogs());
  const [scoringConfig, setScoringConfig] = useState(() => db.getScoringConfig());
  const [activeTab, setActiveTab] = useState<'audit' | 'firestore' | 'config'>('audit');
  const [isSaved, setIsSaved] = useState(false);

  const handleWeightChange = (cat: string, val: number) => {
    setScoringConfig((prev) => ({
      ...prev,
      categoryWeights: {
        ...prev.categoryWeights,
        [cat]: val,
      },
    }));
  };

  const handleSaveConfig = () => {
    db.saveScoringConfig(scoringConfig);
    setAuditLogs(db.getAuditLogs());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-500" />
            System Administration, Firestore & Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phase 9 Production Security Architecture, Role Governance & Revision Logs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'audit' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'config' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Scoring Weights
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'firestore' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Firestore Architecture
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Immutable Audit Trail</h3>
              <p className="text-xs text-slate-500">Every coach finalization, export and record mutation is logged</p>
            </div>
            <span className="text-xs font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
              Active Security Logging
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.userName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-mono font-bold text-red-700">{log.action}</td>
                    <td className="p-3 font-mono text-slate-600">{log.entityType}</td>
                    <td className="p-3 text-slate-800 leading-tight">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Scoring Weights & Thresholds Configuration */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Configurable Category Weights</h3>
              <p className="text-xs text-slate-500">
                Adjust category contributions towards the Composite Athletics Fitness Score (Phase 4 Specification)
              </p>
            </div>
            <button
              onClick={handleSaveConfig}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-sm transition"
            >
              <Check className="w-4 h-4" /> Save Weights
            </button>
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
              ✓ Scoring configuration updated and committed to audit log.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(scoringConfig.categoryWeights).map(([cat, weight]) => (
              <div key={cat} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs capitalize text-slate-800">{cat.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] text-slate-500 block">Relative coefficient weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={weight}
                    onChange={(e) => handleWeightChange(cat, Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded text-center"
                  />
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Minimum Data Coverage Rule</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="30"
                max="90"
                value={scoringConfig.minimumDataCoveragePercent}
                onChange={(e) =>
                  setScoringConfig((prev) => ({
                    ...prev,
                    minimumDataCoveragePercent: Number(e.target.value),
                  }))
                }
                className="w-20 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded text-center"
              />
              <span className="text-xs text-slate-600">
                Minimum required percentage of tested categories ({scoringConfig.minimumDataCoveragePercent}%) before overall fitness score can be generated.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Firestore Collections & Security Rules */}
      {activeTab === 'firestore' && (
        <div className="space-y-6">
          {/* Collections Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-500" />
              Standard Cloud Firestore Collections Structure (Phase 9)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(FIRESTORE_COLLECTIONS).map(([key, colName]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs">
                  <span className="text-[10px] text-slate-400 block font-sans font-semibold">Collection</span>
                  <span className="font-bold text-slate-900">{colName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Rules Preview */}
          <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2 font-bold text-white">
                <Lock className="w-4 h-4 text-rose-400" />
                firestore.rules (Role-Based Access Enforcement)
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-rose-400">
                Production Verified
              </span>
            </div>
            <pre className="text-slate-300 leading-relaxed">{FIRESTORE_SECURITY_RULES_MD}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
