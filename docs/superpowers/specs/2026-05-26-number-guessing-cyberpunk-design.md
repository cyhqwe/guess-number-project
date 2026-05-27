# 数字迷城设计规格

Status: approved for Stage 2 implementation
Date: 2026-05-26
Project: browser-based number guessing game

## Goal

Build a polished browser game where the player guesses a hidden number, receives immediate feedback, and completes a full round through a compact, accessible, Simplified Chinese cyberpunk interface.

## Approved Direction

The app is a local single-player web game built with Vite, React, and TypeScript. It opens directly into the playable game, not a landing page.

The visual direction is **数字迷城**: a dark cyberpunk HUD with high-contrast panels, neon cyan structure, magenta primary actions, acid-green success and hot-signal accents, and restrained scanline/glow effects. All player-facing copy is Simplified Chinese.

## Product Scope

In scope:

- Difficulty modes:
  - 简单: 1-50, 10 attempts.
  - 普通: 1-100, 8 attempts.
  - 困难: 1-500, 10 attempts.
- Random secret number within the active difficulty range.
- Numeric guess input.
- Validation for empty, non-numeric, out-of-range, and duplicate guesses.
- Feedback after each valid guess:
  - 数值偏低.
  - 数值偏高.
  - 破解成功.
  - Cold, warm, hot distance hint in Chinese.
- Attempts remaining.
- Guess history with relation and distance hint.
- Win and loss states.
- New game/reset action.
- Responsive desktop and mobile layout.
- Keyboard support: Enter submits from the input.
- Accessibility basics: labels, visible focus, aria-live feedback, non-color-only status.
- Unit tests for pure game logic.
- Minimal README with local commands.

Out of scope:

- Backend.
- Database.
- Accounts.
- Persistence or high scores.
- Multiplayer.
- Sound effects.
- Complex animation system.
- Deployment during Stage 2.

## UX Layout

Use the selected **compact dashboard** structure.

Desktop:

- Header: game title, short subtitle, difficulty selector, new game action.
- Main left panel: prominent feedback, distance/signal meter, input, submit button.
- Right panel: range, attempts, status, and history.

Mobile:

- Single-column stack.
- Difficulty selector remains near the top.
- Feedback and input appear before stats and history.
- Controls keep at least 44px target height.
- No horizontal scrolling at 360px width.

## Visual System

Use a dark cyberpunk style without sacrificing readability.

Color roles:

- Background: near-black navy, e.g. `#070A12` / `#0B1020`.
- Surface: dark blue panels, e.g. `#101827`.
- Primary structure: neon cyan, e.g. `#22D3EE`.
- Primary action: magenta/rose, e.g. `#F43F5E`.
- Success/hot signal: acid green, e.g. `#A3E635`.
- Warning/near signal: amber/orange, e.g. `#F59E0B`.
- Error/loss: red, e.g. `#EF4444`.
- Text: high-contrast off-white, e.g. `#E2E8F0` and `#F8FAFC`.
- Muted text: readable slate, e.g. `#94A3B8`.

Typography:

- Player-facing Chinese text must be readable first. Use a Simplified Chinese-capable sans stack such as `Noto Sans SC`, `Microsoft YaHei`, system sans-serif.
- Numeric values and short HUD labels may use a monospace stack such as `JetBrains Mono`, `Consolas`, monospace.
- Avoid tiny body text. Base copy should be 16px or larger.

Effects:

- Use subtle scanline or grid texture through CSS.
- Use glow on borders, active states, and result banners.
- Animations must be short, optional, and respect `prefers-reduced-motion`.
- Do not use emoji as icons or status markers.
- Do not let glow reduce text contrast.

## Game Logic

Keep all state transitions in pure logic under `src/game`.

Core concepts:

- `Difficulty`: id, label, min, max, maxAttempts.
- `GuessEntry`: submitted number, relation, distance band, attempts remaining.
- `GameState`: secret, difficulty, guesses, status, message.

Rules:

- Creating a game generates one secret within the active range.
- Invalid input does not consume an attempt.
- Duplicate guesses do not consume an attempt.
- Correct guess sets the status to won.
- Wrong guess appends to history and consumes one attempt.
- The last wrong attempt sets the status to lost and reveals the answer.
- Won/lost games reject further guesses until reset.
- Changing difficulty starts a fresh game.

Distance hints:

- Use the difficulty range to compute distance ratio.
- `hot` for close guesses.
- `warm` for moderate distance.
- `cold` for far guesses.
- Render Chinese labels such as 冰冷, 温热, 炽热.

## Components

Recommended structure:

```text
src/
  App.tsx
  main.tsx
  styles.css
  game/
    gameTypes.ts
    gameLogic.ts
    gameLogic.test.ts
  components/
    DifficultySelector.tsx
    GuessForm.tsx
    FeedbackPanel.tsx
    StatsPanel.tsx
    HistoryList.tsx
```

Responsibilities:

- `gameTypes.ts`: shared game domain types and difficulty constants.
- `gameLogic.ts`: pure game creation, validation, submission, difficulty change, distance band functions.
- `gameLogic.test.ts`: Vitest coverage for core state transitions.
- `DifficultySelector.tsx`: segmented difficulty control.
- `GuessForm.tsx`: labeled number input and submit button.
- `FeedbackPanel.tsx`: current message, win/loss/active visual state, distance signal.
- `StatsPanel.tsx`: active range, attempts, game status, reset affordance as needed.
- `HistoryList.tsx`: previous guesses with high/low and distance labels.
- `App.tsx`: compose components and hold React state.

## Accessibility

- The input must have a visible label.
- Feedback changes must be announced with `aria-live="polite"`.
- Difficulty controls must expose selected state.
- Submit must work through Enter.
- Terminal win/loss state must be clear in text, not color alone.
- Focus rings must be visible against the dark background.
- Buttons and inputs should meet 44px minimum target height.

## Testing

Unit tests:

- Secret number is generated within range.
- Too-low and too-high guesses produce correct relation.
- Correct guess wins immediately.
- Invalid guesses do not consume attempts.
- Duplicate guesses do not consume attempts.
- Loss occurs after max attempts.
- Difficulty switching resets state.
- Terminal state rejects further guesses.

Manual verification after implementation:

- Play and win a round.
- Trigger out-of-range validation.
- Trigger duplicate validation.
- Lose a round and verify answer reveal.
- Switch difficulty and verify range/attempt changes.
- Test narrow mobile layout.
- Test keyboard-only flow.

## Developer Workflow

Expected commands:

```powershell
npm install
npm run dev
npm test
npm run build
```

The repository is currently not initialized as Git, so the brainstorming skill's commit step cannot be completed unless a Git repository is created later.

## Self-Review

- Placeholder scan: no TODO/TBD placeholders remain.
- Scope check: one frontend app only; no backend or persistence included.
- Consistency check: product scope matches Stage 1 autoplan with the approved cyberpunk Chinese UI adjustment.
- Ambiguity check: difficulty ranges, attempts, language, visual direction, and accessibility requirements are explicit.
