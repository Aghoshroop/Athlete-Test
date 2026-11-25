'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, X } from 'lucide-react';

interface ResetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  athleteCount?: number;
}

export const RESET_CONFIRMATION_PHRASE = 'i want to reset the data';

export function ResetDatabaseModal(props: ResetDatabaseModalProps) {
  if (!props.isOpen) return null;
  return <ResetDatabaseModalContent {...props} />;
}

function ResetDatabaseModalContent({
  onClose,
  onConfirmReset,
  athleteCount = 0,
}: ResetDatabaseModalProps) {
  const [confirmInput, setConfirmInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const normalizedInput = confirmInput.trim().toLowerCase();
  const isMatched = normalizedInput === RESET_CONFIRMATION_PHRASE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatched) {
      setErrorMessage(
        `Confirmation text does not match. Please type "${RESET_CONFIRMATION_PHRASE}" to continue.`
      );
      return;
    }
    onConfirmReset();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-db-title"
        className="w-full max-w-md rounded-2xl bg-[#0c0c10] border border-red-500/40 shadow-[0_25px_70px_-10px_rgba(220,38,38,0.45)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-red-950/35 border-b border-red-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="reset-db-title" className="text-sm font-black text-white">
                Reset All Local Data
              </h3>
              <p className="text-[11px] text-rose-300 font-medium">
                Permanent destructive action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel reset"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/25 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              This will permanently remove all{' '}
              <span className="font-bold text-white">
                {athleteCount > 0 ? `${athleteCount} athlete profiles` : 'athlete profiles'}
              </span>
              , fitness assessments, competition performances, and training plans on this device across both Track &amp; Field and Multi-Sports zones.
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reset-confirmation-input"
              className="block text-xs text-slate-300 leading-relaxed"
            >
              To verify, type{' '}
              <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-rose-300 select-all">
                {RESET_CONFIRMATION_PHRASE}
              </span>{' '}
              in the box below:
            </label>

            <input
              id="reset-confirmation-input"
              type="text"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              value={confirmInput}
              onChange={(e) => {
                setConfirmInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={RESET_CONFIRMATION_PHRASE}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono bg-slate-950 text-white placeholder:text-slate-600 border focus:outline-hidden transition ${
                isMatched
                  ? 'border-emerald-500 ring-1 ring-emerald-500/40'
                  : confirmInput.length > 0
                  ? 'border-rose-500/70 focus:border-rose-500'
                  : 'border-slate-700 focus:border-rose-500'
              }`}
            />

            {errorMessage && (
              <p className="text-[11px] text-rose-400 font-medium">{errorMessage}</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatched}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition ${
                isMatched
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/50 cursor-pointer'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
