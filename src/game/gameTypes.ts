export type DifficultyId = 'easy' | 'normal' | 'hard';

export type Difficulty = {
  id: DifficultyId;
  label: string;
  min: number;
  max: number;
  maxAttempts: number;
};

export type GameStatus = 'playing' | 'won' | 'lost';
export type GuessRelation = 'low' | 'high' | 'correct';
export type DistanceBand = 'cold' | 'warm' | 'hot' | 'exact';

export type GuessEntry = {
  value: number;
  relation: GuessRelation;
  distanceBand: DistanceBand;
  remainingAttempts: number;
};

export type GameState = {
  secret: number;
  difficulty: Difficulty;
  guesses: GuessEntry[];
  status: GameStatus;
  message: string;
  lastDistanceBand: DistanceBand | null;
};

export type SubmitResult = {
  state: GameState;
  accepted: boolean;
};

export const DIFFICULTIES: Record<DifficultyId, Difficulty> = {
  easy: { id: 'easy', label: '简单', min: 1, max: 50, maxAttempts: 10 },
  normal: { id: 'normal', label: '普通', min: 1, max: 100, maxAttempts: 8 },
  hard: { id: 'hard', label: '困难', min: 1, max: 500, maxAttempts: 10 },
};

export const relationLabels: Record<GuessRelation, string> = {
  low: '偏低',
  high: '偏高',
  correct: '命中',
};

export const distanceLabels: Record<DistanceBand, string> = {
  cold: '冰冷',
  warm: '温热',
  hot: '炽热',
  exact: '破解',
};
