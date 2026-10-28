## Why

The merchant/remitter's experience must be boring-cashier-simple: enter an amount, see the
best live rate, accept, watch the chain close. Judging criteria weigh UX friction-hard for
low-bandwidth, mid-range phones.

## Read first

- `src/app/swap/page.tsx` (placeholder), `docs/demo-script.md`
- `src/lib/pip00/discovery.ts` (#4), `src/lib/swap/engine.ts` (#12/#13)

## Implementation guide

1. `selectBestQuote(candidates, { direction, amount })`:
   - filter expired/rejected; compute cost in the user's asset; sort best-net-out;
     no best → typed `NoLiquidityError` for UI messaging.
2. `useSwapFlow()` — client hook managing the state machine:
   `idle → quotes_loaded → root_created → awaiting_invoice → leg_pending → (live chain
   state via #14's hook)`.
   - amount entry in either BTC sats or stable base units; rate preview with expiry
     countdown; state banner per swap state; on accept call `initiateSwap`.
   - NEVER block the main thread: discovery timeout 3s shows the last cached quote
     snapshot; a "slow relays" hint appears rather than a spinner forever.
3. Nothing in the UI displays API keys, wallet ids, or Amboss anything.

## Acceptance criteria

- [x] Full flow on a mid-range Android emulation over "3G" not worse than 6s to first
      quote display
- [x] Rate and amount errors (imbalanced min/max) are inline, humane, and localized-safe
- [x] Accepting twice cannot create two roots for the same flow entry
- [x] Demo path (seeded node + sandbox) completes the visible happy path
- [x] Session survives a page reload mid-flow (root id is deeplinkable to /chain)

## Out of scope

- Wallet-onboarding/NIP-07 fallback signing UX beyond existing getEmbeddedKey pattern
- i18n/wolof/french copy (stretch)
- USSD (explicit non-goal; post-hackathon)

## Functions touched

`selectBestQuote()`, `useSwapFlow()` — exactly two.
