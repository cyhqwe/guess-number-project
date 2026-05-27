import { type FormEvent, useEffect, useRef, useState } from 'react';
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
