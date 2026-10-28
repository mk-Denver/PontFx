export default function Home() {
  const cards = [
    {
      href: "/swap",
      title: "Swap",
      body: "Discover live FX edge nodes over Nostr (PIP-00), take a quote, watch your BTC<->USDT swap settle through an auditable coordination chain.",
    },
    {
      href: "/node",
      title: "Edge Node",
      body: "Run a liquidity provider agent: publish your PIP-00 capability, set spreads and inventory, earn the spread.",
    },
    {
      href: "/chain",
      title: "Chain Viewer",
      body: "Reconstruct any PontFX coordination deterministically from Nostr relays alone. No backend state, no central coordinator.",
    },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        Non-custodial FX over Lightning
      </h1>
      <p className="muted" style={{ marginBottom: 32 }}>
        Stablecoin payments back on Bitcoin rails. Discovery on Nostr,
        settlement on Lightning, coordination cryptographically verifiable.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <a key={c.href} href={c.href} className="card">
            <h3 style={{ marginTop: 0 }}>{c.title}</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              {c.body}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
