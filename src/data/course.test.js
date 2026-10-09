import { describe, expect, it } from 'vitest';
import { ALL_UNITS, LEVELS, findLevel, findUnit } from './course';

describe('course content', () => {
  it('has two levels with eight units each', () => {
    expect(LEVELS.map((level) => level.id)).toEqual(['a1', 'a2']);
    LEVELS.forEach((level) => {
      expect(level.units).toHaveLength(8);
      expect(level.units.map((unit) => unit.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  it('translates level and unit titles and descriptions into Filipino', () => {
    LEVELS.forEach((level) => {
      expect(level.titleTl).toBeTruthy();
      expect(level.descriptionTl).toBeTruthy();
    });
    ALL_UNITS.forEach((unit) => {
      expect(unit.titleTl, unit.id).toBeTruthy();
      expect(unit.summaryTl, unit.id).toBeTruthy();
    });
  });

  it('gives every unit a unique id', () => {
    const ids = ALL_UNITS.map((unit) => unit.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ALL_UNITS)('unit $id has enough unambiguous vocabulary for a quiz', (unit) => {
    expect(unit.vocabulary.length).toBeGreaterThanOrEqual(9);
    expect(new Set(unit.vocabulary.map((word) => word.pl)).size).toBe(unit.vocabulary.length);
    expect(new Set(unit.vocabulary.map((word) => word.en)).size).toBe(unit.vocabulary.length);
    expect(unit.phrases.length).toBeGreaterThan(0);
  });

  it.each(ALL_UNITS)('unit $id has a Filipino translation for every quiz text', (unit) => {
    unit.vocabulary.forEach((word) => expect(word.tl, word.pl).toBeTruthy());
    unit.exercises.forEach((exercise) => expect(exercise.hintTl, exercise.hint).toBeTruthy());
  });

  it.each(ALL_UNITS)('unit $id has well-formed grammar exercises', (unit) => {
    expect(unit.exercises.length).toBeGreaterThan(0);
    unit.exercises.forEach((exercise) => {
      expect(exercise.prompt).toContain('___');
      expect(exercise.options).toContain(exercise.answer);
      expect(new Set(exercise.options).size).toBe(exercise.options.length);
    });
  });

  it.each(ALL_UNITS)('unit $id has a grammar table whose rows match its headers', (unit) => {
    const { headers, rows } = unit.grammar.table;
    rows.forEach((row) => expect(row).toHaveLength(headers.length));
  });
});

describe('findLevel', () => {
  it('returns the level for a known id and null otherwise', () => {
    expect(findLevel('a2').name).toBe('A2');
    expect(findLevel('c1')).toBeNull();
  });
});

describe('findUnit', () => {
  it('returns the unit with its level and the following unit', () => {
    const found = findUnit('a1-3');
    expect(found.unit.title).toBe('Family');
    expect(found.level.id).toBe('a1');
    expect(found.nextUnit.id).toBe('a1-4');
  });

  it('continues from the last A1 unit into A2', () => {
    expect(findUnit('a1-8').nextUnit.id).toBe('a2-1');
  });

  it('has no next unit after the final unit', () => {
    expect(findUnit('a2-8').nextUnit).toBeNull();
  });

  it('returns null for an unknown unit', () => {
    expect(findUnit('nope')).toBeNull();
  });
});
