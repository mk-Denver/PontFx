## Why

Reconstruction is the anti-coordinator argument: any third party replays validated
root + actions from relays alone and derives the state machine — no operator database is
needed to know whether a swap is `settled`, `refunded`, forked, or disputed. This is also
what the demo's chain viewer (#14) and TV-frame "trust but verify" slide stand on.

## Read first

- PIP-02 chain validation steps, kernel invariants, terminal states, fork handling:
  https://github.com/pontmore/protocol/blob/main/PIP-02-coordination-event-chains.md
- `docs/profiles/pontfx-swap@1.md` (authorization table, reconstruction paths)
- `src/lib/pip02/reconstruct.ts` (stubs + parse helpers exist)

## Implementation guide

1. `reconstructSwapChain(coordinationId)`:
   - fetch root (kind 7300, id = coordinationId) + all kind-7301 actions where
     `#e = coordinationId`; verify Nostr ids/sigs; dedupe event ids.
   - walk linearly: action[i].prev must equal previous tip; duplicate/replayed semantic
     action rejected; signer must be root-pubs/regulator per #11 authorization table.
   - two valid actions referencing the same prev → `forked: true`, freeze.
2. `validateKernelInvariants(root, actions)`:
   - implement invariant table: settle/refund exclusivity, no economic action after
     terminal, escrow-only actions, authorization roles; state machine:
     `proposed → accepted → secured → (leg actions) → authorize → settled|refunded`,
     dispute overlay states.
   - return `ChainValidationResult { valid, state: { state, disputed }, reason }`.
3. Table-driven tests using fixtures: happy path, expiry path, refund path, dispute
   freeze/resume, fork, unsigned signer, double settle attempt, out-of-order replay.
4. Export a shared vector JSON for these fixtures under
   `src/lib/pip02/__vectors__/` — first conformance vectors for `pontfx/swap@1`
   (mention in Pontmore discussions later).

## Acceptance criteria

- [x] Reconstruction works on a seeded swap without app state (only relay data)
- [x] Covers normal settlement, no-payment refund, dispute freeze(resume effect), fork
- [x] Replays and duplicate semantics rejected with pointed reason strings
- [x] Vector fixtures cover ≥9 cases; every future change to the validator must run them

## Out of scope

- UI rendering (issue #14)
- Event signature cryptography beyond nostr-tools' own verify
- Verbably "arbitrating" disputes (only state derivation)

## Functions touched

`reconstructSwapChain()`, `validateKernelInvariants()` — exactly two.
