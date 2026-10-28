export default function ChainIndexPage() {
  return (
    <div>
      <h1>Chain Viewer</h1>
      <p className="muted">
        Paste a coordination id in the URL: <code>/chain/&lt;id&gt;</code>. Any
        root event id works — nothing here is server-side state.
      </p>
    </div>
  );
}
