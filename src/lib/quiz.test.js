import { describe, expect, it } from 'vitest';
import { ALL_UNITS } from '../data/course';
import { ANSWER_RESULT, buildQuiz, checkTypedAnswer, evaluateAnswer, shuffle } from './quiz';
import { createSeededRng } from '../test/helpers';

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const items = [1, 2, 3, 4, 5];

    const result = shuffle(items, createSeededRng(7));

    expect(items).toEqual([1, 2, 3, 4, 5]);
    expect([...result].sort()).toEqual(items);
  });

  it('is deterministic for a given random source', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(shuffle(items, createSeededRng(3))).toEqual(shuffle(items, createSeededRng(3)));
  });
});

describe('buildQuiz', () => {
  it.each(ALL_UNITS)('builds a consistent quiz for unit $id', (unit) => {
    const questions = buildQuiz(unit, createSeededRng(42));

    expect(questions).toHaveLength(9 + unit.exercises.length);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
    questions
      .filter((question) => question.kind === 'choice')
      .forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.options).toContain(question.answer);
      });
  });

  it('tests each vocabulary word at most once', () => {
    const unit = ALL_UNITS[0];

    const vocabularyQuestions = buildQuiz(unit, createSeededRng(5)).filter(
      (question) => !question.id.startsWith('grammar:'),
    );

    const words = vocabularyQuestions.map((question) => question.id.split(':')[1]);
    expect(new Set(words).size).toBe(words.length);
  });

  it('ends with typing questions that expect the Polish word', () => {
    const unit = ALL_UNITS[0];

    const typing = buildQuiz(unit, createSeededRng(5)).filter(
      (question) => question.kind === 'typing',
    );

    expect(typing).toHaveLength(2);
    typing.forEach((question) => {
      const word = unit.vocabulary.find((candidate) => candidate.pl === question.answer);
      expect(question.prompt).toBe(word.en);
    });
  });
});

describe('checkTypedAnswer', () => {
  it('accepts an exact answer regardless of case, spacing and final punctuation', () => {
    expect(checkTypedAnswer('  Dzień   dobry! ', 'dzień dobry')).toBe(ANSWER_RESULT.CORRECT);
  });

  it('reports a missing diacritic as close', () => {
    expect(checkTypedAnswer('dziekuje', 'dziękuję')).toBe(ANSWER_RESULT.CLOSE);
    expect(checkTypedAnswer('milo mi', 'miło mi')).toBe(ANSWER_RESULT.CLOSE);
  });

  it('rejects a different word and an empty answer', () => {
    expect(checkTypedAnswer('tak', 'nie')).toBe(ANSWER_RESULT.WRONG);
    expect(checkTypedAnswer('   ', 'nie')).toBe(ANSWER_RESULT.WRONG);
  });
});

describe('evaluateAnswer', () => {
  it('requires the exact option for choice questions', () => {
    const question = { kind: 'choice', answer: 'kawę' };
    expect(evaluateAnswer(question, 'kawę')).toBe(ANSWER_RESULT.CORRECT);
    expect(evaluateAnswer(question, 'kawa')).toBe(ANSWER_RESULT.WRONG);
  });

  it('is lenient about diacritics for typing questions', () => {
    const question = { kind: 'typing', answer: 'żona' };
    expect(evaluateAnswer(question, 'zona')).toBe(ANSWER_RESULT.CLOSE);
  });
});
