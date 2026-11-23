'use client';

import React, { useState } from 'react';
import { db } from '@/lib/storage/local-storage-db';
import { AuditLog } from '@/types/user';
import { Shield, Clock, User, Filter, RefreshCw } from 'lucide-react';

export function AuditSystemView() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => db.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const handleRefresh = () => {
    setAuditLogs(db.getAuditLogs());
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchAction = actionFilter === 'all' || log.action.toUpperCase().includes(actionFilter.toUpperCase());
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
            <span>System Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable forensic record of all coach actions, assessment finalizations, and data mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
            <span>Refresh</span>
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap">
            {auditLogs.length} Records
          </span>
        </div>
      </div>

      {/* Main Audit Trail Card */}
      <div className="bg-white dark:bg-[#0e0e13] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs w-full max-w-full min-w-0 overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <input
              type="text"
              placeholder="Search audit trail by operator, action, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-red-500"
            >
              <option value="all">All Operations</option>
              <option value="CREATE">Create / Register</option>
              <option value="UPDATE">Update / Edit</option>
              <option value="FINAL">Finalize / Commit</option>
              <option value="SYNC">Sync / Backup</option>
              <option value="DELETE">Delete / Purge</option>
            </select>
          </div>
        </div>

        {/* 1. Mobile Cards Layout (< md) - Zero Overlapping & Zero Horizontal Overflow */}
        <div className="block md:hidden space-y-2.5 w-full max-w-full min-w-0">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No audit records matching your filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const actionUpper = log.action.toUpperCase();
              const isCreate = actionUpper.includes('CREATE') || actionUpper.includes('REGISTER');
              const isFinal = actionUpper.includes('FINAL') || actionUpper.includes('COMMIT');
              const isDelete = actionUpper.includes('DELETE') || actionUpper.includes('REMOVE');
              const isSync = actionUpper.includes('SYNC') || actionUpper.includes('RESTORE') || actionUpper.includes('BACKUP');

              return (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 w-full max-w-full overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                          isDelete
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : isCreate
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : isFinal
                            ? 'bg-red-500/15 text-rose-700 dark:text-rose-400 border border-red-500/30'
                            : isSync
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[120px]">
                        {log.entityType}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {log.userName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                      {log.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px] break-words bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop & Tablet Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto w-full max-w-full rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[650px] text-left text-xs border-collapse">
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
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{log.userName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 uppercase font-mono font-bold text-rose-600 dark:text-rose-400">{log.action}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{log.entityType}</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 leading-tight break-words">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
