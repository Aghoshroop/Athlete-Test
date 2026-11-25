'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  Smartphone,
  Laptop,
  Globe,
  Share,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  Wifi,
  WifiOff,
  Copy,
  Check,
  X,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BrowserEnvironment, usePwaInstall } from './pwa-install-context';

type GuideTab = 'android' | 'ios' | 'desktop' | 'firefox';

function getDefaultTab(env: BrowserEnvironment): GuideTab {
  if (env.os === 'ios') return 'ios';
  if (env.os === 'android') return env.browser === 'firefox' ? 'firefox' : 'android';
  if (env.browser === 'firefox') return 'firefox';
  return 'desktop';
}

export function PwaInstallModal() {
  const {
    isStandalone,
    canNativeInstall,
    isOfflineReady,
    isOnline,
    hasUpdate,
    environment,
    isInstallModalOpen,
    closeInstallModal,
    triggerNativeInstall,
    applyAppUpdate,
  } = usePwaInstall();

  const [manualTab, setManualTab] = useState<GuideTab | null>(null);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isInstallModalOpen) return null;

  const selectedTab = manualTab ?? getDefaultTab(environment);

  const handleClose = () => {
    setManualTab(null);
    setInstallFeedback(null);
    closeInstallModal();
  };

  const handleNativeClick = async () => {
    const outcome = await triggerNativeInstall();
    if (outcome === 'accepted') {
      setInstallFeedback('Installing WellPerform on your device...');
    } else if (outcome === 'dismissed') {
      setInstallFeedback('Installation paused — you can install anytime using the steps below.');
    } else {
      setInstallFeedback('Use the quick browser steps below to install on this browser.');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // Clipboard restricted
    }
  };

  const browserLabelMap: Record<string, string> = {
    chrome: 'Google Chrome',
    edge: 'Microsoft Edge',
    safari: 'Apple Safari',
    firefox: 'Mozilla Firefox',
    samsung: 'Samsung Internet',
    opera: 'Opera',
    brave: 'Brave',
    in_app: 'In-App Browser',
    other: 'Web Browser',
  };

  const osLabelMap: Record<string, string> = {
    android: 'Android',
    ios: 'iPhone / iPad',
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    unknown: 'Device',
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-[#0e0e14] border border-red-500/35 text-white shadow-[0_24px_70px_-10px_rgba(220,38,38,0.45)] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#140a0e] via-[#0e0e14] to-[#0e0e14] border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Image
              src="/icons/wp-192.png"
              alt="WellPerform App Icon"
              width={48}
              height={48}
              unoptimized
              className="w-12 h-12 rounded-2xl shadow-lg shadow-red-950/60 border border-red-400/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base tracking-tight text-white">
                  Install WellPerform App
                </h3>
                {isStandalone ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Installed
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    All Browsers Supported
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detected: <strong className="text-slate-200">{browserLabelMap[environment.browser]}</strong> on{' '}
                <strong className="text-slate-200">{osLabelMap[environment.os]}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close install dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Strip: Offline Engine + Connectivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${isOfflineReady ? 'text-emerald-400' : 'text-amber-400'}`}
              />
              <div>
                <div className="font-bold text-slate-100">
                  {isOfflineReady ? 'Offline Stadium Mode Ready' : 'Initializing Offline Cache...'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isOfflineReady
                    ? 'App opens & saves data even without internet.'
                    : 'Caching interface for offline track use.'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <div className="font-bold text-slate-100">
                  {isOnline ? 'Connection Online' : 'Offline Mode Active'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isOnline
                    ? 'Cloud sync & AI tools available.'
                    : 'Using local squad database seamlessly.'}
                </div>
              </div>
            </div>
          </div>

          {/* Non-HTTPS Warning (only on non-localhost HTTP LAN URLs) */}
          {!environment.isSecureContext && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <div className="font-bold text-amber-100">HTTPS Required for Native Browser Install</div>
                <p className="text-[11px] text-amber-200/90">
                  You are viewing an unencrypted local network HTTP address. Open the live{' '}
                  <strong>https://</strong> website URL (or <code>localhost</code>) so your browser enables
                  1-click app download and offline Service Worker caching.
                </p>
              </div>
            </div>
          )}

          {/* In-App Browser Notice */}
          {environment.isInAppBrowser && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-100 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Opened inside an In-App Browser
              </div>
              <p className="text-[11px] text-rose-200 leading-relaxed">
                Apps like WhatsApp, Instagram, and Telegram restrict downloads inside their built-in viewer. Tap the
                menu (<strong>⋮</strong> or <strong>⋯</strong> or <strong>⎋</strong>) and choose{' '}
                <strong>&ldquo;Open in Chrome / Safari&rdquo;</strong>, or copy the link below:
              </p>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-[11px] hover:bg-slate-100 transition"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Link Copied!' : 'Copy App URL to Open in Browser'}</span>
              </button>
            </div>
          )}

          {/* Native 1-Click Install CTA when supported */}
          {isStandalone ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-300 text-sm">
                  You are using the Installed Standalone App
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  WellPerform is already downloaded on this device with full offline support.
                </p>
              </div>
              {hasUpdate && (
                <button
                  type="button"
                  onClick={applyAppUpdate}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shrink-0 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Update Now
                </button>
              )}
            </div>
          ) : canNativeInstall ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-rose-950/60 to-slate-900 border border-red-500/45 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-black text-sm text-white">1-Click Instant App Download</div>
                  <div className="text-[11px] text-rose-200/85">
                    Installs directly on your home screen / desktop like a native app (under 5 MB).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNativeClick}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-black text-xs shadow-[0_0_25px_rgba(239,68,68,0.65)] hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download &amp; Install Now
                </button>
              </div>
              {installFeedback && (
                <div className="text-[11px] font-semibold text-emerald-300">{installFeedback}</div>
              )}
            </div>
          ) : null}

          {/* Universal Browser Tabs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Install Guide by Browser &amp; Device
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-[11px] text-slate-300 hover:text-white inline-flex items-center gap-1 transition"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'URL Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setManualTab('android')}
                className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${selectedTab === 'android'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setManualTab('ios')}
                className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${selectedTab === 'ios'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setManualTab('desktop')}
                className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${selectedTab === 'desktop'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
              </button>

              <button
                type="button"
                onClick={() => setManualTab('firefox')}
                className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${selectedTab === 'firefox'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Firefox</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 leading-relaxed text-slate-300">
              {selectedTab === 'android' && (
                <>
                  <div className="font-bold text-white text-xs">
                    Android (Chrome, Samsung Internet, Edge, Brave, Opera)
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
                    <li>
                      If you see <strong>&ldquo;Download &amp; Install Now&rdquo;</strong> above, tap it for 1-tap
                      installation.
                    </li>
                    <li>
                      Otherwise tap the browser menu{' '}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                        <MoreVertical className="w-3 h-3 mr-0.5" /> ⋮
                      </span>{' '}
                      at the top-right (or bottom bar in Samsung Internet).
                    </li>
                    <li>
                      Select <strong>&ldquo;Install app&rdquo;</strong> or{' '}
                      <strong>&ldquo;Add page to → Home screen&rdquo;</strong>.
                    </li>
                    <li>
                      Tap <strong>Install</strong> — it launches full-screen from your app drawer with offline stadium
                      access.
                    </li>
                  </ol>
                </>
              )}

              {selectedTab === 'ios' && (
                <>
                  <div className="font-bold text-white text-xs">
                    iPhone &amp; iPad (Safari, Chrome iOS 16.4+, Edge iOS)
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
                    <li>
                      Tap the <strong>Share</strong> icon{' '}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                        <Share className="w-3 h-3 mr-1" /> Share
                      </span>{' '}
                      in your browser toolbar (bottom on Safari, top-right on Chrome iOS).
                    </li>
                    <li>
                      Scroll down and tap{' '}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                        <PlusSquare className="w-3 h-3 mr-1" /> Add to Home Screen
                      </span>
                      .
                    </li>
                    <li>
                      Tap <strong>Add</strong> in the top-right corner — the <strong>WellPerform</strong> icon
                      appears right on your iPhone/iPad home screen.
                    </li>
                  </ol>
                </>
              )}

              {selectedTab === 'desktop' && (
                <>
                  <div className="font-bold text-white text-xs">
                    Windows, Mac &amp; Linux (Chrome, Edge, Safari Mac, Brave, Arc)
                  </div>
                  <ul className="space-y-2 text-[11px]">
                    <li>
                      <strong className="text-white">Chrome / Edge / Brave / Opera:</strong> Click{' '}
                      <strong>Download &amp; Install Now</strong> above, or click the{' '}
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-semibold">
                        Install ⊕ / 🖥️↓
                      </span>{' '}
                      icon on the right side of the address bar (or Menu → <em>Save and share / Apps → Install</em>).
                    </li>
                    <li>
                      <strong className="text-white">Mac Safari (macOS Sonoma+):</strong> Click{' '}
                      <strong>File → Add to Dock…</strong> in the top Mac menu bar (or click the toolbar{' '}
                      <strong>Share</strong> icon → <strong>Add to Dock</strong>).
                    </li>
                  </ul>
                </>
              )}

              {selectedTab === 'firefox' && (
                <>
                  <div className="font-bold text-white text-xs">Mozilla Firefox (Android &amp; Desktop)</div>
                  <ul className="space-y-2 text-[11px]">
                    <li>
                      <strong className="text-white">Firefox on Android:</strong> Tap the{' '}
                      <strong>3-dot menu (⋮)</strong> → tap <strong>&ldquo;Install&rdquo;</strong> or{' '}
                      <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </li>
                    <li>
                      <strong className="text-white">Firefox on Desktop:</strong> Offline Service Worker caching and
                      local squad storage already run natively in Firefox! For a standalone desktop window app icon:
                      <span className="block mt-1 text-slate-400">
                        • On Firefox Windows with Taskbar Tabs enabled, click the address-bar app icon, or open this link
                        in Chrome/Edge/Safari once to install the standalone desktop icon.
                      </span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
            <span>All athlete records persist locally &amp; work offline on the track.</span>
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
