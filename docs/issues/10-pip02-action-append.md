## Why

A PIP-02 coordination is only a chain if actions link correctly: one `e` root ref and one
`e` prev ref, appending only where the current tip was and never after a terminal
outcome. This is the "writing" half of the ledger (reading/validation is #11).

## Read first

- PIP-02 action requirements (tags, content, chain validation order):
  https://github.com/pontmore/protocol/blob/main/PIP-02-coordination-event-chains.md
- `src/lib/pip02/chain.ts` (buildActionDraft exists; appendAction stub tagged #10)
- `src/lib/pip02/reconstruct.ts` (tip lookup helpers stay in #11 — do not reimplement)

## Implementation guide

1. `appendAction(input: AppendActionCall)`:
   - resolve current tip: query kind-7301 events by `#e` = coordinationId, verify each has
     valid root ref, compute tip by walking `prev` links (light re-implementation is OK
     here; full validation belongs to #11).
   - fork guard: if two actions share the same prev → refuse to append, surface
     `ForkedCoordinationError` to the caller (PIP-02: freeze, retain evidence, no
     winner-by-order).
   - enforce from cache/expiry: reject when coordination not accepted (`root` only)
     or a terminal action exists in the tip's ancestry (light check).
   - build draft, `signEvent` with the actor's key, `publishEvent`, return
     `{ event, coordination_id }`.
2. Unit tests: linear append ok; duplicate root refs rejected; unavailable tip → clear
   error; same-prev second action → ForkedCoordinationError, nothing published.

## Acceptance criteria

- [x] Action has exactly one "root" e-tag and one "prev" e-tag
- [x] It never publishes after a discovered terminal action
- [x] Fork refusal preserves the forked events as evidence (does not delete/ignore)
- [x] Manual two-action sequence reads back as root → a1 → a2 via prev links (#11 will
      validate fully)

## Out of scope

- Full kernel invariant validation, state derivation & disputes (#11)
- Role authorization lookups beyond signer-key presence (validated in #11)
- Retransmission/relay fallback strategies

## Functions touched

`appendAction()` — one (buildActionDraft already shipped).
