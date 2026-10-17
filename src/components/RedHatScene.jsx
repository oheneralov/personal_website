import PropTypes from 'prop-types';
import GameHouse from './GameHouse';
import RedHatBed from './RedHatBed';
import RedHatGirl from './RedHatGirl';
import RedHatPerson from './RedHatPerson';
import RedHatWolf from './RedHatWolf';

// Trees in front stand on the near edge of the meadow; smaller ones further back stand higher up.
function tree(left, { far = false, icon = '🌲' } = {}) {
  return { icon, left, bottom: far ? '32%' : '8%', size: far ? '5rem' : '7rem' };
}

function flower(icon, left, bottom) {
  return { icon, left, bottom, size: '1.5rem' };
}

/**
 * What every scene of the tale shows. The girl walks from `from` to `to` (or stands at `to`). An
 * item is an emoji `icon` or a drawn `figure` (a person or the wolf); one with a `speaker` moves
 * while that character speaks. Items are listed back to front.
 */
const SCENERY = {
  home: {
    house: 'left',
    girl: { from: '58%', to: '58%' },
    items: [
      tree('70%', { far: true }),
      tree('84%', { far: true, icon: '🌳' }),
      flower('🌷', '34%', '4%'),
      flower('🌼', '72%', '6%'),
      flower('🌸', '82%', '16%'),
      flower('🌷', '92%', '4%'),
      { figure: 'mother', left: '44%', bottom: '12%', speaker: 'mother' },
    ],
  },
  forest: {
    girl: { from: '2%', to: '42%' },
    items: [
      tree('10%', { far: true }),
      tree('28%', { far: true, icon: '🌳' }),
      tree('48%', { far: true }),
      tree('64%', { far: true, icon: '🌳' }),
      tree('80%', { far: true }),
      tree('-3%'),
      tree('20%', { icon: '🌳' }),
      tree('70%'),
      tree('88%', { icon: '🌳' }),
      flower('🌼', '12%', '3%'),
      flower('🌷', '36%', '5%'),
      flower('🌸', '60%', '2%'),
      flower('🌼', '84%', '4%'),
      { icon: '🐦', left: '58%', bottom: '74%', size: '1.6rem' },
    ],
  },
  wolf: {
    girl: { from: '2%', to: '36%' },
    items: [
      tree('4%', { far: true, icon: '🌳' }),
      tree('22%', { far: true }),
      tree('40%', { far: true }),
      tree('76%', { far: true, icon: '🌳' }),
      tree('92%', { far: true }),
      tree('-4%'),
      tree('86%', { icon: '🌳' }),
      flower('🌷', '14%', '4%'),
      flower('🌼', '28%', '2%'),
      flower('🌸', '50%', '3%'),
      { figure: 'wolf', left: '54%', bottom: '12%', speaker: 'wolf' },
    ],
  },
  flowers: {
    girl: { from: '2%', to: '44%' },
    items: [
      tree('2%', { far: true }),
      tree('16%', { far: true, icon: '🌳' }),
      tree('74%', { far: true }),
      tree('90%', { far: true, icon: '🌳' }),
      flower('🌷', '6%', '6%'),
      flower('🌼', '14%', '20%'),
      flower('🌸', '22%', '4%'),
      flower('🌻', '30%', '18%'),
      flower('🌷', '36%', '2%'),
      flower('🌼', '54%', '20%'),
      flower('🌸', '60%', '6%'),
      flower('🌷', '66%', '22%'),
      flower('🌻', '72%', '8%'),
      flower('🌼', '78%', '20%'),
      flower('🌸', '84%', '4%'),
      flower('🌷', '90%', '18%'),
      flower('🌼', '95%', '6%'),
    ],
  },
  'grandmas-house': {
    house: 'right',
    // She stops at the door, which is about 60px in from the left wall of the 120px-wide house.
    girl: { from: '2%', to: 'calc(97% - 73px)' },
    items: [
      tree('6%', { far: true, icon: '🌳' }),
      tree('22%', { far: true }),
      tree('38%', { far: true, icon: '🌳' }),
      tree('-4%'),
      flower('🌷', '20%', '4%'),
      flower('🌼', '32%', '18%'),
      flower('🌸', '44%', '3%'),
    ],
  },
  bed: {
    indoor: true,
    girl: { from: '24%', to: '24%' },
    items: [
      { icon: '🖼️', left: '8%', bottom: '58%', size: '1.8rem' },
      { figure: 'wolf', inBed: true, left: 'calc(100% - 178px)', bottom: '10%', speaker: 'wolf' },
    ],
  },
  hunter: {
    indoor: true,
    girl: { from: '14%', to: '14%' },
    items: [
      { figure: 'wolf', left: '78%', bottom: '12%', fleeing: true },
      { icon: '🚪', left: '58%', bottom: '12%', size: '4rem' },
      { figure: 'hunter', left: '34%', bottom: '12%', speaker: 'hunter' },
      { figure: 'grandma', left: '68%', bottom: '12%', speaker: 'grandma' },
    ],
  },
  end: {
    indoor: true,
    girl: { from: '22%', to: '22%' },
    items: [
      { icon: '🍰', left: '38%', bottom: '14%', size: '2rem' },
      { figure: 'grandma', left: '52%', bottom: '12%', speaker: 'grandma' },
      { figure: 'hunter', left: '70%', bottom: '12%', speaker: 'hunter' },
      { icon: '❤️', left: '45%', bottom: '64%', size: '1.6rem' },
    ],
  },
};

function itemClass(item, speaking) {
  return [
    'red-hat__prop',
    item.fleeing && 'red-hat__prop--fleeing',
    // In bed only the wolf moves, not the bed.
    speaking && !item.inBed && 'red-hat__speaking',
  ]
    .filter(Boolean)
    .join(' ');
}

function renderItem(item, speaking) {
  if (item.inBed) {
    return (
      <RedHatBed speaking={speaking}>
        <RedHatWolf nightcap />
      </RedHatBed>
    );
  }
  if (item.figure === 'wolf') {
    return <RedHatWolf />;
  }
  return item.figure ? <RedHatPerson variant={item.figure} /> : item.icon;
}

/** Purely decorative picture of a scene; everything that happens in it is also said in text. */
export default function RedHatScene({ sceneId, speaker = null }) {
  const { indoor = false, house = null, girl, items } = SCENERY[sceneId];
  const walking = girl.from !== girl.to;

  return (
    <div
      className={`red-hat__scene red-hat__scene--${sceneId}${indoor ? ' red-hat__scene--indoor' : ''}`}
      aria-hidden="true"
    >
      {!indoor && <span className="red-hat__sun" />}
      {house && (
        <span className={`red-hat__house red-hat__house--${house}`}>
          <GameHouse />
        </span>
      )}
      {items.map((item) => {
        const speaking = Boolean(item.speaker) && item.speaker === speaker;
        return (
          <span
            key={`${item.icon ?? item.figure}-${item.left}-${item.bottom}`}
            className={itemClass(item, speaking)}
            style={{ left: item.left, bottom: item.bottom, fontSize: item.size }}
          >
            {renderItem(item, speaking)}
          </span>
        );
      })}
      {/* Keyed by scene, so that the walk starts again in every scene. */}
      <span
        key={sceneId}
        className={[
          'red-hat__girl',
          walking && 'red-hat__girl--walking',
          speaker === 'girl' && 'red-hat__speaking',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ '--from': girl.from, '--to': girl.to }}
      >
        <RedHatGirl />
      </span>
    </div>
  );
}

RedHatScene.propTypes = {
  sceneId: PropTypes.oneOf(Object.keys(SCENERY)).isRequired,
  speaker: PropTypes.string,
};
