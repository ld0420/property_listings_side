# AI Usage

## Tools

- **Claude Code** — used interactively throughout, as a pair-programmer:
  scaffolding, writing implementations to my spec, explaining trade-offs, and reviewing.
- No custom Claude Code agents or skills (`.claude/agents`, `.claude/skills`) were created
  for this project, so there are none to commit. Usage was plain interactive prompting.

## How I worked with it

I owned the **architecture and the decisions**; I used the AI to **write code faster** and
to pressure-test my thinking. Concretely, my workflow was:

1. **I made the structural calls** — feature-based folder layout, the listings page as the
   landing route, favorites in React Context (not Redux/Mobx, per the brief) persisted via a
   generic `localStorage` hook, client-side bounds filtering vs. re-querying the API, and the
   responsive desktop-split / mobile-toggle model.
2. **I deliberately started with a scaffold, not finished code** — I had the AI lay out the
   files as stubs with the function **names, signatures, and intended inputs/outputs I
   wanted** (e.g. `formatBaths(bathsFull, bathsHalf) → number`, `readStorage/writeStorage`,
   `useProperties(bounds)`), then filled in / directed the implementations. This kept the
   interfaces mine and let me reason about the design before any logic existed.
3. **I implemented and directed the logic, feature by feature** — fetch + cache hook,
   favorites toggle, formatters, the map integration, the responsive behavior — reviewing
   each piece and asking the AI to explain anything I wanted to be sure of (SSR-safe
   `localStorage` hydration, the favorites context guard, why bounds filtering is
   client-side) so I can defend it.
4. **I reviewed every change and corrected the AI where it was wrong** (examples below).

## Decisions I accepted as-is

- The SSR-safe `useLocalStorage` pattern (initialize from default, hydrate in an effect to
  avoid hydration mismatch) — reviewed and agreed with the reasoning.
- The cache-first-then-refresh shape of `useProperties`, including the unmount race guard.
- The `FavoritesContext` + throw-if-no-provider pattern.
- The test pyramid structure (pure units → hook/integration → component).
- The AI's v4-specific setup once I'd chosen Tailwind (see note below).

> Styling was **my** call: I chose Tailwind for the performance (minimal generated CSS),
> reduced boilerplate (no separate stylesheets/config), and no cascade/specificity surprises.
> The AI handled the v4 wiring (`@theme` tokens, PostCSS) after I picked it.

## Suggestions I modified

- **Map default center/zoom** — the AI first guessed Houston coordinates _from memory_. I had
  it verify against the live SimplyRETS response, which confirmed the region but showed the
  guess was off-center; I adjusted the center and zoom.
- **List grid breakpoint** — the AI initially used an arbitrary `min-[1000px]:` breakpoint; I
  asked for a **standard** Tailwind breakpoint, so it became `lg:grid-cols-2`.
- **Card image sizing** and **favorite icon size** — I changed these directly to match the
  mockup.
- **Map config extraction** — I moved the map constants/helpers into a dedicated `lib/maps.ts`
  rather than leaving them inline in the component.
- Tailwind v4 as the styling approach.

## Suggestions I rejected / overrode

- **`centerOffset` → `format.ts`** — when I asked about relocating this helper, the AI pushed
  back (it's map-positioning, not formatting); I agreed and we put it in `lib/maps.ts`
  instead. (Good example of not blindly following the tool.)
- **Runtime API validation** — the AI offered to add a type guard / Zod; I decided to keep the
  typed cast and **document it as a deliberate trade-off** instead, given the timebox and the
  stable trial API.
- **Env-ing the SimplyRETS credentials** — I questioned whether they should be hidden; we
  concluded they're public demo creds and a client-side fetch wouldn't hide them anyway, so I
  kept them hardcoded with a documented rationale.

## Things the AI got wrong that I caught

- **Responsive empty-list bug** — its first fix gated bounds filtering to desktop only (so the
  mobile list ignored the map). I wanted mobile to behave the same as desktop, so we reworked
  it into a "zero-size map" guard, which fixed the root cause and unified the behavior.
- **`loadError` ordering** — the loading check was placed before the error check, which would
  spin forever on a map load failure; I had it reordered.
- **Over-eager attribution** — earlier drafts of this very file credited AI-written code to me;
  I corrected it to reflect what was actually AI-generated vs. my own edits.

## Bottom line

The architecture, the trade-offs, and the acceptance/rejection calls are mine; the AI
accelerated the typing and acted as a reviewer/explainer. I reviewed all output, adjusted or
overrode it where my judgment differed, and made a point of understanding each piece well
enough to defend it.
