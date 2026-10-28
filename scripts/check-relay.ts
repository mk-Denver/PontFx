import { SimplePool } from "nostr-tools";

async function main() {
  const relay =
    process.argv[2] ?? process.env.NEXT_PUBLIC_RELAYS ?? "ws://localhost:7777";
  const pool = new SimplePool();
  const events = await pool.querySync([relay], {
    kinds: [30360, 30361, 30364],
    limit: 50,
  });
  console.log(`relay ${relay}`);
  console.log(
    `kinds found: ${events
      .map((e) => e.kind)
      .sort((a, b) => a - b)
      .join(", ")} (${events.length} events)`
  );
  pool.close([relay]);
}

main();
