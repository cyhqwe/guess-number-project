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
