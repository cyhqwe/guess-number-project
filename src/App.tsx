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
