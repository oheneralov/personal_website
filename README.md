# Polski krok po kroku

A static website for English speakers learning Polish at CEFR levels A1 and A2.

- 2 levels (A1, A2) with 8 units each
- every unit has vocabulary and phrases with audio, a grammar note, flashcards and a quiz
- a unit is completed by scoring at least 70% in its quiz
- progress is stored in the browser's `localStorage`; there is no backend and no sign-in

## Tech

React 18, React Router (hash routing, so the build works on any static host), Vite, Vitest with
Testing Library, ESLint (Airbnb) and Prettier.

## Commands

```bash
npm install
npm run dev           # start the dev server
npm run build         # production build in dist/
npm run preview       # serve the production build locally
npm test              # unit and component tests
npm run lint          # ESLint
npm run format:check  # Prettier
```

## Structure

```text
src/
├── data/         course content (a1.js, a2.js) and lookups (course.js)
├── lib/          quiz generation, progress persistence, speech synthesis
├── context/      ProgressContext: progress state synced to localStorage
├── components/   Layout, Quiz, Flashcards, tables, progress bar
└── pages/        Home, Level, Unit, NotFound
```

To add or edit course content, change the unit objects in `src/data/`. `src/data/course.test.js`
checks that every unit is well formed.

Audio uses the browser's built-in speech synthesis and needs a Polish voice installed on the
device; the listen buttons are hidden when speech synthesis is unavailable.
