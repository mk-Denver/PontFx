## Why

Everything else builds on a local relay and a seeded edge node. The scaffold already contains
this stack; this issue tracks the acceptance evidence and any fixes needed to reproduce it on a
fresh machine.

## Read first

- `docker-compose.yml`, `docker/strfry.conf` (strfry HOCON config)
- `scripts/seed-edge-node.ts`, `scripts/check-relay.ts`, `scripts/generate-keys.ts`
- `README.md` (Quickstart)

## Implementation guide

1. Fresh clone: `cp .env.example .env`.
2. `npm install` (approve esbuild install scripts if npm asks).
3. `npm run keys` → paste `NOSTR_SK` into `.env`.
4. `docker compose up -d` → strfry on `ws://localhost:7777` (config loads from `/etc/strfry.conf`).
5. `npm run seed` → publishes kind 30361 (descriptor), 30360 (agent def), 30364 (quote).
6. `npm run check` → read-back asserts kinds `[30360, 30361, 30364]`.
7. `npm run dev` → `/`, `/swap`, `/node`, `/chain` render.

Network note: if `ghcr.io` is blocked (this machine), compose already falls back to
`docker.io/dockurr/strfry`.

## Acceptance criteria

- [x] `docker compose ps` shows `pontfx-relay` healthy on 7777
- [x] `npm run seed` prints three "published: ws://localhost:7777" lines
- [x] `npm run check` lists kinds 30360, 30361, 30364
- [x] `npm run typecheck && npm test && npm run build` all green
- [x] CI workflow runs the same on a fresh PR

## Out of scope

- Public/WSS relay deployment, TLS, auth
- Any swap logic, Amboss keys
- UI beyond placeholder pages

## Functions touched

None (infrastructure/scripts only).
