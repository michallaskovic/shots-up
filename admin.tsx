import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// Import all data structures that need to be managed
import { uiTranslations, gameModeTranslations, gameCategoryTranslations, mfkCelebrities, languages, defaultLang } from './translations';
import { questionTranslations } from './questions';
import { SIPS_WHEEL_SEGMENTS, POINTS_WHEEL_SEGMENTS } from './constants';
import { GameMode, QuestionType } from './types';

// The main data structure to hold all configurable data
const initialData = {
    uiTranslations,
    gameModeTranslations,
    gameCategoryTranslations,
    mfkCelebrities,
    questionTranslations,
    sipsWheel: SIPS_WHEEL_SEGMENTS,
    pointsWheel: POINTS_WHEEL_SEGMENTS,
};

type AdminData = typeof initialData;
type NavSection = 'ui' | 'gamemodes' | 'categories' | 'questions' | 'wheel' | 'mfk';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState<AdminData>(initialData);
    const [activeSection, setActiveSection] = useState<NavSection>('ui');
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);
    const [isExporting, setIsExporting] = useState(false);

    // UI state
    const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.SOFT);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const password = prompt("Please enter admin password:");
        if (password === "SHOTS_ADMIN_2024") {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password.");
        }
    }, []);

    const handleDataChange = (path: (string|number)[], value: any) => {
        setData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy for safety
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newData;
        });
    };

    const generateTsFileString = (variableName: string, dataObject: any, imports: string = "") => {
        const jsonString = JSON.stringify(dataObject, null, 2);
        return `${imports}\n\nexport const ${variableName} = ${jsonString};`;
    };

    const generateQuestionsFile = () => {
        let content = `import { GameMode, Question, QuestionType, WordWithCategory, ImpostorCategory } from './types';\n\n`;
        content += `export const questionTranslations: { [lang: string]: { [key: string]: readonly any[] } } = {\n`;
        for (const lang in data.questionTranslations) {
            content += `  ${lang}: {\n`;
            const modes = data.questionTranslations[lang as keyof typeof data.questionTranslations];
            for (const mode in modes) {
                const enumKey = `GameMode.${mode.toUpperCase()}`;
                const questions = (modes as any)[mode];
                let typeAssertion = '';
                if(mode === 'WHEEL_OF_FORTUNE' || mode === 'HEADS_UP') typeAssertion = ' as readonly WordWithCategory[]';
                if(mode === 'IMPOSTOR') typeAssertion = ' as readonly ImpostorCategory[]';
                content += `    [${enumKey}]: ${JSON.stringify(questions, null, 4)}${typeAssertion},\n`;
            }
            content += `  },\n`;
        }
        content += `};`;
        // Quick fix to remove quotes from enum keys
        return content.replace(/"(GameMode\.[A-Z_]+)"/g, '$1');
    }

    const generateConstantsFile = () => {
        const imports = `import { GameMode, GameModeStatus } from './types';\n\nexport type GameCategoryInfo = {\n    id: string;\n    name: string;\n    icon: string;\n    color: string;\n};\n\nexport type GameModeInfo = {\n    id: GameMode;\n    name: string;\n    description: string;\n    iconId: string;\n    status: GameModeStatus;\n    categoryId: string;\n    details: {\n        environment: 'local' | 'online' | 'both';\n        players: string;\n        rewardType: 'points' | 'drinks' | 'none' | 'both';\n        roundBased: boolean;\n        votable: boolean;\n    };\n};\n\nexport type WheelSegment = {\n    type: 'points' | 'bankrupt' | 'extra_turn' | 'drink' | 'neighbor_drinks' | 'social' | 'lose_turn' | 'donate_points';\n    value?: number;\n    label: string;\n    color: 'cyan' | 'pink' | 'gray';\n};`
        const sipsWheel = `export const SIPS_WHEEL_SEGMENTS: WheelSegment[] = ${JSON.stringify(data.sipsWheel, null, 2)};`;
        const pointsWheel = `export const POINTS_WHEEL_SEGMENTS: WheelSegment[] = ${JSON.stringify(data.pointsWheel, null, 2)};`;
        const footer = `\n\nexport const getWheelSegments = (scoringSystem: 'points' | 'sips' | undefined): WheelSegment[] => {\n    if (scoringSystem === 'points') {\n        return POINTS_WHEEL_SEGMENTS;\n    }\n    return SIPS_WHEEL_SEGMENTS; // Default to sips if undefined or 'sips'\n};\n\n\nexport const MIN_PLAYERS = 2;\nexport const MAX_PLAYERS = 10;\nexport const IMPOSTOR_MIN_PLAYERS = 2;\nexport const ROUNDS_IN_TRUTH_OR_LIE = 10;\nexport const HANGMAN_MISTAKES_LIMIT = 6;\nexport const HEADS_UP_ROUND_DURATION = 60;`;

        return `${imports}\n\n${sipsWheel}\n\n${pointsWheel}${footer}`;
    }

    const generateTranslationsFile = () => {
        let content = `import { GameMode } from './types';\nimport type { GameModeInfo, GameCategoryInfo } from './constants';\n\n`;
        content += `export const languages = ${JSON.stringify(languages, null, 2)};\n\n`;
        content += `export const defaultLang = '${defaultLang}';\n\n`;
        content += `export const uiTranslations = ${JSON.stringify(data.uiTranslations, null, 2)};\n\n`;
        content += `export const gameCategoryTranslations = ${JSON.stringify(data.gameCategoryTranslations, null, 2)};\n\n`;
        content += `export const gameModeTranslations = ${JSON.stringify(data.gameModeTranslations, null, 2)};\n\n`;
        content += `type Celebrity = { name: string; gender: 'male' | 'female' };\ntype MfkCategory = {\n    [category: string]: {\n        celebrities: Celebrity[];\n    }\n};\n`;
        content += `export const mfkCelebrities: { [lang: string]: MfkCategory } = ${JSON.stringify(data.mfkCelebrities, null, 2)};\n`;
        return content;
    }

    if (!isAuthenticated) return null;

    const renderSection = () => {
        // UI Translations
        if (activeSection === 'ui') {
            const filteredKeys = Object.keys(data.uiTranslations[defaultLang]).filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Search keys..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="admin-input mb-4" />
                    {filteredKeys.map(key => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <label className="font-mono text-sm text-gray-400">{key}</label>
                            <input type="text" value={data.uiTranslations[selectedLanguage]?.[key] || ''} onChange={e => handleDataChange(['uiTranslations', selectedLanguage, key], e.target.value)} className="admin-input" />
                        </div>
                    ))}
                </div>
            );
        }
        // Questions
        if (activeSection === 'questions') {
            const currentQuestions = data.questionTranslations[selectedLanguage]?.[selectedGameMode] || [];
            return (
                <div>
                    <select value={selectedGameMode} onChange={e => setSelectedGameMode(e.target.value as GameMode)} className="admin-select mb-6">
                        {Object.values(GameMode).map(mode => <option key={mode} value={mode}>{mode}</option>)}
                    </select>
                    <div className="space-y-6">
                        {currentQuestions.map((q: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <textarea value={q.text || q.word} onChange={e => handleDataChange(['questionTranslations', selectedLanguage, selectedGameMode, index, q.text ? 'text' : 'word'], e.target.value)} className="admin-textarea h-24" />
                                {q.category && <input type="text" value={q.category} onChange={e => handleDataChange(['questionTranslations', selectedLanguage, selectedGameMode, index, 'category'], e.target.value)} className="admin-input mt-2" placeholder="Category"/>}
                                {q.type === QuestionType.MULTIPLE_CHOICE && (
                                    <div className="mt-2 space-y-2">
                                        {q.options.map((opt: string, optIndex: number) => (
                                            <input key={optIndex} type="text" value={opt} onChange={e => handleDataChange(['questionTranslations', selectedLanguage, selectedGameMode, index, 'options', optIndex], e.target.value)} className="admin-input" />
                                        ))}
                                        <input type="text" value={q.correctAnswer} onChange={e => handleDataChange(['questionTranslations', selectedLanguage, selectedGameMode, index, 'correctAnswer'], e.target.value)} className="admin-input mt-2 border-green-500" placeholder="Correct Answer"/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        // ... other sections can be implemented similarly
        return <p>Section coming soon.</p>;
    }

    return (
        <div className="p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-cyan-400">ShotsUp! Admin</h1>
                <div className="flex items-center gap-4">
                    <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className="admin-select w-40">
                        {Object.entries(languages).map(([key, { name, flag }]) => <option key={key} value={key}>{flag} {name}</option>)}
                    </select>
                    <button onClick={() => setIsExporting(true)} className="admin-button-green">Export Configuration</button>
                </div>
            </header>

            <nav className="flex flex-wrap gap-2 mb-8">
                {(Object.keys({ui:0, gamemodes:0, categories:0, questions:0, wheel:0, mfk:0}) as NavSection[]).map(section => (
                    <button key={section} onClick={() => setActiveSection(section)} className={`nav-button ${activeSection === section ? 'active' : ''}`}>{section.charAt(0).toUpperCase() + section.slice(1)}</button>
                ))}
            </nav>

            <main>
                {renderSection()}
            </main>

            {isExporting && (
                <div className="modal-backdrop">
                    <div className="modal-content bg-gray-900 rounded-lg shadow-2xl flex flex-col p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4">Generated Configuration Files</h2>
                        <div className="flex-grow overflow-y-auto space-y-4">
                            <div>
                                <h3 className="font-bold text-lg text-pink-400">translations.ts</h3>
                                <textarea readOnly value={generateTranslationsFile()} className="admin-textarea h-96"></textarea>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-pink-400">questions.ts</h3>
                                <textarea readOnly value={generateQuestionsFile()} className="admin-textarea h-96"></textarea>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-pink-400">constants.ts</h3>
                                <textarea readOnly value={generateConstantsFile()} className="admin-textarea h-96"></textarea>
                            </div>
                        </div>
                        <button onClick={() => setIsExporting(false)} className="admin-button-red mt-4 self-center">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error("Could not find root element to mount to");
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
});
