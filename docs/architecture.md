# PontFX Architecture

## Roles

```
+-----------------------------+        +-----------------------------+
|          Edge node          |        |        Swap client          |
|  (liquidity provider agent) |        |    (merchant / remitter)    |
+--------------+--------------+        +--------------+--------------+
               |  PIP-00 agent def (kind 30360, d=agent)
               |  PIP-01 escrow descriptor (kind 30361)
               |         FX quote (kind 30364, d=fx-quote, expires_at)
               v
    [ Nostr relays (strfry locally) ]
               ^                                     ^
               |  PIP-02 root (kind 7300)            |
               |  PIP-02 actions (kind 7301) linked e-tags (root/prev)
               |                                     |
               +------------------>------------------+
```

## Data plane vs coordination plane

- **Execution (private overlay):** Amboss Payments API in sandbox. The agent
  receives one leg and sends the other. `idempotency_key` and `metadata` carry
  the `coordination_id` so private txs bind to the public chain. Settlement
  facts return via webhooks (`payment.completed|failed|expired`, HMAC-verified)
  or, in poll mode (default for demos; no public URL needed), via
  `transactions` polling.
- **Coordination (public protocol state):** signed Nostr events only. Every
  observable state change is a kind-7301 action referencing
  `["e", root, "", "root"]` and `["e", prev, "", "prev"]`. Anyone with relay
  access reconstructs the truth; operator databases and servers are
  non-canonical by definition (Pontmore Design Boundary).

## Swap lifecycle (pontfx/swap@1)

```
root:7300 (terms: direction, stable leg, btc leg, deadlines, expires_at;
           commitments.quote = sha256-bytes@1 of accepted quote bytes)
  -> core/accept            (non-proposing participant, before expires_at)
  -> core/secure            (core/escrow authority)
  -> swap/btc_leg_settled   (BTC receiver; payment_reference [+ payment_hash])
  -> swap/stable_leg_settled (stable receiver; payment_reference)
  -> core/authorize_settlement
  -> core/settle            (terminal)
```

Timeout / failure branches follow kernel invariants:
`core/expire`, `core/cancel`, `core/refund` paths with
`core/authorize_refund`, dispute freeze via `core/open_dispute` /
`core/resolve_dispute` (resolver bound in root).

## Non-goals

- No fiat rails (M-Pesa etc.), no self-reported fiat events, no fake callbacks.
- No order-book matching engine, no custody, no reputation system.
- No PII in public events (payment references are opaque or committed).

## Trust model highlights

- Signing proves authorship, not availability/price/solvency (PIP-00 Trust
  Boundary). Quotes carry `expires_at`; roots commit to the accepted quote
  bytes (`commitments.quote`, `sha256-bytes@1`).
- `swap/customer` and `swap/agent` MUST be different pubkeys; `core/escrow`
  and `core/resolver` authorities are bound in the root (PIP-02).
- Forks (two valid actions on the same predecessor) freeze economic progress.
