# Pulse — Notes for Claude

Single-page Next.js 14 (App Router) fitness app. Client-side only, no backend.

## Architecture
- One route: `app/page.tsx` orchestrates everything (tabs, sheets, active workout).
- State: one `useReducer` in `page.tsx`; reducer + initial state in `lib/reducer.ts`.
- Persistence: `lib/storage.ts` reads/writes `localStorage` key `pulse-fitness-state-v2`.
- Types & themes: `lib/types.ts`.

## Design system (v2 — light redesign)
- All theming via CSS custom properties (`--accent`, `--ink`, `--card-bg`, etc.).
- `THEMES` record in `lib/types.ts` — five LIGHT themes: mint, sky, blossom, peach, lavender.
  Each has `bg` (gradient), `swatch` (pair), and `vars` (CSS-variable map).
- `page.tsx` spreads the active theme's `vars` onto the root container and sets
  `document.body.style.background`.
- Fonts: Quicksand (display, `.font-display`) + Nunito (body), loaded via `<link>` in `layout.tsx`.
- Cards: frosted glass — `var(--card-bg)` + `backdrop-filter: blur()`, 26px radius, soft shadows.
- Ambient blurred `.blob` divs sit behind each screen for depth.

## Conventions
- Tab components receive `{ state, dispatch, openWorkout, startWorkout }`.
- Sheets are controlled by `state.openSheet`; the workout-detail sheet by `state.detailWorkout`.
- Icons are SVG path strings in `lib/icons.ts`, rendered via `components/Icon.tsx`.
- Exercise database is a packed string in `lib/exercises.ts`, parsed at module load.

## Gotchas
- TypeScript strict mode is on. `tsconfig` target is ES5-ish, so avoid spreading
  Sets/Maps directly — use `Array.from(...)`.
- Storage key is versioned; bump it if the state shape changes incompatibly.
