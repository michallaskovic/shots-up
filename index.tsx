// @ts-ignore
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';




console.log('PWA regisztráció indítása...');

try {
    const updateSW = registerSW({
        immediate: true,
        onOfflineReady() {
            console.log('✅ Offline módban is működik!');
        },
        onNeedRefresh() {
            console.log('🔄 Frissítés szükséges');
            const shouldUpdate = confirm('Új verzió érhető el. Frissíted?');
            if (shouldUpdate) {
                updateSW(true);
            }
        },
        onRegistered(r) {
            console.log('✅ Service Worker regisztrálva:', r);
        },
        onRegisterError(error) {
            console.error('❌ Service Worker hiba:', error);
        }
    });
    console.log('PWA konfiguráció sikeres');
} catch (error) {
    console.error('PWA hiba:', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);