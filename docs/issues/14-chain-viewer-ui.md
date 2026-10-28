## Why

This is the "no central coordinator" proof on screen: paste any coordination id and watch
the chain be rebuilt purely from relays. Judges see that removing the app server changes
nothing about what can be verified.

## Read first

- `src/app/chain/page.tsx`, `src/app/chain/[coordinationId]/page.tsx` (placeholders)
- `src/lib/pip02/reconstruct.ts` (#11 output shape)
- `docs/demo-script.md` (chain-viewer segment, what to show)

## Implementation guide

1. `useChainEvents(coordinationId, relays)` — client hook:
   - subscribe via `SimplePool.sub` (live updates) + initial `querySync`;
   - state: `{ root?, actions: ParsedAction[], state, disputed, forked, error, loading }`
     driven by `validateKernelInvariants`.
2. `renderChainTimeline(chain)` — component:
   - vertical timeline; each row: action id, signer (npub short), time, data
     (payment_reference only — never print more), inline "verified" badge per action.
   - fork banner if `forked`; dispute banner if `disputed`.
   - shareable URL `/chain/<id>`; no auth; works behind relays only.
3. Polishing: dark theme already in globals.css; keep to the existing design language.

## Acceptance criteria

- [x] Opening seeded root in a *fresh incognito* browser reconstructs fully
- [x] New actions appended while the page is open appear live (subcribe push)
- [x] Invalid/unreachable id renders a clear empty state (not a crash)
- [x] No personal data beyond opaque references is shown
- [x] Lighthouse mobile score ≥ 85 on the page

## Out of scope

- Historical archive/index browsing (query by id only)
- Export PDF/receipts (future)
- Editing the demo story itself (#17)

## Functions touched

`useChainEvents()`, `renderChainTimeline()` — exactly two.
