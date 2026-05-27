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
      <div
        className="signal-meter"
        aria-label={`距离提示：${game.lastDistanceBand ? distanceLabels[game.lastDistanceBand] : '等待输入'}`}
      >
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
