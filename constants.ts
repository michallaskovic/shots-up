import { GameMode, GameModeStatus } from './types';

export const GAME_MODE_STATUSES: GameModeStatus[] = [
    'available',
    'locked',
    'coming_soon',
    'demo',
    'beta',
    'test'
];

export type GameCategoryInfo = {
    id: string;
    name: string;
    icon: string;
    color: string;
};

export type GameModeInfo = {
    id: GameMode;
    name: string;
    description: string;
    iconId: string;
    status: GameModeStatus;
    categoryId: string;
    details: {
        environment: 'local' | 'online' | 'both';
        players: string;
        rewardType: 'points' | 'drinks' | 'none' | 'both';
        roundBased: boolean;
        votable: boolean;
    };
};

export type WheelSegment = {
    type: 'points' | 'bankrupt' | 'extra_turn' | 'drink' | 'neighbor_drinks' | 'social' | 'lose_turn' | 'donate_points';
    value?: number;
    label: string;
    color: 'cyan' | 'pink' | 'gray';
};

export const SIPS_WHEEL_SEGMENTS: WheelSegment[] = [
    { type: 'points', value: 500, label: '500', color: 'pink' },
    { type: 'drink', value: 1, label: 'wheelDrink', color: 'pink' },
    { type: 'points', value: 300, label: '300', color: 'cyan' },
    { type: 'lose_turn', label: 'wheelPass', color: 'gray' },
    { type: 'points', value: 150, label: '150', color: 'cyan' },
    { type: 'extra_turn', label: 'wheelExtraTurn', color: 'cyan' },
    { type: 'points', value: 200, label: '200', color: 'cyan' },
    { type: 'social', label: 'wheelCheers', color: 'pink' },
    { type: 'points', value: 400, label: '400', color: 'cyan' },
    { type: 'bankrupt', label: 'wheelBankrupt', color: 'gray' },
    { type: 'donate_points', label: 'wheelDonatePoints', color: 'pink' },
    { type: 'points', value: 250, label: '250', color: 'cyan' },
    { type: 'neighbor_drinks', label: 'wheelNeighborDrinks', color: 'cyan' },
    { type: 'points', value: 1000, label: '1000', color: 'pink' },
    { type: 'points', value: 350, label: '350', color: 'cyan' },
    { type: 'points', value: 100, label: '100', color: 'cyan' },
];

export const POINTS_WHEEL_SEGMENTS: WheelSegment[] = [
    { type: 'points', value: 500, label: '500', color: 'pink' },
    { type: 'points', value: 600, label: '600', color: 'cyan' },
    { type: 'points', value: 300, label: '300', color: 'cyan' },
    { type: 'lose_turn', label: 'wheelPass', color: 'gray' },
    { type: 'points', value: 150, label: '150', color: 'cyan' },
    { type: 'extra_turn', label: 'wheelExtraTurn', color: 'cyan' },
    { type: 'points', value: 200, label: '200', color: 'cyan' },
    { type: 'points', value: 750, label: '750', color: 'pink' },
    { type: 'points', value: 400, label: '400', color: 'cyan' },
    { type: 'bankrupt', label: 'wheelBankrupt', color: 'gray' },
    { type: 'points', value: 1500, label: '1500', color: 'pink' },
    { type: 'points', value: 250, label: '250', color: 'cyan' },
    { type: 'points', value: 850, label: '850', color: 'cyan' },
    { type: 'points', value: 1000, label: '1000', color: 'pink' },
    { type: 'points', value: 350, label: '350', color: 'cyan' },
    { type: 'points', value: 100, label: '100', color: 'cyan' },
];

export const getWheelSegments = (scoringSystem: 'points' | 'sips' | undefined): WheelSegment[] => {
    if (scoringSystem === 'points') {
        return POINTS_WHEEL_SEGMENTS;
    }
    return SIPS_WHEEL_SEGMENTS; // Default to sips if undefined or 'sips'
};


export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 10;
export const IMPOSTOR_MIN_PLAYERS = 2;
export const ROUNDS_IN_TRUTH_OR_LIE = 10;
export const HANGMAN_MISTAKES_LIMIT = 6;
export const HEADS_UP_ROUND_DURATION = 60;