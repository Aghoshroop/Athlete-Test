import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaInstallProvider } from "@/components/pwa/pwa-install-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dc2626" },
    { media: "(prefers-color-scheme: dark)", color: "#08080b" },
  ],
};

export const metadata: Metadata = {
  applicationName: "WellPerform",
  title: {
    default: "WellPerform",
    template: "%s | WellPerform",
  },
  description:
    "WellPerform — Olympic-grade athletic performance testing, World Athletics scoring models, scientific norms, and AI-powered periodization.",
  appleWebApp: {
    capable: true,
    title: "WellPerform",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/wp-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/wp-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    shortcut: ["/favicon.ico?v=3"],
    apple: [
      { url: "/icons/wp-apple-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const EARLY_PWA_PROMPT_SCRIPT = `
(function(){
  if (typeof window !== 'undefined') {
    window.__deferredPwaPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      window.__deferredPwaPrompt = e;
    });
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: EARLY_PWA_PROMPT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col max-w-[100vw]">
        <PwaInstallProvider>{children}</PwaInstallProvider>
      </body>
    </html>
  );
}
