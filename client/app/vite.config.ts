import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 4000
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            strategies: 'generateSW',
            devOptions: {
                enabled: true
            },
            manifest: {
                name: "Crop Vista",
                short_name: "CV App",
                start_url: "./",
                display: "standalone",
                background_color: "#FFFFFF",
                description: 'Crop Vista: Effective Crop Management System',
                theme_color: "#FFFFFF",
                icons: [
                    {
                      "src": "images/pwa-64x64.png",
                      "sizes": "64x64",
                      "type": "image/png"
                    },
                    {
                      "src": "images/pwa-192x192.png",
                      "sizes": "192x192",
                      "type": "image/png"
                    },
                    {
                      "src": "images/pwa-512x512.png",
                      "sizes": "512x512",
                      "type": "image/png"
                    },
                    {
                      "src": "images/maskable-icon-512x512.png",
                      "sizes": "512x512",
                      "type": "image/png",
                      "purpose": "maskable"
                    }
                  ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('public');
                        },
                        handler: 'CacheFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'static-assets',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 200
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('crops');
                        },
                        handler: 'CacheFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'crops-data',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 500
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('accounts');
                        },
                        handler: 'NetworkFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'account-data',
                            expiration:{
                                maxAgeSeconds: 60*2,
                                maxEntries: 100
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('supplies');
                        },
                        handler: 'NetworkFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'supply-data',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 100
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('demands');
                        },
                        handler: 'NetworkFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'demand-data',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 100
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('distprocs');
                        },
                        handler: 'NetworkFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'distprocs-data',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 100
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.includes('distoffers');
                        },
                        handler: 'NetworkFirst',
                        method: 'GET',
                        options:{
                            cacheName: 'distoffers-data',
                            expiration:{
                                maxAgeSeconds: 60*60,
                                maxEntries: 100
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
})
