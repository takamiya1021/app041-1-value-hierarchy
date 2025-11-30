import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Value Hierarchy - 価値観の階層化',
    short_name: 'Value Hierarchy',
    description: 'あなたの「やりたいこと」を整理し、本当に大切な価値観を見つけるアプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a2e',
    theme_color: '#6366f1',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['productivity', 'lifestyle'],
    lang: 'ja'
  };
}
