import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PontFX",
  description:
    "Nostr-native FX coordination over Lightning: BTC <-> stable-asset swaps with auditable PIP-02 chains.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <a href="/" style={{ fontWeight: 700, fontSize: 18 }}>
            Pont<span style={{ color: "var(--accent)" }}>FX</span>
          </a>
          <nav style={{ display: "flex", gap: 16 }}>
            <a href="/swap">Swap</a>
            <a href="/node">Edge Node</a>
            <a href="/chain">Chain Viewer</a>
          </nav>
        </header>
        <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
