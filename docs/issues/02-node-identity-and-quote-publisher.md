## Why

The seeded edge node publishes a one-shot quote. A real edge node is *alive*: it republishes a
fresh kind-30364 quote every `FX_REFRESH_INTERVAL_SECONDS` and maintains a human-readable
Nostr profile (NIP-01) + relay list (NIP-65) so clients can render its identity.

## Read first

- `src/lib/quotes/schema.ts` (buildQuoteDraft — exists)
- `src/lib/node/engine.ts` (computeQuote, setInventoryConfig — exist)
- PIP-00: profile/relay-list events are *distinct* from the Agent definition; never merge
  their fields into the capability claim

## Implementation guide

1. `src/lib/nostr/profile.ts` — `updateNostrProfile({ name, about })`:
   - kind 0 profile event, kind 10002 relay-list event (both signed with the node key,
     published via existing `publishEvent`).
2. `src/lib/node/publisher.ts` — `runQuotePublisher()`:
   - loop: `computeQuote(setInventoryConfig(), env.FX_MID_RATE_STABLE_PER_SAT)` →
     `buildQuoteDraft({ quoteId, rate, min/max, expiresAt: now + 3 * refresh })` →
     `signEvent` → `publishEvent`.
   - quote_id = `${pubkey.slice(0,8)}-${epoch counter}`; log last-published event id.
   - graceful stop on SIGINT; single loop instance (module-level guard).
3. Export `npm run node` (`tsx scripts/run-node.ts`) as the edge node entrypoint.

## Acceptance criteria

- [x] `npm run node` republishes a fresh 30364 at the configured interval
- [x] quote `expires_at` is always ~3 refresh windows ahead of `created_at`
- [x] `npm run check` shows exactly one current 30364 per pubkey (addressable `d=fx-quote`)
- [x] profile + relay-list events appear once per key (kinds 0, 10002)
- [x] restarting the loop never forks the quote coordinate (latest wins)

## Out of scope

- Runtime inventory re-balancing from actual channel balances (env-driven config only)
- Indexer for other agents, UI (dashboard is issue #16)
- Multi-asset quotes beyond btc/usdt pair

## Functions touched

`runQuotePublisher()`, `updateNostrProfile()` — exactly two.
