# React Fetch Challenges

Ten TypeScript practice challenges with a built-in editor, live preview and
console. Every one follows the same shape:
**fetch from an API → iterate → manipulate → display.**

```bash
npm install
npm run dev
```

Then open http://localhost:5173 — you write the code in the browser, not in
your IDE.

## The panes

| Pane | What it does |
|------|--------------|
| **Your code** | Editable TSX. Starts as an empty component; the brief is the comment at the top. |
| **CSS** | Styles for the preview. Applies live, no Run needed. |
| **Solution** | Read-only worked version. Hit Run while it's open to watch it work. |
| **Preview** | Renders whichever tab you ran. |
| **Console** | Everything your `console.log()` writes, plus thrown errors. |
| **Compiled JS** | What your TSX became after the JSX + TypeScript transform. |

**Run** (or `⌘`+`Enter`) compiles and renders. **Reset** restores the starting
stub. Your code is saved per challenge in `localStorage`, so a refresh keeps it.

## Editor keys

| Key | Does |
|-----|------|
| `⌘`+`Enter` | Compile and render |
| `Tab` | Accept the completion if one is showing, otherwise indent |
| `Shift`+`Tab` | Outdent |
| `Ctrl`+`Space` | Open completions without typing |
| `Escape` | Close the completion popup; again to move focus out of the editor |

Completions cover identifiers in your file plus the runtime globals the
challenges reach for — `fetch`, `console`, `JSON`, `Promise` — and their members.
It is not a full TypeScript service, so there is no type-aware checking as you
type; `npm run build` is still what typechecks.

## Tracking progress

Check a challenge off with the sidebar checkbox, or with **Mark complete** in the
header. The sidebar keeps a running count, and **Reset progress** clears it.

Progress is saved in your browser's `localStorage` — no backend, nothing to run.
Two things follow from that: it is per browser (Chrome and Safari keep separate
counts), and it is per origin, so if Vite falls back to another port because
5173 is taken, that is a different store. Clearing site data resets it.

## The challenges

| # | File | Skill |
|---|------|-------|
| 01 | `01-fetch-users.tsx` | useState + useEffect, map to a list |
| 02 | `02-search-filter.tsx` | Controlled input, `.filter()` |
| 03 | `03-sort-users.tsx` | `.sort()` without mutating, nested fields |
| 04 | `04-group-by-user.tsx` | `.reduce()` into groups, sort by count |
| 05 | `05-todo-stats.tsx` | Aggregate + derive percentages |
| 06 | `06-dependent-fetch.tsx` | Second fetch that depends on a selection |
| 07 | `07-parallel-join.tsx` | `Promise.all`, join two datasets via a Map |
| 08 | `08-pagination.tsx` | Client-side slicing, disabled edge states |
| 09 | `09-loading-error-abort.tsx` | `res.ok`, error states, `AbortController` |
| 10 | `10-transform-table.tsx` | Zip parallel arrays into rows, derive + format |

## What you can import

Only `react`. Type-only imports from `../types` are erased, so
`import type { User } from '../types'` works and gives you autocomplete-shaped
types to annotate with. Anything else throws a clear error in the preview.

## APIs

No keys, no signup, CORS-friendly:

- `jsonplaceholder.typicode.com` — users, posts, todos
- `picsum.photos` — challenge 8
- `api.open-meteo.com` — challenge 10 (returns parallel arrays)

## Notes

- The app runs in `StrictMode`, so effects fire twice in dev. That's React
  telling you your cleanup is missing — challenge 09 is about exactly that.
- Your CSS is scoped to the preview pane, so a bare `li { }` can't restyle the
  app around it.

## Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck (`tsc -b`) + production build |
| `npm run lint` | oxlint |

`src/challenges/` holds the editor seeds and is excluded from typecheck on
purpose — they're deliberately incomplete. `src/solutions/` is fully
typechecked.
