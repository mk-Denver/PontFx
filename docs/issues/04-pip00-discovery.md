## Why

The swap client must find edge nodes and their live rates. PIP-00 defines discovery inputs
(agent definition + standard profile/relay-list), and quotes reference the agent pubkey.
This is the first "market-facing" capability: `/swap` needs it.

## Read first

- PIP-00 (raw): https://github.com/pontmore/protocol/blob/main/PIP-00-agent-definition.md
- `src/lib/nostr/query.ts` (queryEvents — exists), `src/lib/pip00/agent.ts`
- `src/lib/quotes/schema.ts` (parseQuoteEvent, isQuoteExpired — exist)
- `src/lib/pip00/discovery.ts` (stubs tagged with this issue)

## Implementation guide

1. `queryAgents()`:
   - `queryEvents([{ kinds: [30360], "#t": ["agent"], limit: 100 }])`.
   - parse content `{version, capabilities}`; MUST reject on tag/content mismatch
     (any `pontmore-capability:` tag whose id is absent from content.capabilities, or
     content capability missing its tag — PIP-00 rule).
   - only accept capability `pontfx/swap@1` for now; return `AgentDefinitionRecord[]`.
2. `extractQuote(agentPubkey)`:
   - fetch the agent's latest kind-30364 `d=fx-quote` (query by `authors: [agentPubkey]`,
     sort `created_at` desc, take newest).
   - `parseQuoteEvent` → reject if `isQuoteExpired` or pubkey ≠ quote signer's agent.
   - map to `Quote` (direction/from/to/rate/min/max) with the event attached; `null` on miss.
3. Unit test: fixture events for valid/invalid (tag-content mismatch rejected, expired quote
   rejected, wrong-author quote rejected).

## Acceptance criteria

- [x] Against seeded local relay: `/swap` can list agent + live unexpired quote
- [x] Mismatched `pontmore-capability` tags → rejected (PIP-00 canonicality rule)
- [x] Expired quote → null, not stale rate
- [x] Empty relays → empty array / null (no throw on discovery failure)

## Out of scope

- Best-quote ranking/aggregation UI logic (issue #15)
- NIP-05 / human profile fetch, reputation, availability proof (trust boundary stays:
  discovery proves authorship only)
- Multi-capability dispatch beyond pontfx/swap@1

## Functions touched

`queryAgents()`, `extractQuote()` — exactly two.
