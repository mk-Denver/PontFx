export default function NodePage() {
  return (
    <div>
      <h1>Edge Node</h1>
      <p className="muted">
        Placeholder. Publishes your PIP-00 agent definition (kind 30360),
        PIP-01 escrow descriptor (kind 30361) and live FX quotes (kind 30364)
        to the configured relays. Inventory and spread controls are tracked in
        repository issues.
      </p>
      <div className="card" style={{ marginTop: 16 }}>
        <p className="muted" style={{ margin: 0 }}>
          Requires <code>NOSTR_SK</code> (edge node key). Seeded sample data:
          <code>npm run seed</code>.
        </p>
      </div>
    </div>
  );
}
