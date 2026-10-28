## Why

`initiateSwap` is the first VERTICAL slice: quote in → public coordination root out →
exchange-ready invoice in the user's hand. It is where the PIP side (#9) meets the
combat side (#5) for the first time.

## Read first

- `src/lib/swap/engine.ts` (stub)
- `docs/architecture.md` (data plane vs coordination plane)
- PIP-02 + `docs/profiles/pontfx-swap@1.md` (which actions follow the root and who signs)

## Implementation guide

1. `initiateSwap({ quote, amount })`:
   - resolve leg sizes: for `btc_to_stable` customer pays sats and receives stable;
     for `stable_to_btc` the customer's stable amount buys sats.
   - build `SwapTerms` from quote + amount, deadlines = now + 2 min legs' buffer.
   - call `createSwapRoot(#9)` with the customer key (browser NIP-07 or local dev key)
     as proposer and edge node/amboss/market-resolver keys injected from env.
   - immediately append `core/accept` by `swap/agent` edge key (#10) — pre-acceptance by
     deterministic quote, no counterparty wait in v1.
   - call `receive(#5)` on the leg the CUSTOMER pays, with metadata containing
     `coordination_id`; bind `swap/btc_leg_settled` or the stable leg as appropriate in
     the NEXT action later (#13).
   - return `SwapHandle { coordination_id, invoice, quote }`.
2. All failures leave the chain in a non-terminal but explicit state; if root published
   but accept fails, log + surface (do not silently lift the swallowed error).

## Acceptance criteria

- [x] /swap flow can acquire a root + handle invoice in under 5s against sandbox
- [x] Root binds the quoted terms exactly in `terms`
- [x] metadata continuity: `coordination_id` present on Amboss leg
- [x] Errors never leave the customer with a half-published root without a decline or
      cancel path documented (manual, or issue #13's expiry path)
- [x] Integration play (documented in README dev section) runs against seeded relay +
      sandbox to completion EXCEPT final settle (which lands in #13)

## Out of scope

- `executePayout`/`finalizeSwap` (issue #13)
- Bridge loop selection (poll vs webhook) — engine consumes whichever is wired
- UI (issue #15) — this issue is backend callable only

## Functions touched

`initiateSwap()` — one (num earlier inputs compose existing functions).
