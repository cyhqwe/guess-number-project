import { describe, expect, it } from 'vitest';
import { DIFFICULTIES } from './gameTypes';
import {
  changeDifficulty,
  createGame,
  getDistanceBand,
  submitGuess,
} from './gameLogic';

const fixedSecret = (value: number) => () => value;

describe('gameLogic', () => {
  it('creates a game with a secret inside the difficulty range', () => {
    const state = createGame(DIFFICULTIES.normal, () => 0.42);

    expect(state.secret).toBeGreaterThanOrEqual(1);
    expect(state.secret).toBeLessThanOrEqual(100);
    expect(state.status).toBe('playing');
    expect(state.guesses).toHaveLength(0);
  });

  it('marks guesses as too low or too high', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));

    const low = submitGuess(state, '25').state;
    const high = submitGuess(low, '75').state;

    expect(low.guesses[0].relation).toBe('low');
    expect(high.guesses[1].relation).toBe('high');
  });

  it('wins immediately on a correct guess', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));
    const result = submitGuess(state, '50');

    expect(result.accepted).toBe(true);
    expect(result.state.status).toBe('won');
    expect(result.state.message).toContain('破解成功');
    expect(result.state.guesses[0].distanceBand).toBe('exact');
  });

  it('does not consume attempts for invalid input', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));

    const empty = submitGuess(state, '');
    const outOfRange = submitGuess(empty.state, '101');
    const decimal = submitGuess(outOfRange.state, '12.5');

    expect(empty.accepted).toBe(false);
    expect(outOfRange.accepted).toBe(false);
    expect(decimal.accepted).toBe(false);
    expect(decimal.state.guesses).toHaveLength(0);
  });

  it('does not consume attempts for duplicate guesses', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));
    const first = submitGuess(state, '40');
    const duplicate = submitGuess(first.state, '40');

    expect(first.accepted).toBe(true);
    expect(duplicate.accepted).toBe(false);
    expect(duplicate.state.guesses).toHaveLength(1);
    expect(duplicate.state.message).toContain('已经尝试过');
  });

  it('loses after the final wrong attempt and reveals the answer', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));
    let current = state;

    for (const value of ['1', '2', '3', '4', '5', '6', '7', '8']) {
      current = submitGuess(current, value).state;
    }

    expect(current.status).toBe('lost');
    expect(current.guesses).toHaveLength(8);
    expect(current.message).toContain('正确数字是 50');
  });

  it('switches difficulty and resets history', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));
    const guessed = submitGuess(state, '40').state;
    const changed = changeDifficulty(guessed, DIFFICULTIES.hard, fixedSecret(300));

    expect(changed.difficulty.id).toBe('hard');
    expect(changed.secret).toBe(300);
    expect(changed.guesses).toHaveLength(0);
    expect(changed.status).toBe('playing');
  });

  it('rejects guesses after a terminal state', () => {
    const state = createGame(DIFFICULTIES.normal, fixedSecret(50));
    const won = submitGuess(state, '50').state;
    const afterWon = submitGuess(won, '51');

    expect(afterWon.accepted).toBe(false);
    expect(afterWon.state.guesses).toHaveLength(1);
    expect(afterWon.state.message).toContain('开启新一局');
  });

  it('computes distance bands from range size', () => {
    expect(getDistanceBand(50, 50, DIFFICULTIES.normal)).toBe('exact');
    expect(getDistanceBand(50, 52, DIFFICULTIES.normal)).toBe('hot');
    expect(getDistanceBand(50, 65, DIFFICULTIES.normal)).toBe('warm');
    expect(getDistanceBand(50, 90, DIFFICULTIES.normal)).toBe('cold');
  });
});
