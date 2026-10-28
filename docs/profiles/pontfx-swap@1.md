# `pontfx/swap@1` — Stable-Asset / Bitcoin Swap Profile (draft)

Status: **Experimental draft**. Conforms to the PIP-02 kernel (version 2, kinds
7300/7301). Profile identifier: `pontfx/swap@1`.

Companion to [`pontmore/swap@1`](https://github.com/pontmore/protocol/blob/main/profiles/swap-v1.md),
which requires an ISO-4217 fiat leg. This profile serves swaps where **both legs
are verifiable settlement channels** (Lightning BOLT11 payments, Taproot Asset
transfers): the value unit is a stable asset, not fiat cash.

## Terms

Root `content.terms` MUST contain:

- `direction`: `btc_to_stable` (customer sends BTC, agent provides stable asset)
  or `stable_to_btc` (customer sends stable asset, agent provides BTC)
- `stable`: `{ asset: string, amount: string, precision: number, network: string }`
  (e.g. `usdt`, precision `6`, network `lightning` via Taproot Assets)
- `bitcoin`: `{ amount: string, unit: "sat", network: string }`
- `deadlines`: `{ btc_leg_settle_by, stable_leg_settle_by }` (Unix timestamps;
  `root.content.expires_at` MUST be earlier than `btc_leg_settle_by`)
- Amounts are exact decimal strings, base units, no exponents.

When a quote supplies the terms, the root MUST bind it via
`commitments.quote = { algorithm: "sha256-bytes@1", digest: "sha256:<64 hex>" }`,
committing to the exact signed quote-event bytes.

## Roles

Exactly one pubkey per role, `swap/customer` ≠ `swap/agent`:

| Role | Meaning |
| --- | --- |
| `swap/customer` | Initiating payer |
| `swap/agent` | Edge FX node |
| `core/escrow` | Authority permitted to publish `core/secure`, `core/settle`, `core/refund` |
| `core/resolver` | Authority permitted to publish `core/resolve_dispute` (required: disputes are enabled) |

The root signer is the proposer (`swap/customer`). Acceptance = valid
`core/accept` by `swap/agent` before `expires_at` (or `core/decline`).

## Direction-derived economics

| Direction | BTC sender | BTC receiver | Stable sender | Stable receiver |
| --- | --- | --- | --- | --- |
| `btc_to_stable` | customer | agent | agent | customer |
| `stable_to_btc` | agent | customer | customer | agent |

## Profile actions

| Action | Authorized signer | Preconditions | Required data |
| --- | --- | --- | --- |
| `swap/btc_leg_settled` | BTC receiver | accepted, secured, not disputed, before `btc_leg_settle_by` | `payment_reference` (opaque Amboss tx id), optional `payment_hash` |
| `swap/stable_leg_settled` | stable receiver | valid `swap/btc_leg_settled`, not disputed, before `stable_leg_settle_by` | `payment_reference` |

`payment_reference` MUST be a safe opaque identifier (Amboss transaction id) or
a versioned commitment (sha256-bytes@1). Raw invoices, wallet ids, phone
numbers, receipts, credentials, preimages MUST NOT be published.

A leg action is valid only once; repeats are replay/fork.

## Kernel authorization table (profile refinement)

| Kernel action | Authorized signer | Profile condition |
| --- | --- | --- |
| `core/accept` | `swap/agent` | before root `expires_at` |
| `core/decline` | `swap/agent` | before acceptance |
| `core/cancel` | proposer | before acceptance |
| `core/cancel` | either participant | after acceptance, before `core/secure` |
| `core/expire` | either participant | root not accepted before `expires_at` |
| `core/secure` | `core/escrow` | accepted (BTC leg invoice/hold in place) |
| `core/authorize_settlement` | BTC receiver (per direction) | valid `swap/stable_leg_settled` by same signer rule |
| `core/settle` | `core/escrow` | settlement authorized |
| `core/authorize_refund` | BTC receiver if leg missing | `btc_leg_settle_by` elapsed without valid `swap/btc_leg_settled` |
| `core/refund` | `core/escrow` | refund authorized |
| `core/open_dispute` | either participant | accepted, non-terminal |
| `core/resolve_dispute` | `core/resolver` | effect in {`resume`,`authorize_settlement`,`authorize_refund`,`cancel`} |

No defaults on silence: absence of a leg action never auto-selects a winner.
 Timeout paths are explicit (`expire`/`authorize_refund`) or disputed.

## Normal reconstruction

```
root -> core/accept -> core/secure
     -> swap/btc_leg_settled -> swap/stable_leg_settled
     -> core/authorize_settlement -> core/settle        (terminal: settled)
```

Failure reconstruction:

```
root -> core/accept -> core/secure -> [btc_leg_settle_by elapsed] 
     -> core/authorize_refund -> core/refund         (terminal: refunded)
```

## Dispute classes

`btc_leg_not_received`, `stable_leg_not_received`, `incorrect_amount`,
`payment_reference_invalid`, `conflicting_confirmation`, `timeout`.
Routing claims only — evidence evaluation belongs to the accepted escrow
service / application policy, never to the chain.

## Conformance statement

Experimental. Vectors pending (must cover: both directions, expiry, refunds,
disputes, fork freeze, unauthorized signers, mismatched references). Do NOT
handle this profile as final; implementations MUST pin exact versions.
