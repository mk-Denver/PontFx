# PontFX — Working Context

> **Rules for any LLM or contributor touching this codebase:**
> 1. Read this file first, then `roadmap.md`, then the relevant issue in `docs/issues/`.
> 2. When you change ANY file, you MUST update this `context.md` in the same change:
>    the "Current State" section, the affected "Key Decisions" (only if a decision actually
>    changes — never silently rewrite history), and append one line to "Change Log".
> 3. Keep this file under ~150 lines. It is a pointer, not documentation — link, don't copy.
> 4. Never mark a task done in this file that hasn't been verified living (run it or test it).

## What this is

**PontFX**: Nostr-native FX coordination network over Lightning — BTC↔stable-asset swaps
discovered peer-to-peer, settled via Amboss Payments API (sandbox first), coordinated by
cryptographically verifiable [Pontmore](https://github.com/pontmore/protocol) PIP-02 chains.
Repo: https://github.com/mk-Denver/PontFx (public, MIT, main branch, CI on push).

Built for **Dakar Bitcoin Hack by BTrust 2026** — submission deadline **Nov 20, 2026 20:00 UTC**,
**code freeze Nov 17**. See `roadmap.md` (phases, dependency map, judging mapping, risks).

## Non-negotiable design facts (do not broke without owner approval)

- **Verifiable legs only.** No fiat/mobile-money rails, no simulated M-Pesa callbacks, no
  self-reported fiat confirmations. Off-ramp rails are participants' responsibility, outside
  the protocol. Papertrail: user decision Oct 28, 2026.
- **Spec pins**: PIP-00 agent def = kind **30360**, `d=agent`, tag/content capabilities must
  match (`pontfx/swap@1`); PIP-01 descriptor = kind **30361**, `lightning_hold_invoice` on
  `lightning`; PIP-02 root = kind **7300**, action = kind **7301**, content `version: 2`;
  quote event = app-layer kind **30364**, `d=fx-quote`, with `expires_at`.
  Profile `pontmore/swap@1` was NOT used because it requires an ISO-4217 fiat leg; we ship
  experimental **`pontfx/swap@1`** (see `docs/profiles/pontfx-swap@1.md`) honoring the same
  kernel invariants (followers MUST NOT leak: one root, linear chain, no action post-terminal,
  `settled` ⊥ `refunded`, fork ⇒ freeze).
- **Trust boundaries**: signature proves authorship, never availability/price/solvency.
  Quote bytes committed in root via `commitments.quote` (`sha256-bytes@1`).
  `payment_reference` opaque only; no preimages/PII/wallet secrets in public content.
- **Keys**: browser use prefers NIP-07 (`window.nostr`); fallback ephemeral key in
  localStorage for dev; backend edge node uses `NOSTR_SK` (never sent to client; node
  dashboard must expose status, not keys). Amboss `amb_test_*` + `TEAM_PASSWORD` are
  server-env only — never printed or exported to the browser.
- **Issue granularity**: max two functions per issue (all code issues include acceptance
  checklist + explicit "Out of scope"). Stub code throws `not implemented: <fn> (issue #N)` —
  keep the tags in sync when renumbering.

## Stack & layout

- Next.js (App Router) + TypeScript + `nostr-tools` + `@ambosstech/payments`; vitest; tsx scripts.
- `docker-compose.yml` — local strfry relay `ws://localhost:7777` (image `dockurr/strfry`;
  `ghcr.io/hoytech/strfry` fallback note; some networks block ghcr). Config: `docker/strfry.conf`.
- `scripts/` — `generate-keys.ts` (NOSTR_SK), `seed-edge-node.ts` (publishes 30361+30360+30364),
  `check-relay.ts` (read-back verification). `npm run keys|seed|check|typecheck|test|build|dev`.
- `src/lib/nostr/*` primitives (sign/publish/query/relays — implemented),
  `src/lib/pip00|pip01|pip02/*`, `src/lib/quotes/*`, `src/lib/amboss/*`, `src/lib/swap/*`,
  `src/lib/node/*` — stubs throw with issue tags; refer to `docs/issues/`.
- Pages: `/` home, `/swap` (client), `/node` (operator), `/chain/[coordinationId]` (proof).
- Docs: `roadmap.md`, `docs/architecture.md`, `docs/demo-script.md`,
  `docs/issues/01–17` (implementation guides + acceptance + out-of-scope),
  `docs/profiles/pontfx-swap@1.md`.

## Current State (as of Oct 28, 2026, scaffold commit 7369f3b)

- ✔ Scaffold pushed; typecheck + vitest (2 tests) + `next build` green; CI passing.
- ✔ Local strfry relay running; seeded 3 events verified round-trip on the relay.
- ✔ Dev server serving all pages (placeholders in `/swap`, `/node`, `/chain`).
- ⬜ #3 Amboss sandbox bootstrap → #4 discovery → #5/#6 legs → #7–#8 bridges →
  #9/#10/#11 PIP-02 core → #12/#13 engine → #14–#16 UIs → #17 docs/Devpost.
- Judging-criteria gaps that remain open: no `docs/security.md` (threat model), no
  `docs/impact.md` (named personas + reach estimate), no `npm run demo` one-command.

## Update contract (for LLMs — enforce on every change)

After editing anything, update:
1. **Current State** above (move items from ⬜ to ✔ only when verified).
2. **Change Log** — append: `- YYYY-MM-DD <area>: <one line> (<commit/issue ref>)`.
3. Any file references that moved/renamed.
4. If a decision above becomes invalid: say so in the Change Log and add the new decision —
   do NOT delete the old one; mark superseded.
