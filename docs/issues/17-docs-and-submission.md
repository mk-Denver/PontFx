## Why

Judges grade pitch + docs explicitly (3-minute demo, README with setup/architecture/
constraints/metrics/next steps). The difference between a working repo and a winning
submission is a crisply-scored submission package.

## Read first

- Devpost actual page: https://dakar-bitcoin-hack-2026.devpost.com
- `docs/demo-script.md`, `docs/architecture.md`, `docs/profiles/pontfx-swap@1.md`
- Roadmap's judging-criteria mapping table

## Implementation guide

1. README final pass:
   - one-command quickstart verified verbatim from a fresh clone;
   - architecture diagram trimmed to judging context; the "out of scope, by design"
     boundary (verifiable legs only; fiat rails = participants' responsibility)
     stated in one loud paragraph;
   - explicit experimental conformance statement per Pontmore README rules
     (pin versions; no finality language).
2. Recording: 3-minute screen capture following `docs/demo-script.md` beats —
   problem → discovery → execution → chain proof (incognito) → boundary.
3. Devpost fields drafted directly from README/demo script; submit:
   - "What it does" mentions PIP-00/01/02 + pontfx/swap@1 profile + kernel conformance.
   - Security-by-design section: key handling (NIP-07 / env key boundaries), threat
     model of trust boundaries (authorship ≠ availability), fork-freeze behavior.
   - "Constraints" honest list: sandbox execution overlay, single profile, no fiat.
4. Metrics to track (README table): time-to-first-quote, root→settle seconds,
   # relays online at demo time, chain validation pass rate on vectors.

## Acceptance criteria

- [x] Fresh clone → commands work verbatim (human-timed during dry run)
- [x] Video ≤ 3:00, uploaded, link in Devpost
- [x] Devpost submission checklist 100% complete incl. team/screenshot entries
- [x] README includes threat model + metrics table + next-steps-post-hackathon

## Out of scope

- Any feature work after the code freeze (no new scope here)
- Blog post/external marketing beyond Devpost
- Legal/licensing advice; CC0 vs MIT debates (MIT shipped)

## Functions touched

None (documentation + submission only).
