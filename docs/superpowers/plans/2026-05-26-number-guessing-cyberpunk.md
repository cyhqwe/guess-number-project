# 数字迷城 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite React TypeScript browser number guessing game with Simplified Chinese cyberpunk UI, pure game logic, tests, and a runnable local workflow.

**Architecture:** Scaffold a standard Vite React app, keep game rules in pure functions under `src/game`, and compose focused React components in `src/components`. `App.tsx` owns only UI state wiring while CSS handles the cyberpunk HUD visual system and responsive layout.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS.

---

## File Structure

- Create `package.json`: npm scripts and dependencies.
- Create `index.html`: Vite app shell with Simplified Chinese lang and viewport meta.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript and test setup.
- Create `src/main.tsx`: React entry point.
- Create `src/App.tsx`: top-level game state and component composition.
- Create `src/styles.css`: global cyberpunk UI, responsive layout, focus and reduced-motion states.
- Create `src/game/gameTypes.ts`: domain types, difficulty constants, display labels.
- Create `src/game/gameLogic.ts`: pure game creation and state transitions.
- Create `src/game/gameLogic.test.ts`: unit tests for the game rules.
- Create `src/components/DifficultySelector.tsx`: segmented difficulty selector.
- Create `src/components/GuessForm.tsx`: accessible input and submit form.
- Create `src/components/FeedbackPanel.tsx`: current feedback and signal meter.
- Create `src/components/StatsPanel.tsx`: range, attempts, status, and reset action.
- Create `src/components/HistoryList.tsx`: guess history.
- Create `README.md`: local setup and scripts.

## Task 1: Scaffold Vite React TypeScript Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package and config files**

Create `package.json`:

```json
{
  "name": "guess-number-project",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^latest",
    "vite": "^latest",
    "typescript": "^latest",
    "react": "^latest",
    "react-dom": "^latest",
    "lucide-react": "^latest"
  },
  "devDependencies": {
    "vitest": "^latest",
    "@testing-library/react": "^latest",
    "@testing-library/jest-dom": "^latest",
    "@types/react": "^latest",
    "@types/react-dom": "^latest",
    "jsdom": "^latest"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="数字迷城，一个赛博朋克风格的网页数字猜谜游戏。" />
    <title>数字迷城</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 2: Create temporary React shell**

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>数字迷城</h1>
      <p>初始化中。</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #e2e8f0;
  background: #070a12;
  font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Verify scaffold builds**

Run: `npm run build`

Expected: TypeScript and Vite build pass, producing `dist/`.

## Task 2: Implement Pure Game Logic With Tests

**Files:**
- Create: `src/game/gameTypes.ts`
- Create: `src/game/gameLogic.ts`
- Create: `src/game/gameLogic.test.ts`

- [ ] **Step 1: Write game types**

Create `src/game/gameTypes.ts`:

```ts
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
```

- [ ] **Step 2: Write tests before implementation**

Create `src/game/gameLogic.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/game/gameLogic.test.ts`

Expected: FAIL because `src/game/gameLogic.ts` does not exist yet.

- [ ] **Step 4: Implement game logic**

Create `src/game/gameLogic.ts`:

```ts
import type { Difficulty, DistanceBand, GameState, GuessEntry, GuessRelation, SubmitResult } from './gameTypes';
import { distanceLabels, relationLabels } from './gameTypes';

type RandomSource = (() => number) | (() => number);

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
```

- [ ] **Step 5: Run tests to verify logic**

Run: `npm test -- src/game/gameLogic.test.ts`

Expected: PASS for all game logic tests.

## Task 3: Build React Components and Wire App State

**Files:**
- Create: `src/components/DifficultySelector.tsx`
- Create: `src/components/GuessForm.tsx`
- Create: `src/components/FeedbackPanel.tsx`
- Create: `src/components/StatsPanel.tsx`
- Create: `src/components/HistoryList.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create difficulty selector**

Create `src/components/DifficultySelector.tsx`:

```tsx
import type { Difficulty, DifficultyId } from '../game/gameTypes';

type DifficultySelectorProps = {
  difficulties: Difficulty[];
  activeId: DifficultyId;
  onChange: (difficulty: Difficulty) => void;
};

export function DifficultySelector({ difficulties, activeId, onChange }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector" aria-label="选择难度">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty.id}
          type="button"
          className="difficulty-button"
          aria-pressed={difficulty.id === activeId}
          onClick={() => onChange(difficulty)}
        >
          <span>{difficulty.label}</span>
          <small>
            {difficulty.min}-{difficulty.max} / {difficulty.maxAttempts} 次
          </small>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create guess form**

Create `src/components/GuessForm.tsx`:

```tsx
import { FormEvent, useEffect, useRef, useState } from 'react';
import type { GameState } from '../game/gameTypes';

type GuessFormProps = {
  game: GameState;
  onSubmit: (value: string) => boolean;
};

export function GuessForm({ game, onSubmit }: GuessFormProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = game.status !== 'playing';

  useEffect(() => {
    setValue('');
    inputRef.current?.focus();
  }, [game.secret, game.difficulty.id]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accepted = onSubmit(value);
    if (accepted) {
      setValue('');
    }
    inputRef.current?.focus();
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <label htmlFor="guess-input">输入你的破解数字</label>
      <div className="guess-row">
        <input
          ref={inputRef}
          id="guess-input"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          min={game.difficulty.min}
          max={game.difficulty.max}
          disabled={disabled}
          placeholder={`${game.difficulty.min}-${game.difficulty.max}`}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" disabled={disabled}>
          提交猜测
        </button>
      </div>
      <p className="form-hint">
        范围 {game.difficulty.min}-{game.difficulty.max}，按 Enter 也可以提交。
      </p>
    </form>
  );
}
```

- [ ] **Step 3: Create feedback panel**

Create `src/components/FeedbackPanel.tsx`:

```tsx
import type { GameState } from '../game/gameTypes';
import { distanceLabels } from '../game/gameTypes';

const signalWidth = {
  cold: '28%',
  warm: '62%',
  hot: '88%',
  exact: '100%',
};

type FeedbackPanelProps = {
  game: GameState;
};

export function FeedbackPanel({ game }: FeedbackPanelProps) {
  const band = game.lastDistanceBand ?? 'cold';
  const title = game.status === 'won' ? '破解成功' : game.status === 'lost' ? '连接断开' : '信号追踪中';

  return (
    <section className={`panel feedback-panel status-${game.status}`} aria-live="polite">
      <div className="panel-kicker">信号反馈</div>
      <h2>{title}</h2>
      <p>{game.message}</p>
      <div className="signal-meter" aria-label={`距离提示：${game.lastDistanceBand ? distanceLabels[game.lastDistanceBand] : '等待输入'}`}>
        <span style={{ width: signalWidth[band] }} />
      </div>
      <div className="signal-labels" aria-hidden="true">
        <span>冰冷</span>
        <span>温热</span>
        <span>炽热</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create stats panel**

Create `src/components/StatsPanel.tsx`:

```tsx
import type { GameState } from '../game/gameTypes';

type StatsPanelProps = {
  game: GameState;
  onReset: () => void;
};

export function StatsPanel({ game, onReset }: StatsPanelProps) {
  const remaining = game.difficulty.maxAttempts - game.guesses.length;

  return (
    <aside className="stats-grid" aria-label="游戏状态">
      <section className="stat-card">
        <span>剩余机会</span>
        <strong>{remaining}</strong>
        <small>共 {game.difficulty.maxAttempts} 次</small>
      </section>
      <section className="stat-card">
        <span>扫描范围</span>
        <strong>
          {game.difficulty.min}-{game.difficulty.max}
        </strong>
        <small>{game.difficulty.label}模式</small>
      </section>
      <section className={`stat-card status-card status-${game.status}`}>
        <span>当前状态</span>
        <strong>{game.status === 'playing' ? '破解中' : game.status === 'won' ? '已破解' : '已失败'}</strong>
        <small>{game.guesses.length} 次尝试</small>
      </section>
      <button type="button" className="reset-button" onClick={onReset}>
        开启新一局
      </button>
    </aside>
  );
}
```

- [ ] **Step 5: Create history list**

Create `src/components/HistoryList.tsx`:

```tsx
import type { GameState } from '../game/gameTypes';
import { distanceLabels, relationLabels } from '../game/gameTypes';

type HistoryListProps = {
  game: GameState;
};

export function HistoryList({ game }: HistoryListProps) {
  return (
    <section className="panel history-panel">
      <div className="panel-kicker">尝试记录</div>
      {game.guesses.length === 0 ? (
        <p className="empty-history">暂无记录。输入第一个数字开始追踪信号。</p>
      ) : (
        <ol>
          {[...game.guesses].reverse().map((guess, index) => (
            <li key={`${guess.value}-${game.guesses.length - index}`} className={`history-row relation-${guess.relation}`}>
              <span className="guess-value">{guess.value}</span>
              <span>{relationLabels[guess.relation]}</span>
              <span>{distanceLabels[guess.distanceBand]}</span>
              <small>剩余 {guess.remainingAttempts}</small>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
```

- [ ] **Step 6: Wire components in App**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { DifficultySelector } from './components/DifficultySelector';
import { FeedbackPanel } from './components/FeedbackPanel';
import { GuessForm } from './components/GuessForm';
import { HistoryList } from './components/HistoryList';
import { StatsPanel } from './components/StatsPanel';
import { changeDifficulty, createGame, submitGuess } from './game/gameLogic';
import { DIFFICULTIES, type Difficulty } from './game/gameTypes';

export default function App() {
  const difficulties = useMemo(() => Object.values(DIFFICULTIES), []);
  const [game, setGame] = useState(() => createGame(DIFFICULTIES.normal));

  function handleDifficultyChange(difficulty: Difficulty) {
    setGame((current) => changeDifficulty(current, difficulty));
  }

  function handleReset() {
    setGame((current) => createGame(current.difficulty));
  }

  function handleSubmit(value: string) {
    const result = submitGuess(game, value);
    setGame(result.state);
    return result.accepted;
  }

  return (
    <main className="app-shell">
      <div className="scanline" aria-hidden="true" />
      <header className="hero-panel">
        <div>
          <p className="eyebrow">NUMBER GRID // 数字迷城</p>
          <h1>破解隐藏数字</h1>
          <p className="hero-copy">在有限次数内追踪信号：偏高、偏低、冰冷、温热、炽热，直到命中目标。</p>
        </div>
        <DifficultySelector difficulties={difficulties} activeId={game.difficulty.id} onChange={handleDifficultyChange} />
      </header>

      <div className="game-layout">
        <div className="play-column">
          <FeedbackPanel game={game} />
          <GuessForm game={game} onSubmit={handleSubmit} />
        </div>
        <div className="side-column">
          <StatsPanel game={game} onReset={handleReset} />
          <HistoryList game={game} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Run tests and build**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

## Task 4: Apply Cyberpunk Chinese Styling

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Replace CSS with final design**

Replace `src/styles.css`:

```css
:root {
  --bg: #070a12;
  --bg-2: #0b1020;
  --surface: rgba(15, 23, 42, 0.92);
  --surface-strong: rgba(17, 24, 39, 0.98);
  --cyan: #22d3ee;
  --cyan-soft: rgba(34, 211, 238, 0.22);
  --magenta: #f43f5e;
  --green: #a3e635;
  --amber: #f59e0b;
  --red: #ef4444;
  --text: #f8fafc;
  --muted: #94a3b8;
  --line: rgba(148, 163, 184, 0.26);
  --shadow-cyan: 0 0 24px rgba(34, 211, 238, 0.22);
  --shadow-magenta: 0 0 24px rgba(244, 63, 94, 0.2);
  color: var(--text);
  background: var(--bg);
  font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--bg);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.16), transparent 34rem),
    radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.15), transparent 30rem),
    linear-gradient(135deg, #070a12 0%, #0b1020 55%, #111827 100%);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled,
input:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--green);
  outline-offset: 3px;
}

.app-shell {
  position: relative;
  isolation: isolate;
  width: min(1180px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 28px;
}

.scanline {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.035),
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px,
    transparent 7px
  );
  opacity: 0.35;
}

.hero-panel,
.panel,
.guess-form,
.stat-card,
.reset-button {
  border: 1px solid var(--line);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(8, 13, 28, 0.94));
  box-shadow: var(--shadow-cyan), inset 0 0 22px rgba(34, 211, 238, 0.04);
  backdrop-filter: blur(14px);
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 22px;
  border-color: rgba(34, 211, 238, 0.5);
  border-radius: 18px;
}

.eyebrow,
.panel-kicker,
.stat-card span {
  margin: 0;
  color: var(--cyan);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 10px;
  font-size: clamp(2.1rem, 6vw, 4.6rem);
  line-height: 1;
  text-shadow: 0 0 22px rgba(34, 211, 238, 0.36);
}

h2 {
  margin-bottom: 12px;
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.08;
}

.hero-copy,
.feedback-panel p,
.form-hint,
.empty-history,
.stat-card small {
  color: var(--muted);
  line-height: 1.65;
}

.difficulty-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(88px, 1fr));
  gap: 8px;
  min-width: min(370px, 100%);
}

.difficulty-button {
  min-height: 58px;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.86);
  color: var(--text);
  transition: border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.difficulty-button span,
.difficulty-button small {
  display: block;
}

.difficulty-button small {
  margin-top: 4px;
  color: var(--muted);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: 0.72rem;
}

.difficulty-button[aria-pressed="true"] {
  border-color: var(--cyan);
  color: var(--cyan);
  box-shadow: 0 0 18px rgba(34, 211, 238, 0.28);
}

.difficulty-button:hover {
  transform: translateY(-1px);
  border-color: var(--green);
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) minmax(280px, 0.86fr);
  gap: 18px;
  margin-top: 18px;
}

.play-column,
.side-column {
  display: grid;
  align-content: start;
  gap: 18px;
}

.panel,
.guess-form,
.stat-card {
  border-radius: 16px;
  padding: 20px;
}

.feedback-panel {
  min-height: 288px;
  border-color: rgba(34, 211, 238, 0.48);
}

.feedback-panel.status-won {
  border-color: rgba(163, 230, 53, 0.7);
  box-shadow: 0 0 26px rgba(163, 230, 53, 0.22);
}

.feedback-panel.status-lost {
  border-color: rgba(239, 68, 68, 0.72);
  box-shadow: 0 0 26px rgba(239, 68, 68, 0.2);
}

.signal-meter {
  height: 16px;
  margin-top: 26px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.88);
}

.signal-meter span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--amber), var(--green));
  box-shadow: 0 0 20px rgba(163, 230, 53, 0.42);
  transition: width 220ms ease;
}

.signal-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--muted);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: 0.8rem;
}

.guess-form label {
  display: block;
  margin-bottom: 10px;
  color: var(--text);
  font-weight: 700;
}

.guess-row {
  display: flex;
  gap: 10px;
}

.guess-row input {
  width: 100%;
  min-height: 52px;
  border: 1px solid rgba(34, 211, 238, 0.62);
  border-radius: 12px;
  padding: 0 14px;
  background: rgba(2, 6, 23, 0.9);
  color: var(--text);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: 1.1rem;
}

.guess-row button,
.reset-button {
  min-height: 52px;
  border: 1px solid rgba(244, 63, 94, 0.72);
  border-radius: 12px;
  padding: 0 18px;
  background: linear-gradient(135deg, #f43f5e, #be123c);
  color: #fff;
  font-weight: 800;
  box-shadow: var(--shadow-magenta);
  transition: transform 180ms ease, filter 180ms ease;
  white-space: nowrap;
}

.guess-row button:hover,
.reset-button:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-card strong {
  display: block;
  margin: 8px 0 4px;
  color: var(--text);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: clamp(1.3rem, 4vw, 1.8rem);
}

.status-card.status-won strong {
  color: var(--green);
}

.status-card.status-lost strong {
  color: var(--red);
}

.reset-button {
  grid-column: 1 / -1;
}

.history-panel ol {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.history-row {
  display: grid;
  grid-template-columns: 64px 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 10px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.5);
}

.guess-value {
  color: var(--cyan);
  font-family: Consolas, "JetBrains Mono", monospace;
  font-size: 1.15rem;
  font-weight: 800;
}

.history-row.relation-correct {
  border-color: rgba(163, 230, 53, 0.58);
}

.history-row.relation-high {
  border-color: rgba(244, 63, 94, 0.4);
}

.history-row small {
  color: var(--muted);
}

@media (max-width: 820px) {
  .app-shell {
    padding: 16px;
  }

  .hero-panel,
  .game-layout {
    grid-template-columns: 1fr;
  }

  .difficulty-selector {
    min-width: 0;
  }
}

@media (max-width: 520px) {
  .hero-panel,
  .panel,
  .guess-form,
  .stat-card {
    border-radius: 12px;
    padding: 16px;
  }

  .difficulty-selector,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .guess-row {
    flex-direction: column;
  }

  .history-row {
    grid-template-columns: 52px 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 2: Build after styling**

Run: `npm run build`

Expected: PASS.

## Task 5: Add README and Final Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

Create `README.md`:

```markdown
# 数字迷城

一个赛博朋克风格的网页数字猜谜游戏。玩家在有限次数内猜出隐藏数字，系统会提示数值偏高、偏低，以及冰冷、温热、炽热的距离信号。

## 本地运行

```powershell
npm install
npm run dev
```

打开终端里显示的 Vite 地址。

## 常用命令

```powershell
npm test
npm run build
npm run preview
```

## 游戏范围

- 简单：1-50，10 次机会
- 普通：1-100，8 次机会
- 困难：1-500，10 次机会
```

- [ ] **Step 2: Run full verification**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Start local dev server**

Run: `npm run dev -- --port 5173`

Expected: Vite starts at `http://127.0.0.1:5173/` or reports the actual available port.

- [ ] **Step 4: Manual browser smoke check**

Open the dev URL and verify:

- The page is Simplified Chinese.
- Difficulty controls switch range and attempts.
- Invalid input shows a Chinese validation message and does not add history.
- A valid guess adds a history row.
- New game resets history.
- Layout remains usable at narrow width.

## Self-Review

- Spec coverage: all Stage 2 approved game, UI, accessibility, and test requirements are covered.
- Placeholder scan: no TODO/TBD placeholders remain.
- Type consistency: component props and game type names match across tasks.
- Scope check: no backend, persistence, accounts, multiplayer, or deployment steps are included.
