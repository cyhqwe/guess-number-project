import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

function submitGuess(value: string) {
  const input = screen.getByLabelText('输入你的破解数字');
  fireEvent.change(input, { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: '提交猜测' }));
}

describe('App', () => {
  it('renders the Simplified Chinese cyberpunk game shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '破解隐藏数字' })).toBeTruthy();
    expect(screen.getByText(/NUMBER GRID \/\/ 数字迷城/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /普通/ }).getAttribute('aria-pressed')).toBe('true');
  });

  it('switches difficulty and updates the range hint', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /困难/ }));

    expect(screen.getByText('困难模式')).toBeTruthy();
    expect(screen.getByText('范围 1-500，按 Enter 也可以提交。')).toBeTruthy();
  });

  it('shows validation without adding history for out-of-range input', () => {
    render(<App />);

    submitGuess('999');

    expect(screen.getByText('数值超出范围。请输入 1-100 之间的整数。')).toBeTruthy();
    expect(screen.getByText('暂无记录。输入第一个数字开始追踪信号。')).toBeTruthy();
  });

  it('adds a history row for an accepted guess and clears it on reset', () => {
    render(<App />);

    submitGuess('1');

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.queryByText('暂无记录。输入第一个数字开始追踪信号。')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '开启新一局' }));

    expect(screen.getByText('暂无记录。输入第一个数字开始追踪信号。')).toBeTruthy();
  });
});
