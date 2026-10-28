## Why

For `btc_to_stable` the edge node disburses the stable leg (and vice versa). `send` is the
payout primitive; it must retry idempotently and never double-pay on re-drive.

## Read first

- https://docs.amboss.tech/sdk/transactions#sending (send inputs, password semantics)
- https://docs.amboss.tech/payments/payment-destinations (bolt11 / lightning addresses)
- `src/lib/amboss/client.ts` (SendLegInput + send stub)

## Implementation guide

1. `send(input: SendLegInput)`:
   - `payments.transactions.send({ walletId, password: process.env.TEAM_PASSWORD,
     destination, metadata: { coordination_id, amb_sandbox_behavior } })`.
   - sandbox: any non-empty password works; live: real team password required (document).
   - normalize destination: `{ bolt11: "…" }` or `{ lightning_address: "…" }`; forbid both
     and forbid neither (throw typed error).
   - return `{ transactionId }`; on retry use the SAME `coordination_id` metadata so Amboss
     idempotency prevents duplicate payouts.
2. Unit tests: destination validation matrix + metadata passthrough (mock transport).

## Acceptance criteria

- [x] Sandbox send with `amb_sandbox_behavior: complete|fail|expire` reaches the same
      terminal states as receive leg does
- [x] Duplicate invocation with same coordination_id does not create a second payout
      (Amboss idempotency; assert via two calls, one transaction)
- [x] Destination validation rejects empty/both/neither without any network call
- [x] Password is read from env only, never logged in ndebug output

## Out of scope

- Receive leg/polling (issue #5)
- Multi-destination batches, on-chain sends, MM swaps
- Publishing actions to Nostr (issue #8 consumes the result)

## Functions touched

`send()` — one.
