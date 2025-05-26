import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AIGA Admin',
    short_name: 'Admin',
    description: 'AIGA Admin',
    id:"/v1",
    start_url: '/v1',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/img/push/55.png',
        sizes: '55x55',
        type: 'image/png',
      },
      {
        src: '/img/push/96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/img/push/128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/img/push/152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/img/push/192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/img/push/256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/img/push/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      
    ],
  }
}