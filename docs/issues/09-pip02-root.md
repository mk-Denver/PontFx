## Why

The coordination root is the swap's public identity: immutable kind-7300 event pinning
profile `pontfx/swap@1`, exact terms, participants, escrow/resolver authorities, expiry and
the accepted quote's byte-commitment. Every later action hangs off it.

## Read first

- PIP-02 root requirements (tags, participants, escrow e/a binding, commitments):
  https://github.com/pontmore/protocol/blob/main/PIP-02-coordination-event-chains.md
- `docs/profiles/pontfx-swap@1.md` (terms schema, deadlines ordering)
- `src/lib/pip02/chain.ts` (buildRootDraft, sha256Hex — exist; stub tagged with this issue)

## Implementation guide

1. `createSwapRoot(input)`:
   - build draft via `buildRootDraft`; MUST include:
     - `p` tags: customer, agent, core/escrow, core/resolver (customer ≠ agent enforced)
     - descriptor binding: exact `["e", <descriptorEventId>, ..., "escrow-version"]` +
       addressable `["a", "30361:<pk>:<dTag>", ..., "escrow"]` referring to the SAME
       descriptor event; descriptor `created_at ≤ root created_at`; descriptor unexpired
     - `commitments.quote = { algorithm: "sha256-bytes@1",
       digest: sha256Hex(canonicalQuoteBytes) }` — hash the exact quote event bytes
       (event.id of the accepted 30364 is the stable canonical reference; alternatively
       hash `JSON.stringify(quoteEvent)` and store the serialization locally for
       byte-exact recomputation — pick ONE and document in the profile doc).
   - `signEvent` → `publishEvent` → return `{ event, terms, coordination_id: event.id }`.
   - throw typed error if `expires_at ≤ now` or deadlines misordered
     (`expires_at < btc_leg_settle_by ≤ stable_leg_settle_by`).
2. Unit tests: negative cases (same pubkeys, expired descriptor, misordered deadlines)
   throw before any publish; positive case tags match PIP-02 exactly.

## Acceptance criteria

- [x] Root carries all required role p-tags + both escrow refs (exact + addressable)
- [x] Quote commitment present and `sha256:`-prefixed 64-hex lowercase
- [x] Descriptor freshness checks enforced client-side
- [x] `npm run check` finds the root (kind 7300) after a manual invocation
- [x] Re-running with identical inputs produces a DIFFERENT root id (new created_at),
      never mutates an old root

## Out of scope

- Action chain logic (`appendAction`, invariants — #10/#11)
- Choosing the quote (the caller passes `quoteCommitment` bytes)
- Nostr NIP-77 sync/fetch strategy beyond `queryEvents`

## Functions touched

`createSwapRoot()` — one (buildRootDraft already shipped).
