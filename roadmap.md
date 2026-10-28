# PontFX Roadmap — Dakar Bitcoin Hack by BTrust 2026

**Deadline: Nov 20, 2026, 20:00 UTC** (Devpost submission). Written Oct 28, 2026 — 23 days, 17 issues, every issue capped at two functions.

## The one demo

A BTC↔USDT swap over Lightning where **every state change is a signed Nostr event**
reconstructable by a third party with no backend. If the end-to-end settled/refunded path
(issues #7–#13) works against Amboss sandbox plus the seeded local relay, we have a
submittable, verifiable MVP.

## Phases

| Phase | Window | Issues | Exit criteria |
| --- | --- | --- | --- |
| **Phase 0 — Sandbox foundations** | Oct 28 – Nov 1 | #1, #2, #3 | Relay + seeded node reproducible fresh; Amboss ids printed by script |
| **Phase 1 — Discovery and legs** | Nov 2 – Nov 5 | #4, #5, #6 | `/swap` client lists live quotes; receive+send legs deterministic in sandbox |
| **Phase 2 — Coordination core** | Nov 6 – Nov 10 | #7, #8, #9, #10, #11 | Full PIP-02 lifecycle derivable from relays: root → linked actions → validated states; bridge transports both |
| **Phase 3 — Swap engine** | Nov 11 – Nov 13 | #12, #13 | `initiateSwap` → legs settle → `settled`; timeout path → `refunded` |
| **Phase 4 — Demo surfaces** | Nov 14 – Nov 16 | #14, #15, #16 | Three-persona UI: customer swap, operator node, independent verifier |
| **Phase 5 — Ship** | Nov 17 – Nov 20 | #17 (# **code freeze Nov 17**) | Video ≤3:00, Devpost complete, README verbatim-reproducible |

## Dependency map

```
#1 ──→ everything (runtime)
#3 ──→ #5/#6 (wallet ids)
#4 ──→ #12 (quote discovery), #16 (what the operator publishes)
#5/#6 ──→ #12/#13 (leg primitives)
#7/#8 ──→ #13 (settlement observation); #9/#10 ──→ #11; #11 ──→ #12/#14
#12 ──→ #13 ──→ #15 (visible end-to-end flow)
#11+#12+#13 ──→ #14 (verifiable timeline) ──→ #17 (demo reel)
```

Critical path: **#3 → #5 → #9 → #10 → #12 → #13**. If anything must slip, slip #16 first,
then #15 polish (core flow can run via `/swap` minimal + `/chain`).

## Hard constraints from the specs (these are not negotiable inside issues)

- PIP-00: capability tags and `content.capabilities` must match exactly; a mismatched claim
  is rejected, never merged.
- PIP-01: descriptor is compatibility only — no wallet ids/secrets/instructions in content.
- PIP-02 kernel: version pinning (`2`, `pontfx/swap@1`), one root, linear chain, signer
  authorization from root-bound pubkeys, `settled` ⊥ `refunded`, fork ⇒ freeze (no
  winner-by-order), no actions after terminal.
- Things that make the project *honest*: quote bytes committed via `sha256-bytes@1`;
  `payment_reference` opaque; no preimages/PII/instructions in public content.

## Judging-criteria mapping (Devpost)

| Criterion | Where it is answered |
| --- | --- |
| Usefulness & local impact | README problem statement; merchants selling day-to-day in stable units while settling on LN; primary user = ECOWAS/WA merchant + remitter |
| Security by design | Threat model section (`docs/architecture.md`), signer boundaries (NIP-07 vs env key), fork-freeze, no-PII-by-construction, HMAC webhooks |
| UX/UI quality | #15 constraints (3G budgets, inline errors, no spinner-forever), #14 shareable/no-auth verification |
| Working MVP | One-command compose + seed + dev; sandbox-deterministic demo; pytest-equivalent vectors (`#11`) |
| Pitch & docs | #17: 3-minute video following `docs/demo-script.md`; README with setup/architecture/constraints/metrics/next |

## Risk register

1. **Amboss sandbox send destinations unknown** (USDT lightning-address payouts) — spike in
   #6; fallback demo uses same-asset exchanges; document result in README.
2. **ghcr.io blocked on dev machines** — compose already defaults to `dockurr/strfry` (done in #1).
3. **Apple-style "works on my machine"** — CI runs typecheck+test+build on every push (#1);
   fresh-clone verbatim run is an explicit acceptance item in #17.
4. **Scope creep** — the issue bodies each carry explicit *Out of scope* lists; anything not
   listed there goes to `roadmap.post-hackathon`, not the codebase. Code freeze Nov 17.
5. **Single-relay demo risk** — event duplication across ≥2 relays (local strfry + one public)
   is allowed by design; keep relays configurable (`NEXT_PUBLIC_RELAYS`).

## Out of scope for the entire hackathon (stated once, loudly)

Fiat/mobile-money legs (M-Pesa, Wave, Orange Money) — participants' responsibility, outside
the protocol; custody; order-book matching engine; reputation systems; USSD. PontFX
coordinates and settles **verifiable legs only**.

## Post-hackathon sketch (not committed work)

Real tapd edge nodes (drop-in replacement for the Amboss overlay), AMM-style inventory
pricing, gift-wrapped private payload channels, dispute/resolver ceremony, knock-on
`pontmore/swap@1` fiat profile with licensed ramp partners, USSD front door.
