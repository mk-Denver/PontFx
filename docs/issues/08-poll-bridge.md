## Why

Demos and CI cannot rely on public webhook URLs. The poll bridge converts observed leg
status (`track`) into the same PIP-02 action payload the webhook path would yield — one
ingestion model, two transports. `FX_BRIDGE_MODE=poll` (default) is the demo path.

## Read first

- `src/lib/amboss/translate.ts` (stub), `src/lib/amboss/client.ts` (TrackedLeg via track)
- `src/lib/amboss/webhooks.ts` (PIP02ActionPayload shape)

## Implementation guide

1. `pollToActions(coordinationId, leg)`:
   - `TrackedLeg` status `completed` → action payload by direction/asset
     (same mapping rules as webhook translation, implemented by the shared map —
     reuse the mapping function from #7 to avoid drift).
   - `failed|expired` → `{ action: null, reason: status }` payload shape.
   - `pending` → `null` (caller keeps polling).
   - Idempotence: the (coordinationId, payment_reference) tuple is remembered in a
     module-level Set — second call returns null.
2. Wire the swap engine's background loop later (#12/#13 choose transport by
   `FX_BRIDGE_MODE`); this issue only ships the pure function + tests.

## Acceptance criteria

- [x] Mapping parity: for every canned leg, pollToActions output equals the webhook
      translate output for the equivalent envelope
- [x] Idempotent on (coordinationId, payment_reference)
- [x] Pure function — no I/O, no clocks inside; inject `now` if needed
- [x] Unit tests cover completed/failed/expired/pending + dedupe

## Out of scope

- Webhook signature/HMAC (issue #7)
- Nostr publication, chain validation (issues #10/#11)
- Background scheduler (owned by engine issues #12/#13)

## Functions touched

`pollToActions()` — one.
