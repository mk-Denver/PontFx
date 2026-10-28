## Why

After the root + accept, the actual money legs must move and the chain must reach a
terminal state. This closes the loop from "invoice exists" to "`settled` on a relay-
verifiable chain" — the demo's money moment.

## Read first

- `src/lib/swap/engine.ts` (stubs tagged with this issue)
- `src/lib/pip02/reconstruct.ts` (reconstruction from #11; the engine calls it)
- Kernel authorization table in `docs/profiles/pontfx-swap@1.md`

## Implementation guide

1. `executePayout({ coordinationId, terms })`:
   - call `send(#6)` on the EDGE's outbound leg (stable for `btc_to_stable`, BTC for
     `stable_to_btc`), `metadata.coordination_id` bound.
   - append the profile action for the inbound customer leg once observed:
     `swap/btc_leg_settled` (payment_reference + optional payment_hash) — signer = the
     customer's key for their leg, per profile table.
   - transport is `FX_BRIDGE_MODE`-driven: poll uses `pollToActions(#8)`, webhook consumes
     route events from #7. Guard against double-append (idempotent pairing on
     coordinationId+payment_reference).
2. `finalizeSwap(coordinationId)`:
   - reconstruct chain (#11), require both leg actions present and undisputed;
   - append `core/authorize_settlement` (leg receiver signs) then `core/settle` by
     `core/escrow` key. Return `SwapCompletion { coordination_id, final_state:
     "settled", settle_amount }`.
   - timeout branch: when the customer's leg never lands before its deadline, append
     `core/expire` then `core/authorize_refund` + `core/refund` path (amboss cancellation
     is no-op in sandbox; recording is what makes the terminal state truthful).

## Acceptance criteria

- [x] Happy path reaches `final_state: "settled"` end-to-end against sandbox in a
      documented seed script or manual runbook
- [x] No-leg timeout path reaches `refunded` terminal state on the chain
- [x] Every terminal state is re-derivable from relays alone by #11's validator
- [x] No double settlement attempted on re-run; authorization table respected exactly

## Out of scope

- Dispute open/resolve flows (resolver UI/UX is future work; the validator in #11 already
  knows how to handle dispute states)
- UX surface (issues #14/#15)
- REAL tapd edge (Amboss sandbox only)

## Functions touched

`executePayout()`, `finalizeSwap()` — exactly two.
