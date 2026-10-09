import a1Units from './a1';
import a2Units from './a2';

export const LEVELS = [
  {
    id: 'a1',
    name: 'A1',
    title: 'Beginner',
    titleTl: 'Baguhan',
    description:
      'Start from zero: greetings, numbers, family, food and the building blocks of Polish grammar.',
    descriptionTl:
      'Magsimula sa wala: mga pagbati, bilang, pamilya, pagkain at ang mga pangunahing sangkap ng gramatikang Polish.',
    units: a1Units,
  },
  {
    id: 'a2',
    name: 'A2',
    title: 'Elementary',
    titleTl: 'Elementarya',
    description:
      'Talk about the past and the future, travel, health, work and handle everyday situations.',
    descriptionTl:
      'Pag-usapan ang nakaraan at ang hinaharap, paglalakbay, kalusugan, trabaho, at harapin ang mga pang-araw-araw na sitwasyon.',
    units: a2Units,
  },
];

export const ALL_UNITS = LEVELS.flatMap((level) => level.units);

export function findLevel(levelId) {
  return LEVELS.find((level) => level.id === levelId) ?? null;
}

/**
 * Looks a unit up by id and returns it with its level and the unit that follows it
 * (which may belong to the next level), or null when the id is unknown.
 */
export function findUnit(unitId) {
  const index = ALL_UNITS.findIndex((unit) => unit.id === unitId);
  if (index === -1) {
    return null;
  }
  const unit = ALL_UNITS[index];
  return {
    unit,
    level: LEVELS.find((level) => level.units.includes(unit)),
    nextUnit: ALL_UNITS[index + 1] ?? null,
  };
}
