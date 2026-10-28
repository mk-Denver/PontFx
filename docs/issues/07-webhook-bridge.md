## Why

Webhooks are Amboss's at-least-once settlement notifications. To keep the public chain
authoritative, each webhook must be HMAC-verified then translated into the exact
PIP-02 action it yields — verified once, mapped once, published to `#8`.

## Read first

- https://docs.amboss.tech/sdk/webhooks (verify payload/signature/timestamp)
- https://docs.amboss.tech/payments/verify-webhooks (HMAC recipe + header names)
- `src/lib/amboss/webhooks.ts` (stubs), `src/app/api/webhooks/amboss/route.ts`

## Implementation guide

1. `verifyAmbossWebhook(rawBody, headers)`:
   - use `makeAmbossClient().webhooks.verify({ payload: rawBody, signature, timestamp })`
     — RAW body string, not parsed JSON.
   - malformed/invalid → typed `WebhookSignatureError`; the route maps to HTTP 400.
   - duplicate envelope `id` → in-memory LRU dedupe; replay delivery returns ok,
     publishes nothing.
2. `translateAmbossEvent(envelope, request)`:
   - only `payment.completed` maps to an action payload; failed/expired map to
     `null` payload + `reason` (callers decide, see #8).
   - direction `receive`+USDT wallet → `swap/stable_leg_settled`;
     BTC wallet → `swap/btc_leg_settled`. `payment_reference = envelope.data.id`,
     `payment_hash = envelope.data.payment_details.payment_hash`.
   - metadata must carry `coordination_id`; missing → typed `MissingCoordinationError`.
3. Wire `src/app/api/webhooks/amboss/route.ts`: read raw body, verify, translate,
   log structured row; return 200. (Publishing to Nostr is issue #8's job.)

## Acceptance criteria

- [x] Valid signature → envelope parsed; invalid/tampered body → 400, no parse
- [x] Replay of same envelope id → 200, zero new publications
- [x] Direction/asset mapping is table-tested for both wallets
- [x] No raw payment data beyond payment_reference/payment_hash in the payload type
- [x] Route never crashes with a 500 from bad input (all errors typed)

## Out of scope

- Nostr signing/publication of the PIP-02 action (issue #8)
- Poll-based bridge (issue #8)
- Endpoint registration in Amboss dashboard (runbook note only)

## Functions touched

`verifyAmbossWebhook()`, `translateAmbossEvent()` — exactly two.
