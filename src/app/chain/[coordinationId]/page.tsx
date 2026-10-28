export default async function ChainPage({
  params,
}: {
  params: Promise<{ coordinationId: string }>;
}) {
  const { coordinationId } = await params;
  return (
    <div>
      <h1>Chain Viewer</h1>
      <p className="muted">
        Placeholder. Parses coordination id:{" "}
        <code>{coordinationId}</code>
      </p>
      <div className="card" style={{ marginTop: 16 }}>
        <p className="muted" style={{ margin: 0 }}>
          Reconstructs root (kind 7300) and linked actions (kind 7301) from
          relays, validates prev-links and kernel invariants, and renders the
          timeline. Tracked in repository issues.
        </p>
      </div>
    </div>
  );
}
