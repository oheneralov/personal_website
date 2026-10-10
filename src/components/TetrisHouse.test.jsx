import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TetrisHouse from './TetrisHouse';
import { HOUSE_PARTS } from '../lib/tetris';

afterEach(cleanup);

function houseParts(container) {
  return container.querySelectorAll('.tetris__house-part');
}

describe('TetrisHouse', () => {
  it.each([0, 1, 3])('draws the %i parts that are built', (stage) => {
    const { container } = render(<TetrisHouse stage={stage} />);

    expect(houseParts(container)).toHaveLength(stage);
  });

  it('draws the whole house and says so when every part is built', () => {
    const { container } = render(<TetrisHouse stage={HOUSE_PARTS.length} />);

    expect(houseParts(container)).toHaveLength(HOUSE_PARTS.length);
    expect(screen.getByText('The house is finished — the family has a home!')).toBeTruthy();
  });
});
