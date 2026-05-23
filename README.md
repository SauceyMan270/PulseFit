# Pulse

A bright, friendly fitness companion built with Next.js 14 (App Router) and React 18.

## v2.0 — Light Redesign

Pulse has been reskinned from its original dark monochrome look into a soft,
airy pastel aesthetic inspired by modern nutrition/wellness apps:

- **Light, calm palette** — mint & sky blue accents with a lavender third accent
- **Frosted glass cards** — translucent white surfaces with soft layered shadows
- **Friendly rounded type** — Quicksand (display) + Nunito (body)
- **Five light themes** — Mint, Sky, Blossom, Peach, Lavender (switch in Settings)
- **Ambient depth** — blurred background "blobs" behind every screen

All app logic is unchanged from v1 — only the visual layer was reworked.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 14 App Router, React 18, TypeScript (strict)
- Tailwind CSS (base layer) + inline-style design system driven by CSS variables
- State via a single `useReducer`, persisted to `localStorage`
- No backend — fully client-side

## Project Structure

- `app/` — layout, global CSS, the single page (orchestrator)
- `components/` — shared UI (Card, PillBtn, ProgressRing, BottomNav, etc.)
- `components/tabs/` — the five tab screens (Home, Workouts, Progress, Schedule, Profile)
- `components/sheets/` — modal bottom-sheets (workout detail, library, settings, etc.)
- `lib/` — types & themes, reducer, storage, icons, exercise database

## Notes

- The `localStorage` key was bumped to `pulse-fitness-state-v2`, so v1 data
  (which referenced the old dark themes) won't break hydration.
- Themes live in `lib/types.ts` as a `THEMES` record; each provides a background
  gradient, a swatch pair, and a set of CSS custom properties.
