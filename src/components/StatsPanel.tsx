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
