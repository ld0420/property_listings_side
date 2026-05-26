# Property Listings

A Next.js app that displays SimplyRETS property listings on a map + list view,
matching the provided Figma mockup. See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the
original assignment and [AI_USAGE.md](./AI_USAGE.md) for the AI-tooling write-up.

## Getting Started

**Prerequisites:** Node 20.9.0+ (Node 24 LTS recommended; see `.nvmrc`).

```sh
# 1. Install dependencies
yarn

# 2. Set up environment (Google Maps key — see below)
cp .env.example .env.local
#    then edit .env.local and set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# 3. Run the dev server
yarn dev          # http://localhost:3000
```

Other scripts:

| Command        | Purpose                        |
| -------------- | ------------------------------ |
| `yarn dev`     | Dev server at `localhost:3000` |
| `yarn build`   | Production build               |
| `yarn start`   | Serve the production build     |
| `yarn test`    | Jest in watch mode             |
| `yarn test:ci` | Jest single run                |
| `yarn format`  | Prettier                       |

### Environment

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is required for the map to render. A
localhost-restricted key is provided in INSTRUCTIONS.md; copy `.env.example` to
`.env.local` and paste it in. If it's missing the app still runs and degrades
gracefully — the map panel shows a "couldn't be loaded" message and the listings
remain fully usable. (The SimplyRETS API uses the public trial credentials and needs
no setup.)

# Code and Design Decisions

## Libraries & Tooling

The brief encourages libraries "as is reasonable," with reasoning. The guiding
principle here was **minimalism** — lean on the framework and a couple of well-justified
libraries, and deliberately _not_ add others.

- **Tailwind CSS v4** (added) — for styling. I chose it for the **performance** (it
  generates only the utilities actually used, so the shipped CSS stays tiny, and v4's engine
  is fast), the **reduced boilerplate** (styles live in the markup — no separate stylesheet
  files, no class-name bookkeeping, and v4 is config-less with design tokens in
  `styles/global.css` via `@theme`, so there's no `tailwind.config.js` to maintain), and
  **no cascade surprises** (utilities apply directly to each element, so there are no
  specificity wars or unintended inherited/overriding styles to debug). This suits a
  design-driven, responsive task like this.
- **@react-google-maps/api** (bundled by the boilerplate) — used as-is for the map. It's
  the idiomatic React wrapper around the Google Maps JS SDK and was already provided, so
  there was no reason to swap map providers.
- **Jest + React Testing Library + jest-dom** (boilerplate) — testing (see below).
- **Prettier** (boilerplate) — formatting.

Deliberately **not** added, to avoid over-engineering:

- **No state-management library** (Redux/Mobx) — disallowed by the brief, and unnecessary:
  favorites use React Context + a `localStorage` hook.
- **No data-fetching library** (e.g. React Query) — the data needs are simple (one endpoint,
  cache-first). A small custom hook is clearer here than pulling in a dependency; in a larger
  app React Query would be the natural choice (it manages the fetch lifecycle but does _not_
  validate data — that stays a separate concern).
- **No runtime-validation library** (e.g. Zod) — see Known Limitations.

## Project Structure & Extensibility

The assignment notes the app should be built so that other pages could be added later,
without over-engineering. The structure reflects that:

```
pages/            File-based routes. The listings page is the landing page (`/`).
components/
  layout/         Shared app chrome (Header, Layout) — reused across pages.
  listings/       Feature-specific UI (PropertyCard, PropertyList, ListingsMap, FavoriteButton).
hooks/            useLocalStorage (generic), useProperties (feature data-loading).
lib/              Framework-free utilities: storage (localStorage helpers + keys),
                  format (presentation formatters), simplyrets (API client), maps (map config).
context/          FavoritesContext — app-wide favorites state.
types/            Shared domain types (Property).
```

How this supports new pages:

- **Feature-based folders.** A new page (e.g. a property detail or "saved homes" view)
  adds its own `components/<feature>/` folder and a file under `pages/`, and reuses the
  shared `layout`, `lib`, `hooks`, and types untouched.
- **Reusable global chrome.** `Header` takes a `title` prop instead of hardcoding the page
  name, so any page renders `<Header title="…" />`.
- **App-level state lives above the page.** `FavoritesProvider` is mounted in `_app.tsx`,
  so favorites aren't coupled to the listings page — any future page can call
  `useFavorites()` and read/write the same persisted state. (This is also why favorites
  use Context rather than local `useState`.)
- **Generic primitives stay generic.** `useLocalStorage` is a `useState`-shaped hook (not
  favorites-specific), and `STORAGE_KEYS` centralizes keys in one place.
- **Path aliases** (`@/components`, `@/hooks`, `@/lib`, …) keep imports flat as the tree grows.

**Intentional limit (avoiding over-engineering):** `Header` is shared because every page
needs it, but `Layout` is _not_ generalized — it's shaped around this page's two-panel
map/list pattern and owns the mobile map/list toggle. With only one page in scope, building
a speculative generic page-shell would be over-engineering. If a second, differently-shaped
page were added, the natural refactor would be to extract a small `<PageShell title>`
(header + `<main>`) and rebuild `Layout` on top of it.

## Data Loading, Caching & Map Filtering

All of this lives in the `useProperties` hook:

- **Cache-first paint, then refresh.** On load the hook hydrates immediately from the
  `localStorage` cache (instant first paint, no spinner on a return visit), then fetches
  fresh data from SimplyRETS and re-caches it. The `/properties` response is cached under
  `side:properties`, satisfying the "cache in local storage" requirement.

- **Resilient refresh.** If the background fetch fails, the hook keeps showing the cached
  data and records the error rather than blanking the list — so a flaky network degrades
  gracefully instead of emptying the page.

- **Client-side bounds filtering.** As the map pans/zooms, the visible list is filtered to
  the map's viewport **in the browser**, by `.filter()`-ing the already-loaded set against
  the current bounds — rather than re-querying the API on every map movement. With the
  small trial dataset this keeps the map responsive and avoids rate-limiting.
  **Trade-off:** this only works because the whole dataset is fetched up front, which
  wouldn't scale to a real MLS. For production I'd switch to a bounds-parameter API query
  (likely debounced) so the server returns only what's in view.

- **Hidden-map guard.** The map only reports bounds while it is actually visible (a
  zero-size guard in `ListingsMap`), so a hidden map (e.g. the mobile list view) can't
  collapse the list to an empty state — bounds stay `null` and the list shows everything
  until the map is shown. This makes bounds-filtering behave consistently on desktop and
  mobile.

## Favorites

Clicking a card's heart toggles its `mlsId` in a favorites array persisted to
`localStorage` (`side:favorites`). State is exposed app-wide via `FavoritesContext`
(+ a generic `useLocalStorage` hook), satisfying the "store favorited properties in local
storage" requirement without a third-party state library. The hook also listens for the
`storage` event, so favoriting in one tab reflects in others.

## Responsive Behavior

- **Desktop (≥768px):** sticky header, 50/50 map (left) + scrollable list (right).
- **Mobile (<768px):** one panel at a time with a floating `MAP VIEW` / `LIST VIEW` toggle,
  per the Figma. Both panels stay mounted (hidden via CSS) so the map keeps its camera and
  the list keeps its scroll position when toggling.
- **List columns:** 1 column, expanding to 2 from the `lg` breakpoint (1024px), capped at 2
  to match the mockup. Supported widths 375–1680; intermediate behavior is inferred.

## Accessibility

- Semantic landmarks (`<header>`, `<main>`) and a clean heading outline (`h1` page title →
  `h2` per card address).
- The favorite control is a real `<button>` with `aria-pressed` + a state-aware
  `aria-label`; the heart SVG is marked decorative.
- Async states use live regions (`role="alert"` / `role="status"`, `aria-busy` on the
  loading skeleton).
- Visible `focus-visible` outlines on custom buttons; the loading skeleton respects
  `prefers-reduced-motion`.
- `<html lang="en">` set via a custom `_document`.

## Testing

Run with `yarn test:ci` (single run) or `yarn test` (watch). Stack: **Jest +
React Testing Library + jest-dom**, in a `jsdom` environment (already configured by
the boilerplate). Tests live in `__tests__/`, with a shared `Property` fixture in
`test-utils/`.

The goal was confidence per unit of effort, not a coverage number — so the suite is a
small **test pyramid** that targets the code carrying the most risk, by _type_:

- **Pure unit tests** (`format.test.ts`, `storage.test.ts`) — the formatters and the
  localStorage helpers. Pure, deterministic, no mocking, so they pin down the exact
  spec rules (½-bath math, USD, `MM/DD/YY`, timezone-stable dates) and the persistence
  guarantees (missing key / corrupt JSON fall back instead of throwing) very cheaply.
  Highest ROI, so the base of the pyramid.

- **Hook / integration tests** (`favorites.test.tsx`, `useProperties.test.tsx`) — the
  stateful logic. `useFavorites` is tested through its public API _and_ asserts it
  persists to localStorage, exercising the context + `useLocalStorage` + storage
  helpers together (how they actually run). `useProperties` mocks `fetchProperties`
  to cover fetch-on-mount + caching, the client-side bounds filtering, and the
  resilience path (a failed refresh still shows cached data) — fast and deterministic,
  no real network.

- **Component tests** (`FavoriteButton.test.tsx`, `PropertyCard.test.tsx`) — the
  user-facing output. Queried through the **accessible API** (`getByRole`, name,
  `aria-pressed`) so they double as accessibility checks and don't couple to markup
  details. `FavoriteButton` covers the click → toggle → state-and-label change;
  `PropertyCard` verifies the formatters reach the screen correctly and the
  missing-photo placeholder renders.

**What's intentionally not covered (time-boxed):** the Google Maps integration
(`ListingsMap`) isn't unit-tested — the value there is real map rendering and
pan/zoom, which is better served by E2E (Playwright/Cypress) against a real or stubbed
Maps API than by mocking the SDK. I'd add a couple of E2E happy-path flows
(load → favorite → reload persists; pan map → list updates) as the next layer.

## Assumptions & Simplifications

- **Listings is the landing page (`/`).** The boilerplate splash and `/listings` route were
  removed so the deliverable is the entry point.
- **Colors/spacing are approximated from the Figma.** Design tokens (`--color-header`,
  `--color-toggle`) are eyeballed; `--color-toggle` was darkened from the mockup value to
  meet WCAG AA contrast (noted in `global.css`) and should be reconciled with the real token.
- **`address.full` is shown as the card address.** The SimplyRETS `full` field is the street
  line; city/state are available on the type if a fuller address is wanted later.
- **Baths** = `bathsFull + bathsHalf * 0.5`; **list date** = `MM/DD/YY` (UTC, to avoid
  timezone day-shift); **price** = USD, no decimals; **map pins** show an abbreviated price.
- **The full dataset is fetched once** (no pagination); see the bounds-filtering trade-off.
- **On mobile the list shows all listings** when the map view isn't open, and filters to the
  map area once the map has been shown — a graceful choice over an empty list.

## Known Limitations & Trade-offs

- **No runtime validation of the API response.** `fetchProperties` casts the parsed JSON
  to `Property[]` (a compile-time-only assertion) rather than validating each listing at
  runtime. If SimplyRETS returned an unexpected shape, the error would surface downstream
  in a component rather than at the fetch boundary. This was a deliberate scope decision for
  a timeboxed exercise against a stable, documented API. In production I'd validate at the
  boundary — either a hand-written type guard or a schema library (e.g. Zod) with the
  `Property` type derived from the schema — so malformed listings are dropped or reported
  instead of rendered.

- **SimplyRETS credentials are hardcoded (intentionally).** The trial `simplyrets` /
  `simplyrets` Basic Auth credentials are kept as constants in `lib/simplyrets.ts`. They
  are public, documented demo credentials (printed in INSTRUCTIONS.md) for read-only fake
  data — not secrets — so there's nothing to protect by moving them to env vars. Crucially,
  the request runs client-side, so a `NEXT_PUBLIC_*` env var wouldn't hide them either:
  they'd still be embedded in the bundle. For genuinely private credentials the real fix is
  to proxy the request through a server route (API route / Route Handler) so they never
  leave the server — which is the production approach, but over-engineering for a public
  trial API here. (The Google Maps key is a separate case — it lives in `.env.local`
  because it's tied to a real Google Cloud project with quota/billing, even though it too is
  ultimately exposed client-side.)

## Left Out / Future Work (time-boxed)

- Runtime response validation (above) and a server-side API proxy.
- E2E tests for the map interaction (above).
- Reconciling exact Figma design tokens (colors/spacing/typography).
- Pagination / infinite scroll and richer filtering or search beyond the map area.
- Marker clustering for dense areas, and syncing the map to a clicked list card.
