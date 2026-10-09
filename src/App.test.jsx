import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ProgressProvider } from './context/ProgressContext';
import { STORAGE_KEY } from './lib/progressStore';
import { createMemoryStorage } from './test/helpers';

afterEach(cleanup);

function renderApp(path, storage = createMemoryStorage()) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider storage={storage}>
        <App />
      </ProgressProvider>
    </MemoryRouter>,
  );
  return storage;
}

function storedProgress(storage) {
  return JSON.parse(storage.getItem(STORAGE_KEY));
}

describe('App', () => {
  it('shows both levels on the home page and invites a new learner to start', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: 'Beginner' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Elementary' })).toBeTruthy();
    expect(screen.getByText('Baguhan')).toBeTruthy();
    expect(screen.getByText(/^Magsimula sa wala/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Start learning: Greetings/ })).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Learn Polish, step by step' }).nextElementSibling
        .textContent,
    ).toBe('Matuto ng Polish, hakbang-hakbang');
  });

  it('offers the game as a third block on the home page and opens it', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('link', { name: /The way home/ }));

    expect(screen.getByRole('heading', { level: 1, name: 'The way home' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start walking' })).toBeTruthy();
  });

  it('lists eight units on a level page', () => {
    renderApp('/level/a2');

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(8);
  });

  it('restores saved progress from storage', () => {
    const saved = {
      version: 1,
      units: { 'a1-1': { knownWords: [], bestPercent: 85, attempts: 1 } },
    };
    renderApp('/level/a1', createMemoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) }));

    expect(screen.getByText(/Completed · best 85%/)).toBeTruthy();
    expect(
      screen.getByRole('progressbar', { name: 'Units completed' }).getAttribute('aria-valuenow'),
    ).toBe('1');
  });

  it('saves a flashcard marked as known', async () => {
    const user = userEvent.setup();
    const storage = renderApp('/unit/a1-1');

    await user.click(screen.getByRole('tab', { name: 'Flashcards' }));
    await user.click(screen.getByRole('button', { name: 'I know it' }));

    expect(storedProgress(storage).units['a1-1'].knownWords).toEqual(['cześć']);
  });

  it('clears saved progress after the learner confirms a reset', async () => {
    const user = userEvent.setup();
    const saved = {
      version: 1,
      units: { 'a1-1': { knownWords: [], bestPercent: 85, attempts: 1 } },
    };
    const storage = renderApp(
      '/level/a1',
      createMemoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) }),
    );
    window.confirm = () => true;

    await user.click(screen.getByRole('button', { name: 'Reset progress' }));

    expect(storedProgress(storage).units).toEqual({});
    expect(screen.queryByText(/Completed/)).toBeNull();
  });

  it('shows a not-found page for an unknown unit or level', () => {
    renderApp('/unit/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
    cleanup();

    renderApp('/level/c2');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
  });
});
