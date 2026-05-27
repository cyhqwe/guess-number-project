# Number Guessing Game - Office Hours Design

Status: Stage 1 locked design draft
Project: Browser-based number guessing game
Date: 2026-05-26

## Problem Statement

Build a small but polished browser game where a player guesses a hidden number and receives immediate feedback after each guess. The goal is not novelty in the game rule itself; the goal is a clean learning project that demonstrates product thinking, frontend state management, responsive UI, and testable implementation.

The project should be simple enough to ship in one focused coding phase, but complete enough to feel like a real mini product instead of a bare exercise.

## What Makes This Cool

- The rule is instantly understood: enter a number, learn whether it is too high or too low, and keep narrowing the range.
- The product can still have texture: difficulty modes, attempt history, hot/cold feedback, keyboard support, reset flow, and a compact stats panel.
- It is a good starter project for practicing the full Superpowers + gstack lifecycle because the scope is visible, testable, and easy to QA in a browser.

## Constraints

- Stage 1 must not implement code.
- Stage 2 should be able to build from a clean, empty repository.
- The first playable version should run locally in a browser with minimal setup.
- The game must work on desktop and mobile viewports.
- The implementation should avoid backend complexity unless a later stage explicitly asks for persistence or multiplayer.
- No login, accounts, database, payments, or external service dependency in v1.

## Premises

1. A single-player local browser game is the right smallest useful project.
2. The target player is a casual user or learner who wants a quick, satisfying interaction.
3. A polished UI matters because the game mechanics are intentionally simple.
4. Accessibility and keyboard support should be included from the first implementation, not patched on later.
5. The development process is as important as the app: the repository should have clear scripts, tests, and a readable structure.

## Premise Challenge

The main risk is building something too thin: a number input plus alert messages would technically satisfy the rule, but it would not exercise the development workflow or create a product-like artifact worth reviewing.

The second risk is overbuilding: leaderboards, user accounts, animation-heavy visuals, or AI-generated hints would add surface area without improving the core learning goal.

The right shape is a complete local game with small-product polish: stateful gameplay, difficulty choices, history, feedback, win/loss states, responsive design, and test coverage.

## Approaches Considered

### Approach A: Static HTML/CSS/JavaScript

This is the simplest possible delivery path. It has almost no build tooling and can be opened directly in a browser.

Pros:
- Very low setup friction.
- Good for teaching fundamentals.
- Easy to inspect.

Cons:
- Harder to enforce structure and testing habits.
- Less representative of modern frontend app workflows.
- UI state can become messy as features grow.

### Approach B: Vite + React + TypeScript

This uses a small modern frontend stack with component state, typed game logic, and a simple dev server.

Pros:
- Good fit for a polished browser game.
- Easy to test pure game logic separately from UI.
- Familiar scripts: dev, build, test.
- Leaves room for QA with Playwright later.

Cons:
- Slightly more setup than static files.
- Requires Node/npm to run locally.

### Approach C: Python Web App

This would use a Python backend to serve pages and manage game state.

Pros:
- Fits the workspace path and Python environment.
- Useful if the goal is backend practice.

Cons:
- Backend state is unnecessary for v1.
- More moving parts for a local single-player game.
- Slower to polish the browser interaction.

## Recommended Approach

Use Vite + React + TypeScript for v1.

The hidden number generation, guess validation, attempt tracking, and win/loss logic should live in pure functions or a small reducer-style module. The UI should consume that logic and focus on rendering controls, feedback, and history.

This gives the project enough structure to be worth reviewing and testing while keeping the game small enough to finish cleanly.

## Product Scope

### In Scope

- Random secret number within a selected range.
- Difficulty modes:
  - Easy: 1-50, 10 attempts.
  - Normal: 1-100, 8 attempts.
  - Hard: 1-500, 10 attempts.
- Guess input with validation and clear errors.
- Feedback after each guess:
  - Too low.
  - Too high.
  - Correct.
  - Hot/warm/cold distance hint.
- Attempt counter and remaining guesses.
- Guess history with directional markers.
- Win and loss states.
- New game/reset action.
- Responsive layout for mobile and desktop.
- Keyboard-friendly input and submit flow.
- Basic accessibility labels and live feedback region.
- Unit tests for game logic.
- Browser QA after implementation.

### Not In Scope

- User accounts.
- Persistent high score storage.
- Online leaderboard.
- Multiplayer.
- Backend server.
- Daily challenge mode.
- Sound effects.
- Complex animation system.

## UX Shape

The first screen should be the actual game, not a marketing page. Use a compact app layout:

- Header area with game title and difficulty selector.
- Main play area with number input, submit button, and prominent feedback.
- Side or lower panel with attempts remaining, current range, and guess history.
- End-state controls that make replay obvious.

The visual style should feel playful but restrained: clear contrast, large touch targets, readable state changes, and no decorative clutter that competes with gameplay.

## Success Criteria

- A new player can understand what to do within 5 seconds.
- A full round can be completed using only the keyboard.
- Invalid input never mutates game state.
- The game clearly communicates win, loss, and reset states.
- The app works at common mobile and desktop widths.
- Build and tests pass.
- QA can verify the happy path, invalid input, loss path, reset path, and difficulty switching.

## Distribution Plan

For v1, local development is enough:

- `npm install`
- `npm run dev`
- Open the local Vite URL.

If a later phase wants publishing, the app can be deployed as a static site.

## Dependencies

- Node.js and npm.
- Vite.
- React.
- TypeScript.
- Vitest and Testing Library.
- Playwright or browser QA tooling in the final QA phase.

## The Assignment

Before Stage 2 starts, keep the scope fixed to the recommended v1 above. Do not add persistence, accounts, multiplayer, or backend behavior during implementation unless a later explicit decision changes the plan.

## What I Noticed About How You Think

You are treating a small game as a way to practice a full professional development loop. That is a good instinct: the small surface area makes the workflow visible, and the product still has enough UX and testing depth to make each phase meaningful.
