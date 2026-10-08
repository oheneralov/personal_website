import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from './Quiz';
import { ALL_UNITS } from '../data/course';
import { buildQuiz } from '../lib/quiz';
import { createSeededRng } from '../test/helpers';

const SEED = 11;
const unit = ALL_UNITS[0];

afterEach(cleanup);

/** Answers every question; `pickAnswer` decides what to respond with for each one. */
async function completeQuiz(user, pickAnswer) {
  const questions = buildQuiz(unit, createSeededRng(SEED));
  await questions.reduce(async (previous, question, position) => {
    await previous;
    const response = pickAnswer(question);
    if (question.kind === 'choice') {
      await user.click(screen.getByRole('button', { name: response }));
    } else {
      await user.type(screen.getByLabelText('Your answer'), response);
      await user.click(screen.getByRole('button', { name: 'Check' }));
    }
    const isLast = position === questions.length - 1;
    await user.click(screen.getByRole('button', { name: isLast ? 'See result' : 'Next question' }));
  }, Promise.resolve());
  return questions.length;
}

describe('Quiz', () => {
  it('reports a full score when every answer is correct', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Quiz unit={unit} onComplete={onComplete} rng={createSeededRng(SEED)} />);

    const total = await completeQuiz(user, (question) => question.answer);

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith(total, total);
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Unit passed/ })).toBeTruthy();
  });

  it('reports a failing score when the answers are wrong', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Quiz unit={unit} onComplete={onComplete} rng={createSeededRng(SEED)} />);

    const total = await completeQuiz(user, (question) =>
      question.kind === 'choice'
        ? question.options.find((option) => option !== question.answer)
        : 'xyz',
    );

    expect(onComplete).toHaveBeenCalledWith(0, total);
    expect(screen.getByRole('heading', { name: 'Keep practising' })).toBeTruthy();
  });

  it('shows the correct answer after a wrong choice', async () => {
    const user = userEvent.setup();
    render(<Quiz unit={unit} onComplete={vi.fn()} rng={createSeededRng(SEED)} />);
    const [question] = buildQuiz(unit, createSeededRng(SEED));
    const wrong = question.options.find((option) => option !== question.answer);

    await user.click(screen.getByRole('button', { name: wrong }));

    expect(screen.getByText('Not quite.')).toBeTruthy();
    expect(screen.getByText(/Correct answer:/).textContent).toContain(question.answer);
  });

  it('starts a fresh quiz after "Try again"', async () => {
    const user = userEvent.setup();
    render(<Quiz unit={unit} onComplete={vi.fn()} rng={createSeededRng(SEED)} />);
    await completeQuiz(user, (question) => question.answer);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('heading', { name: 'Quiz' })).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Quiz progress' })).toBeTruthy();
  });
});
