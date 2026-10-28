# PontFX

**Nostr-native FX coordination network over Lightning.** BTC ↔ stable-asset swaps
discovered peer-to-peer, settled over Lightning/Taproot Assets, and coordinated by
cryptographically verifiable [Pontmore](https://github.com/pontmore/protocol) PIP-02
event chains — no central coordinator, no custody of what isn't yours.

> Project being built for the [Dakar Bitcoin Hack by BTrust 2026](https://dakar-bitcoin-hack-2026.devpost.com)
> (submission deadline Nov 20, 2026). See [roadmap.md](./roadmap.md).

## Why

Dollar-stable value moved in Africa mostly flees to centralized chains (custody risk,
freeze lists, opaque fees). PontFX keeps every layer verifiable:

- **Discovery (PIP-00, kind 30360)** — FX edge nodes publish signed agent
  definitions with versioned capabilities on Nostr relays.
- **Quotes (app event, kind 30364)** — signed, expiring bid/ask from edge-node
  inventory rules.
- **Escrow compatibility (PIP-01, kind 30361)** — `lightning_hold_invoice` on
  `lightning`, bound exactly into each coordination root.
- **Coordination (PIP-02 kernel, kinds 7300/7301)** — immutable root + append-only
  linked actions. Both swap legs settle through verifiable channels
  (Lightning `payment_hash`, settle amounts); third parties reconstruct state from
  relays alone.
- **Execution (Amboss Payments API, sandbox)** — private execution overlay:
  `createReceive`/`send` with `idempotency_key` bound to the coordination id;
  webhook/poll events translated into signed PIP-02 actions.

Out of scope, by design: fiat/mobile-money rails. PontFX coordinates and settles
**verifiable legs only**; off-ramp to M-Pesa/Wave/Orange Money is the participants'
responsibility, outside the protocol.

## The profile

Pontmore's `pontmore/swap@1` covers fiat↔Bitcoin swaps (ISO-4217 fiat legs).
PontFX pins its own experimental, PIP-02-kernel-conforming profile
**`pontfx/swap@1`** for BTC↔stable-asset swaps where both legs are verifiable —
spec: [docs/profiles/pontfx-swap@1.md](./docs/profiles/pontfx-swap@1.md).
This is the "second materially different profile" evidence PIP-02 asks for.

## Quickstart

```bash
cp .env.example .env
npm install
npm run keys        # prints NOSTR_SK — paste into .env
docker compose up -d relay   # local strfry relay on ws://localhost:7777
npm run seed        # publishes a sample edge node: descriptor + agent def + quote
npm run dev         # http://localhost:3000
```

Set the Amboss sandbox values (`amb_test_…` keys, wallet ids) in `.env` when
wiring the swap engine. `FX_BRIDGE_MODE=poll` requires no public webhook URL.

## Status

Experimental. No real funds. All Pontmore conformance (PIPs and `pontfx/swap@1`)
is draft/experimental by definition. The protocol proves authorship, never
trustworthiness — read the PIPs.
