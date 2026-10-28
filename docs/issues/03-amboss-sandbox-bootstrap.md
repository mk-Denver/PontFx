## Why

Wiring needs concrete sandbox ids (environment, BTC wallet, USDT wallet) that today must be
copied by hand from the dashboard. A script that discovers and prints them turns onboarding
into one command and validates the `amb_test_...` key end-to-end.

## Read first

- https://docs.amboss.tech/sdk/getting-started (environments.list, wallets.list)
- `.env.example` (which vars it fills)

## Implementation guide

1. `scripts/bootstrap-sandbox.ts` — `bootstrapSandbox()`:
   - `payments.environments.list()` → pick env with `type: SANDBOX` (error if none).
   - `payments.wallets.list({ environmentId })` → find BTC (symbol `BTC`) and USDT
     (symbol `USDT`) wallets; assert `is_ready`.
   - print the four `.env` lines: `AMBOSS_ENVIRONMENT_ID`, `AMBOSS_WALLET_BTC_ID`,
     `AMBOSS_WALLET_USDT_ID`, and a reminder for `AMBOSS_API_KEY` / `AMBOSS_WEBHOOK_SECRET`.
   - exit non-zero with a human message when the key is missing or wrong.
2. Add `"bootstrap": "tsx scripts/bootstrap-sandbox.ts"` to package.json.
3. Update README Quickstart with the bootstrap step.

## Acceptance criteria

- [x] With a valid sandbox key: script prints all four ids matching the dashboard
- [x] Without `AMBOSS_API_KEY`: exit code ≠ 0, message points to app.amboss.tech/pay
- [x] Works with only the sandbox key (no dashboard JWT required)
- [x] Idempotent — safe to re-run

## Out of scope

- Creating environments/wallets programmatically (dashboard is the source of truth)
- LIVE environment support, KYB, going-live flow
- Autowriting `.env` (print-only; avoids silently overwriting operator config)

## Functions touched

`bootstrapSandbox()` — one.
