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
