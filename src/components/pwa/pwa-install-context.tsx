'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { PwaInstallModal } from './pwa-install-modal';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type DetectedOS = 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'unknown';
export type DetectedBrowser =
  | 'chrome'
  | 'edge'
  | 'safari'
  | 'firefox'
  | 'samsung'
  | 'opera'
  | 'brave'
  | 'in_app'
  | 'other';

export interface BrowserEnvironment {
  os: DetectedOS;
  browser: DetectedBrowser;
  isMobile: boolean;
  isInAppBrowser: boolean;
  isSecureContext: boolean;
}

interface PwaInstallContextValue {
  isStandalone: boolean;
  canNativeInstall: boolean;
  isOfflineReady: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  environment: BrowserEnvironment;
  isInstallModalOpen: boolean;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  triggerNativeInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  applyAppUpdate: () => void;
}

const DEFAULT_ENV: BrowserEnvironment = {
  os: 'unknown',
  browser: 'other',
  isMobile: false,
  isInAppBrowser: false,
  isSecureContext: true,
};

const PwaInstallContext = createContext<PwaInstallContextValue>({
  isStandalone: false,
  canNativeInstall: false,
  isOfflineReady: false,
  isOnline: true,
  hasUpdate: false,
  environment: DEFAULT_ENV,
  isInstallModalOpen: false,
  openInstallModal: () => {},
  closeInstallModal: () => {},
  triggerNativeInstall: async () => 'unavailable',
  applyAppUpdate: () => {},
});

const emptySubscribe = () => () => {};

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function subscribeDisplayMode(callback: () => void) {
  const mql = window.matchMedia('(display-mode: standalone)');
  mql.addEventListener?.('change', callback);
  window.addEventListener('appinstalled', callback);
  return () => {
    mql.removeEventListener?.('change', callback);
    window.removeEventListener('appinstalled', callback);
  };
}

function getStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  const displayStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches;
  const iosStandalone = Boolean((navigator as { standalone?: boolean }).standalone);
  return displayStandalone || iosStandalone;
}

function detectEnvironment(): BrowserEnvironment {
  if (typeof window === 'undefined') return DEFAULT_ENV;
  const ua = navigator.userAgent || '';
  const platform =
    (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    navigator.platform ||
    '';

  const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  let os: DetectedOS = 'unknown';
  if (/Android/i.test(ua)) os = 'android';
  else if (/iPhone|iPad|iPod/i.test(ua) || isIPadOS) os = 'ios';
  else if (/Win/i.test(platform) || /Windows/i.test(ua)) os = 'windows';
  else if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) os = 'macos';
  else if (/Linux/i.test(platform) || /X11/i.test(ua)) os = 'linux';

  const isInAppBrowser =
    /FBAN|FBAV|Instagram|WhatsApp|Line\/|MicroMessenger|Snapchat|Twitter|LinkedInApp|wv\)/i.test(ua);

  let browser: DetectedBrowser = 'other';
  if (isInAppBrowser) browser = 'in_app';
  else if (/SamsungBrowser/i.test(ua)) browser = 'samsung';
  else if (/EdgA|EdgiOS|Edg\//i.test(ua)) browser = 'edge';
  else if (/OPR\/|OPT\//i.test(ua)) browser = 'opera';
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'firefox';
  else if ((navigator as { brave?: unknown }).brave) browser = 'brave';
  else if (/CriOS|Chrome/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua)) browser = 'chrome';
  else if (/Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg|OPR/i.test(ua)) browser = 'safari';

  const isMobile = os === 'android' || os === 'ios' || /Mobi/i.test(ua);

  return {
    os,
    browser,
    isMobile,
    isInAppBrowser,
    isSecureContext: window.isSecureContext,
  };
}

export function PwaInstallProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    () => navigator.onLine,
    () => true
  );
  const isStandaloneFromMedia = useSyncExternalStore(
    subscribeDisplayMode,
    getStandaloneSnapshot,
    () => false
  );

  const environment = useMemo<BrowserEnvironment>(
    () => (isClient ? detectEnvironment() : DEFAULT_ENV),
    [isClient]
  );

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedViaEvent, setInstalledViaEvent] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const win = window as Window & { __deferredPwaPrompt?: BeforeInstallPromptEvent | null };
    if (win.__deferredPwaPrompt) {
      queueMicrotask(() => {
        if (win.__deferredPwaPrompt) {
          setDeferredPrompt(win.__deferredPwaPrompt);
        }
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      win.__deferredPwaPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      win.__deferredPwaPrompt = null;
      setDeferredPrompt(null);
      setInstalledViaEvent(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ('serviceWorker' in navigator && window.isSecureContext) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((registration) => {
          if (registration.active) {
            setIsOfflineReady(true);
          }
          if (registration.waiting) {
            setHasUpdate(true);
            setWaitingWorker(registration.waiting);
          }

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                setIsOfflineReady(true);
              }
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setHasUpdate(true);
                setWaitingWorker(newWorker);
              }
            });
          });
        })
        .catch(() => {});

      navigator.serviceWorker.ready
        .then(() => setIsOfflineReady(true))
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const win = window as Window & { __deferredPwaPrompt?: BeforeInstallPromptEvent | null };
    const promptObj = deferredPrompt || win.__deferredPwaPrompt;
    if (!promptObj) return 'unavailable';

    try {
      await promptObj.prompt();
      const { outcome } = await promptObj.userChoice;
      if (outcome === 'accepted') {
        win.__deferredPwaPrompt = null;
        setDeferredPrompt(null);
      }
      return outcome;
    } catch {
      return 'unavailable';
    }
  }, [deferredPrompt]);

  const applyAppUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }, [waitingWorker]);

  return (
    <PwaInstallContext.Provider
      value={{
        isStandalone: isStandaloneFromMedia || installedViaEvent,
        canNativeInstall: Boolean(deferredPrompt),
        isOfflineReady,
        isOnline,
        hasUpdate,
        environment,
        isInstallModalOpen,
        openInstallModal: () => setIsInstallModalOpen(true),
        closeInstallModal: () => setIsInstallModalOpen(false),
        triggerNativeInstall,
        applyAppUpdate,
      }}
    >
      {children}
      <PwaInstallModal />
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}
