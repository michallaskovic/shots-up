// @ts-nocheck
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '')

    return {
        base: '/',
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                    clientsClaim: true,
                },
                includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
                manifest: {
                    name: 'Shotsup!',
                    short_name: 'Shotsup',
                    description: 'Party játék 18+',
                    theme_color: '#ffffff',
                    background_color: '#ffffff',
                    display: 'standalone',
                    scope: '/',
                    start_url: '/',
                    icons: [
                        {
                            src: 'icon-192.png',
                            sizes: '192x192',
                            type: 'image/png',
                        },
                        {
                            src: 'icon-512.png',
                            sizes: '512x512',
                            type: 'image/png',
                        },
                    ],
                },
                devOptions: {
                    enabled: false,
                },
            }),
        ],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            },
        },
        server: {
            host: true,
            port: 5173,
            allowedHosts: ['partyshot.vmmozi.org'],
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            },
        },
        preview: {
            allowedHosts: true, // minden host engedélyezve
        },
    }
})
