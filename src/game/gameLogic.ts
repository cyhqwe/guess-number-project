import type { Difficulty, DistanceBand, GameState, GuessEntry, GuessRelation, SubmitResult } from './gameTypes';
import { distanceLabels, relationLabels } from './gameTypes';

type RandomSource = () => number;

export function randomIntInRange(min: number, max: number, random: RandomSource = Math.random): number {
  const sample = random();
  if (sample >= min && sample <= max && Number.isInteger(sample)) {
    return sample;
  }

  return Math.floor(sample * (max - min + 1)) + min;
}

export function createGame(difficulty: Difficulty, random: RandomSource = Math.random): GameState {
  return {
    secret: randomIntInRange(difficulty.min, difficulty.max, random),
    difficulty,
    guesses: [],
    status: 'playing',
    message: `系统已上线。输入 ${difficulty.min}-${difficulty.max} 之间的整数开始破解。`,
    lastDistanceBand: null,
  };
}

export function changeDifficulty(_state: GameState, difficulty: Difficulty, random: RandomSource = Math.random): GameState {
  return createGame(difficulty, random);
}

export function getDistanceBand(secret: number, guess: number, difficulty: Difficulty): DistanceBand {
  if (guess === secret) return 'exact';

  const range = difficulty.max - difficulty.min + 1;
  const distanceRatio = Math.abs(secret - guess) / range;

  if (distanceRatio <= 0.05) return 'hot';
  if (distanceRatio <= 0.2) return 'warm';
  return 'cold';
}

function parseGuess(rawValue: string, difficulty: Difficulty): { value?: number; error?: string } {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return { error: `请输入 ${difficulty.min}-${difficulty.max} 之间的整数。` };
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return { error: '只能输入整数数字。' };
  }

  const value = Number(trimmed);

  if (value < difficulty.min || value > difficulty.max) {
    return { error: `数值超出范围。请输入 ${difficulty.min}-${difficulty.max} 之间的整数。` };
  }

  return { value };
}

function buildMessage(relation: GuessRelation, distanceBand: DistanceBand, value: number): string {
  if (relation === 'correct') {
    return `破解成功！隐藏数字就是 ${value}。`;
  }

  const relationText = relationLabels[relation];
  const distanceText = distanceLabels[distanceBand];
  const direction = relation === 'low' ? '目标信号更高。' : '目标信号更低。';

  return `数值${relationText}，${distanceText}。${direction}`;
}

export function submitGuess(state: GameState, rawValue: string): SubmitResult {
  if (state.status !== 'playing') {
    return {
      accepted: false,
      state: {
        ...state,
        message: '本局已经结束。开启新一局后继续破解。',
      },
    };
  }

  const parsed = parseGuess(rawValue, state.difficulty);

  if (parsed.error || parsed.value === undefined) {
    return {
      accepted: false,
      state: {
        ...state,
        message: parsed.error ?? '输入无效。',
      },
    };
  }

  const value = parsed.value;
  const duplicate = state.guesses.some((guess) => guess.value === value);

  if (duplicate) {
    return {
      accepted: false,
      state: {
        ...state,
        message: `你已经尝试过 ${value}。换一个数字继续。`,
      },
    };
  }

  const relation: GuessRelation = value === state.secret ? 'correct' : value < state.secret ? 'low' : 'high';
  const distanceBand = getDistanceBand(state.secret, value, state.difficulty);
  const remainingAttempts = state.difficulty.maxAttempts - state.guesses.length - 1;
  const entry: GuessEntry = { value, relation, distanceBand, remainingAttempts };
  const guesses = [...state.guesses, entry];
  const won = relation === 'correct';
  const lost = !won && remainingAttempts === 0;

  return {
    accepted: true,
    state: {
      ...state,
      guesses,
      status: won ? 'won' : lost ? 'lost' : 'playing',
      message: lost ? `破解失败。正确数字是 ${state.secret}。` : buildMessage(relation, distanceBand, value),
      lastDistanceBand: distanceBand,
    },
  };
}
