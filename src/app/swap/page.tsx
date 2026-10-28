"use client";

import { useEffect, useState } from "react";

export default function SwapPage() {
  const [pubkey, setPubkey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.nostr) {
      window.nostr.getPublicKey().then(setPubkey).catch(() => null);
    }
  }, []);

  return (
    <div>
      <h1>Swap</h1>
      <p className="muted">
        Placeholder. Live PIP-00 quote discovery, quote acceptance and swap
        execution are tracked in repository issues (see roadmap.md).
      </p>
      <div className="card" style={{ marginTop: 16 }}>
        <p style={{ marginTop: 0 }}>
          <span className="badge">
            {pubkey ? `Wallet connected: ${pubkey.slice(0, 12)}…` : "No NIP-07 wallet detected (a local dev key will be used)"}
          </span>
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          Planned flow: enter BTC amount or USDT amount → best quote → accept
          → root published (kind 7300) → legs settle → chain reaches
          <code> settled</code>.
        </p>
      </div>
    </div>
  );
}
