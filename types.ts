export interface Player {
  uid: string; // Firebase Auth User ID
  id: number; // In-game player index
  name: string;
  drinks: number;
  score: number;
  gender?: 'male' | 'female' | 'na';
}

export enum GameMode {
  SOFT = "SOFT",
  WILD = "WILD",
  COUPLES = "COUPLES",
  MOST_LIKELY = "MOST_LIKELY",
  LIST_THREE = "LIST_THREE",
  SPICY_COUPLES = "SPICY_COUPLES",
  TRUTH_OR_LIE = "TRUTH_OR_LIE",
  WHEEL_OF_FORTUNE = "WHEEL_OF_FORTUNE",
  HANGMAN = "HANGMAN",
  LYRIC_MASTER = "LYRIC_MASTER",
  HEADS_UP = "HEADS_UP",
  SPIN_AND_ASK = "SPIN_AND_ASK",
  IMPOSTOR = "IMPOSTOR",
  NEVER_HAVE_I_EVER = "NEVER_HAVE_I_EVER",
  NEVER_HAVE_I_EVER_SPICY = "NEVER_HAVE_I_EVER_SPICY",
  MFK = "MFK",
}

export type GameModeStatus = 'available' | 'locked' | 'coming_soon' | 'demo' | 'beta' | 'test';

export enum GameStatus {
  LOBBY = "LOBBY",
  WAITING_ROOM = "WAITING_ROOM",
  CATEGORY_SELECTION = "CATEGORY_SELECTION",
  MODE_SELECTION = "MODE_SELECTION",
  GAME_SETUP = "GAME_SETUP",
  SCORING_SELECTION = "SCORING_SELECTION",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

export enum QuestionType {
  TASK_OR_DRINK = 'TASK_OR_DRINK',
  PLAYER_VOTE = 'PLAYER_VOTE',
  TRUE_FALSE = 'TRUE_FALSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface Question {
  text: string;
  type: QuestionType;
  answer?: boolean; // Only for TRUE_FALSE type
  explanation?: string; // Explanation for TRUE_FALSE questions
  options?: string[]; // For MULTIPLE_CHOICE type
  correctAnswer?: string; // For MULTIPLE_CHOICE type
}

export interface WordWithCategory {
  word: string;
  category: string;
}

export interface ImpostorCategory {
  category: string;
  words: string[];
}

export interface SolveAttempt {
  playerName: string;
  attempt: string;
  isCorrect: boolean;
}

export interface HeadsUpState {
  currentGuesserId: string;
  guesserOrder: string[];
  currentGuesserIndex: number;
  words: WordWithCategory[];
  currentWordIndex: number;
  roundScores: Record<string, number>; // uid -> score in this specific round
  correctWords: WordWithCategory[];
  passedWords: WordWithCategory[];
  timer: number;
  roundPhase: 'GET_READY' | 'PLAYING' | 'SUMMARY';
}

export interface SpinAndAskState {
  phase: 'AWAITING_SPIN' | 'SPINNING' | 'AWAITING_RESPONDER_CHOICE' | 'AWAITING_QUESTIONER_INPUT' | 'AWAITING_RESPONDER_ACTION';
  spinnerId: string | null;
  questionerId: string | null;
  responderId: string | null;
  responderChoice: 'truth' | 'dare' | null;
  questionFrom?: 'player' | 'system';
  targetRotation?: number;
}

export interface ImpostorState {
  phase: 'ROLE_REVEAL' | 'WORD_SUBMISSION' | 'VOTING' | 'ELIMINATION' | 'GAME_OVER';
  impostorUids: string[];
  category: string;
  secretWord: string;
  submissions: Record<string, string>; // uid -> word
  votes: Record<string, string>; // voter_uid -> voted_uid
  eliminatedPlayers: (Player & { role: 'AGENT' | 'IMPOSTOR' })[];
  winner: 'AGENTS' | 'IMPOSTORS' | null;
  round: number;
  revealIndex?: number; // for local game
  lastEliminated?: (Player & { role: 'AGENT' | 'IMPOSTOR' }) | null;
}

export interface NeverHaveIEverState {
  phase: 'INPUT' | 'RESPONSE' | 'RESULTS';
  authorId: string;
  statement: string | null;
  responses: Record<string, boolean>; // uid -> hasDoneIt
  confessors: string[];
}

export interface MfkState {
  phase: 'CATEGORY_SELECTION' | 'CHOOSING' | 'RESULTS';
  chooserId: string;
  categories: string[];
  selectedCategory?: string;
  candidates: string[]; // array of celebrity names
  choices: {
    marry: string | null;
    fuck: string | null;
    kill: string | null;
  };
  turnOrder: string[];
  currentTurnIndex: number;
}


export interface Room {
  id: string;
  status: GameStatus;
  hostId: string;
  players: Player[];
  gameCategory: string | null;
  gameMode: GameMode | null;
  scoringSystem?: 'points' | 'sips';
  currentPlayerIndex: number;
  currentQuestion: Question | null;
  usedQuestions: Record<GameMode, number[]>;
  countdown: number;
  countdownStart: boolean;
  penalty: number;
  challengeAccepted: boolean;
  answerFeedback: 'correct' | 'incorrect' | null;
  currentRound: number;
  roundLimit: number | null;
  secretWord: WordWithCategory | null;
  usedWords: number[];
  guessedLetters: string[]; // Storing as array for Firestore
  isSpinning: boolean;
  turnPhase: 'ACTION' | 'SPIN' | 'GUESS';
  lastSpinResult: any | null; // Storing as any for Firestore
  targetRotation: number;
  votes: Record<string, string | null>; // Player UID to Voted Player UID
  votingResult: { drinkers: Player[]; tally: Record<string, number> } | null;
  hangmanMasterId: number | null;
  hangmanTurnPhase: 'WORD_CREATION' | 'GUESSING' | 'ROUND_OVER';
  incorrectGuesses: string[]; // Storing as array for Firestore
  roundWinner: 'master' | 'guessers' | null;
  lastSolveAttempt: SolveAttempt | null;
  lastAction?: { playerId: string; action: string } | null;
  currentVotesTally?: Record<string, number> | null;
  headsUpState: HeadsUpState | null;
  spinAndAskState: SpinAndAskState | null;
  impostorState: ImpostorState | null;
  neverHaveIEverState: NeverHaveIEverState | null;
  mfkState: MfkState | null;
  spinRequested?: boolean;
  lastLetterGuess?: { playerId: string; letter: string } | null;
  lastHangmanGuess?: { playerId: string; letter: string } | null;
  lastWordSubmission?: { playerId: string; word: string; category: string } | null;
  lastSolveRequest?: { playerId: string; attempt: string } | null;
  answerVotes?: Record<string, string | boolean>;
  answerVoteResult?: {
    correctAnswer: string | boolean;
    results: { uid: string, name: string, isCorrect: boolean }[];
  } | null;
}