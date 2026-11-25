import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Well Perform — High-Performance Athletics Lab',
    short_name: 'Well Perform',
    description:
      'Well Perform: Olympic-grade athletic performance testing, World Athletics scoring models, scientific norms, and AI-powered periodization.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#08080b',
    theme_color: '#dc2626',
    categories: ['sports', 'fitness', 'health', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Squad Dashboard',
        short_name: 'Dashboard',
        description: 'View KPIs and active athlete roster',
        url: '/?tab=dashboard',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Fitness Assessments',
        short_name: 'Fitness',
        description: 'Record athlete physical trials & percentiles',
        url: '/?tab=fitness',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'WA Points & Events',
        short_name: 'WA Points',
        description: 'Official World Athletics scoring calculator & benchmarks',
        url: '/?tab=competitions',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'AI Development Lab',
        short_name: 'AI Lab',
        description: 'Biomechanics insights & squad periodization',
        url: '/?tab=intelligence',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
