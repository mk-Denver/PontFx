# PontFX demo script (3 min target)

Goal: judges see an end-to-end BTC↔USDT swap over Lightning, with every state
change verifiable on a Nostr event chain — zero centralized coordination in the
proof story.

## 0:00–0:35 — Problem

African merchants want dollar-stable working capital but Bitcoin's volatility
pushes them to custodial Tron stablecoins (freeze risk, opaque fees, custody).
Show the two worldviews: custody vs verifiable rails.

## 0:35–1:15 — Discovery (PIP-00 + quotes)

- Open `/swap`: relay scan shows edge nodes (kind 30360 agent defs paired with
  kind 30364 signed quotes) — bid/ask, max amount, expiry, pubkey-verified.
- Point out: a signed quote proves authorship; the coordination root will
  commit to the accepted quote bytes (`commitments.quote`).

## 1:15–2:10 — Execution (PIP-02 root → legs → settle)

- Enter e.g. 5,000 sats → best quote → Accept.
- Root (kind 7300) appears: terms, participants, escrow/resolver binding,
  quote commitment. `core/accept`, `core/secure` appended (kind 7301).
- Amboss sandbox settles the BTC leg invoice (sandbox `complete` behavior);
  bridge translates it into `swap/btc_leg_settled` with opaque
  `payment_reference`; stable leg follows; authorities release with
  `core/authorize_settlement` + `core/settle`.

## 2:10–2:45 — Proof (chain viewer)

- Open `/chain/<coordination_id>` from a *different browser/incognito*.
- Show reconstruction purely from relays: root + linked actions, prev-links,
  roles, terminal state `settled`. No app database consulted.

## 2:45–3:00 — Boundary & next steps

State clearly: PontFX coordinates and settles verifiable legs only; the fiat
last mile (M-Pesa, Wave) is participants' responsibility outside the protocol.
Next: real tapd edge nodes, AMM inventory pricing, dispute/resolver flows.
