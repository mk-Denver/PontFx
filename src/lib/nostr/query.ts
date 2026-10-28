import { SimplePool, type Filter } from "nostr-tools";
import { getRelays } from "./relays";
import type { NostrEvent } from "./types";

const pool = new SimplePool();

export async function queryEvents(
  filters: Filter[],
  timeoutMs = 5000
): Promise<NostrEvent[]> {
  const relays = getRelays();
  const nested = await Promise.all(
    filters.map((filter) => pool.querySync(relays, filter))
  );
  const events = nested.flat();
  const seen = new Set<string>();
  const unique: NostrEvent[] = [];
  for (const event of events) {
    if (!seen.has(event.id)) {
      seen.add(event.id);
      unique.push(event);
    }
  }
  return unique;
}
