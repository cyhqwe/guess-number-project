# Number Guessing Game - Autoplan Review

Status: Stage 1 approved plan
Input design doc: docs/office-hours-design.md
Date: 2026-05-26

## Plan Summary

Build a polished browser-based number guessing game using Vite, React, and TypeScript. The product scope is deliberately local and single-player, with difficulty modes, immediate feedback, attempt history, responsive UI, accessibility basics, and tests for core game logic.

The repository is currently empty and not initialized as a Git repository. Stage 2 should scaffold the app from scratch and may initialize Git only if the user wants that included in the implementation phase.

## Original Plan State

User requested a strict three-stage workflow:

1. Stage 1: gstack office-hours to autoplan, lock the solution.
2. Stage 2: after context compaction, Superpowers brainstorming to writing-plans to executing-plans, implement code.
3. Stage 3: after context compaction, gstack review to qa to ship, deliver.

This document completes Stage 1 only. No implementation code should be added in this stage.

## Decision Principles Used

1. User value first: make the game feel complete, not just technically functional.
2. Scope discipline: avoid backend and persistence in v1.
3. Simplicity with structure: use a modern frontend stack, but keep modules small.
4. Test risky logic: validate game state transitions independently from UI.
5. Accessibility from the start: keyboard flow and live feedback are part of the baseline.
6. QA readiness: design features so final browser testing has clear paths to verify.

## CEO Review - Strategy & Scope

### Premise Challenge

The strongest version of this project is not "guess a number" as a programming exercise. It is a small complete product that demonstrates the workflow the user wants to practice. That means the scope should include enough UI and state complexity to justify planning, execution, review, and QA.

The plan should resist two bad extremes:

- Too small: one HTML page with prompt/alert behavior would not be worth a full gstack/Superpowers lifecycle.
- Too large: accounts, leaderboards, databases, and multiplayer would turn a learning project into infrastructure work.

### Dream State Delta

Current state: empty folder, no repository metadata, no app, no tests.

Dream state after Stage 2: a runnable Vite React app with a satisfying game loop, typed logic, focused tests, and a clear local development workflow.

Dream state after Stage 3: reviewed, QA-tested, and ready for local use or static deployment.

### What Already Exists

- Workspace folder: `D:\Python\CyhAIProject\guess-number-project`
- `docs/office-hours-design.md`
- `docs/autoplan-review.md`
- Node, npm, Python, and Git are available on the machine.

### NOT In Scope

- Backend API.
- Database.
- Authentication.
- Persistent high scores.
- External AI features.
- Multiplayer.
- Production deployment during Stage 2.

### CEO Score

8.5/10. The plan is appropriately scoped for a small project, but still has enough product completeness to be worth the full workflow. The main open risk is visual taste, which should be handled during implementation and QA rather than solved in Stage 1.

## Design Review

UI scope is present, so design review applies.

### Design Direction

The app should open directly into the playable game. No landing page. The interface should be compact, readable, and game-like without becoming decorative.

Expected layout:

- Top bar: title, difficulty selector, reset/new game control.
- Main play region: current feedback, input, submit action.
- Status region: range, attempts remaining, win/loss state.
- History region: previous guesses with too-high/too-low markers and distance hints.

### Visual Requirements

- Use responsive layout that works around 360px mobile width and common desktop widths.
- Use stable dimensions for controls and history rows to avoid layout jump.
- Use clear colors for state:
  - Neutral: ready to guess.
  - Warning: invalid input or few attempts left.
  - Success: correct guess.
  - Failure: out of attempts.
- Avoid one-note palettes and oversized marketing-style hero sections.
- Use real controls: select or segmented difficulty, numeric input, icon/text buttons where appropriate.

### Accessibility Requirements

- Input has an accessible label.
- Feedback is exposed through an `aria-live` region.
- Submit works with Enter.
- Disabled or terminal states are clear.
- Color is not the only signal for too-high/too-low/correct feedback.

### Design Score

8/10. The design goal is clear. Stage 2 needs to execute carefully so the UI feels like a polished tool/game surface rather than a classroom demo.

## Engineering Review

### Recommended Stack

- Vite.
- React.
- TypeScript.
- Vitest.
- React Testing Library.
- Playwright or browser automation during Stage 3 QA.

### Architecture

```text
src/
  App.tsx
  main.tsx
  styles.css
  game/
    gameLogic.ts
    gameTypes.ts
    gameLogic.test.ts
  components/
    DifficultySelector.tsx
    GuessForm.tsx
    FeedbackPanel.tsx
    HistoryList.tsx
    StatsPanel.tsx
```

The exact file layout can adapt to the scaffold, but the core rule is important: game state transitions should not be buried inside JSX.

### Core State Model

Suggested domain objects:

- Difficulty: id, label, min, max, maxAttempts.
- GuessResult: value, relation, distanceBand, remainingAttempts.
- GameState: secret, difficulty, guesses, status, message.

Suggested pure operations:

- `createGame(difficulty, randomInt)`
- `submitGuess(state, rawValue)`
- `changeDifficulty(state, difficulty, randomInt)`
- `getDistanceBand(secret, guess, range)`
- `isValidGuess(value, min, max)`

### State Transition Rules

- New game chooses a secret inside the active difficulty range.
- Invalid input returns a validation message and does not consume an attempt.
- Duplicate guesses should not consume another attempt; show a helpful message.
- Correct guess sets status to won.
- Running out of attempts after a wrong guess sets status to lost and reveals the answer.
- No guesses should be accepted after won/lost until reset.
- Changing difficulty starts a fresh game.

### Test Plan

Unit tests:

- Secret number is generated within the selected range.
- Too-low and too-high guesses return the correct relation.
- Correct guess wins immediately.
- Invalid guesses do not consume attempts.
- Duplicate guesses do not consume attempts.
- Loss occurs after max attempts.
- Difficulty switching resets attempts, history, and range.

UI or integration tests:

- User can win a round by entering the correct number.
- User sees validation for out-of-range input.
- Reset starts a fresh round.
- Difficulty selector updates range and attempt count.
- History renders previous guesses.

Stage 3 QA:

- Desktop viewport smoke test.
- Mobile viewport smoke test.
- Keyboard-only playthrough.
- Console error check.
- Build output check.

### Engineering Score

8.5/10. The plan is small and testable. The most important engineering decision is keeping game logic pure enough that tests are simple and reliable.

## DX Review

### Developer Journey

1. Clone or open project folder.
2. Install dependencies with `npm install`.
3. Run dev server with `npm run dev`.
4. Open the Vite local URL.
5. Run tests with `npm test`.
6. Build with `npm run build`.

### Target Time To Hello World

Under 5 minutes on a machine with Node/npm already installed.

### Scripts Expected After Stage 2

- `npm run dev`
- `npm test`
- `npm run build`
- Optional: `npm run preview`

### Error Message Expectations

Game errors should be player-facing and specific:

- Empty input: "Enter a number between X and Y."
- Out of range: "That guess is outside the current range."
- Duplicate: "You already tried N."
- Finished game: "Start a new game to keep playing."

Developer errors should be standard Vite/Vitest output; no custom tooling is necessary in v1.

### DX Score

8/10. The local workflow is straightforward. Stage 2 should include a short README if implementation time allows, because a clean README makes Stage 3 shipping easier.

## Cross-Phase Themes

### Theme: Keep Scope Small But Complete

CEO, Design, and Engineering all point to the same conclusion: the v1 should be a complete local game, not a platform. Completeness means polished local gameplay, not more product surface area.

### Theme: Separate Logic From Presentation

Engineering and QA both benefit if number generation, validation, and transitions live outside the main UI component.

### Theme: Accessibility Is Baseline

Design and QA both require keyboard flow, accessible labels, and live feedback from the beginning.

## Failure Modes Registry

| Failure Mode | Risk | Prevention |
|---|---|---|
| Secret number changes on every render | Game becomes impossible | Generate only on new game or difficulty change |
| Invalid input consumes attempts | Player experience feels unfair | Validate before mutating state |
| Duplicate guesses consume attempts | Player is punished for recall mistake | Detect duplicates first |
| Win/loss state still accepts guesses | Confusing terminal state | Block submit after terminal status |
| Mobile layout overflows | Poor QA result | Test at narrow viewport during implementation |
| Logic is embedded in JSX | Tests become brittle | Extract pure game module |

## Error & Rescue Registry

| User Situation | Message | Rescue |
|---|---|---|
| Empty input | Enter a number between the active range. | Keep focus in the input |
| Non-number input | Use digits only. | Do not consume attempt |
| Out-of-range input | That guess is outside the current range. | Show active min/max |
| Duplicate guess | You already tried this number. | Highlight matching history row if easy |
| Game already ended | Start a new game to keep playing. | Make reset/new game prominent |

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|---|---|---|---|---|---|
| 1 | CEO | Build local single-player v1 | Auto-decided | Scope discipline | It fits the learning goal and avoids unnecessary infrastructure | Backend, accounts, multiplayer |
| 2 | CEO | Use Vite + React + TypeScript | Auto-decided | Simplicity with structure | Modern frontend workflow with testable state | Static prompt-based page, Python backend |
| 3 | Design | First screen is the game | Auto-decided | User value first | A game project should be playable immediately | Landing page or marketing hero |
| 4 | Design | Include responsive and accessible baseline | Auto-decided | Accessibility from the start | Keyboard and mobile support are core quality signals | Desktop-only demo |
| 5 | Eng | Extract pure game logic | Auto-decided | Test risky logic | Enables meaningful unit tests and simpler UI components | All logic inside App JSX |
| 6 | DX | Provide standard npm scripts | Auto-decided | QA readiness | Makes Stage 3 review, QA, and ship predictable | Ad hoc commands |

## Implementation Tasks For Stage 2

- [ ] Scaffold Vite React TypeScript project in the workspace.
- [ ] Add game domain types and pure logic functions.
- [ ] Add unit tests for game logic.
- [ ] Build React components for difficulty, guess form, feedback, stats, and history.
- [ ] Add responsive CSS and accessible state announcements.
- [ ] Add local development scripts and a minimal README.
- [ ] Run tests and build.
- [ ] Start a local dev server for manual verification.

## Review Scores

- CEO: 8.5/10, scope is correct for the workflow.
- Design: 8/10, clear target with execution risk around polish.
- Engineering: 8.5/10, simple architecture with good testability.
- DX: 8/10, standard local workflow should be fast.

## Approval Gate

Approved as-is for Stage 2.

No user challenges are raised. No taste decisions require blocking approval. The only meaningful taste area is visual styling, and that can be handled during Stage 2 implementation and Stage 3 QA.

## Stage Boundary

Stop after this document. The next step must be context compaction, then Stage 2 may begin with:

1. `brainstorming`
2. `writing-plans`
3. `executing-plans`

Do not call Stage 3 skills until after Stage 2 is complete and context has been compacted again.
