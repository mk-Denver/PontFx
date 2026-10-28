## Why

Edge node operators need one screen: "am I publishing, at what spread, what happened
recently". This feeds the demo's second persona (liquidity provider) and the roadmap's
'AMM one-click' claim for future work.

## Read first

- `src/app/node/page.tsx` (placeholder)
- `src/lib/node/engine.ts` (computeQuote, setInventoryConfig — exist)
- `src/lib/node/publisher.ts` (#2 output state)

## Implementation guide

1. `useEdgeNodeStatus()`:
   - reads the publisher's last-published events (kinds 30360/30361/30364) from relay for
     the local node key (NOSTR_SK via a tiny `/api/node/status` server route — NEVER the
     key itself).
   - inventory/spread inputs patch `setInventoryConfig` via the same route.
   - shows: last quote age (fresh/expired), capability set, relay list, recent
     coordination ids where this node was the agent (query root p-tags by self pubkey).
2. Single page, no routing complexity; live refresh every 30s; works while publisher
   runs in another terminal (#2's `npm run node`).

## Acceptance criteria

- [x] Page shows non-stale quote indel with countdown and honors spread env defaults
- [x] Editing spread triggers fresh quote publish within one interval
- [x] Server route never accepts or returns NOSTR_SK/set of keys — status only
- [x] Works with zero Amboss credentials (discovery-only page)

## Out of scope

- Historical PnL accounting, fee statements
- Multi-node management
- Automated inventory from real channel balances (future work)

## Functions touched

`useEdgeNodeStatus()` — one (+ small client-side fetch helper, no domain logic).
