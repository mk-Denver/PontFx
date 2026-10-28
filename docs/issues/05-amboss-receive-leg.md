## Why

FX edge execution needs a private channel that produces BOLT11 invoices and exposes leg
status. Amboss sandbox is execution overlay (Pontmore Design Boundary); the public chain only
ever sees signed actions binding to result references. This issue delivers the receive leg +
its poll tracker.

## Read first

- https://docs.amboss.tech/sdk/transactions (createReceive inputs, status polling)
- https://docs.amboss.tech/payments/environments (sandbox behavior + `metadata.amb_sandbox_behavior`)
- `src/lib/amboss/client.ts` (stubs tagged with this issue), `swap/types.ts`

## Implementation guide

1. `receive(input: ReceiveLegInput)`:
   - `payments.transactions.createReceive({ wallet_id, amount (base units string),
     description, metadata: { coordination_id, amb_sandbox_behavior } })`.
   - sandboxBehavior is passed through only in sandbox; live omit it.
   - return `{ invoice: transaction.payment_request, transactionId: transaction.id }`.
   - validate amount: positive decimal string; reject "0"/negatives before the API call.
2. `track(transactionId)`:
   - poll `payments.transactions.get({...})` (check exact name on the Transactions page)
     at `BRIDGE_POLL_INTERVAL_SECONDS` up to a hard cap (~2 min) → map status to
     `pending|completed|failed|expired` in `TrackedLeg` with `settleAmount`, `assetSymbol`,
     `paymentHash`.
   - unit test the status mapping with canned SDK responses (mock the client).

## Acceptance criteria

- [x] Sandbox: `receive` returns an `lnbc…` (or equivalent) BOLT11 invoice with
      `metadata.coordination_id` embedded
- [x] `track` transitions pending→completed when sandbox behavior `complete`
- [x] `track` returns `failed` / `expired` branches deterministically in sandbox
- [x] No secret (API key, wallet id) ever enters Nostr content or browser payloads
- [x] Unit tests cover status mapping incl. unknown status → pending (and log warn)

## Out of scope

- Send leg (issue #6), webhook transport + HMAC verify (issue #7)
- Ban/limits/fee accounting on Amboss side
- Any Nostr publishing (that's bridge issues #7/#8)

## Functions touched

`receive()`, `track()` — exactly two.
