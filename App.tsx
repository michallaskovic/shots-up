

import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import LocalGame from './components/LocalGame';
import OnlineGame from './components/OnlineGame';
import PolicyScreen from './components/PolicyScreen';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'main' | 'local' | 'online' | 'privacy' | 'terms'>('main');

    const handleSelectLocal = () => {
        // Clear any saved local game state to ensure a fresh start
        localStorage.removeItem('shotsup_localGame');
        setCurrentView('local');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'local':
                return <LocalGame onBack={() => setCurrentView('main')} />;
            case 'online':
                return <OnlineGame onBack={() => setCurrentView('main')} />;
            case 'privacy':
                return <PolicyScreen type="privacy" onBack={() => setCurrentView('main')} />;
            case 'terms':
                return <PolicyScreen type="terms" onBack={() => setCurrentView('main')} />;
            default:
                return (
                    <MainMenu
                        onSelectLocal={handleSelectLocal}
                        onSelectOnline={() => setCurrentView('online')}
                        onShowPrivacy={() => setCurrentView('privacy')}
                        onShowTerms={() => setCurrentView('terms')}
                    />
                );
        }
    };

    return (
        <main className="w-full min-h-screen">
            {renderContent()}
        </main>
    );
};

export default App;
