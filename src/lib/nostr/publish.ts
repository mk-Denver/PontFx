import { Relay } from "nostr-tools/relay";
import { getRelays } from "./relays";
import type { NostrEvent } from "./types";

export interface PublishResult {
  published: string[];
  failed: string[];
}

export async function publishEvent(event: NostrEvent): Promise<PublishResult> {
  const relays = getRelays();
  const published: string[] = [];
  const failed: string[] = [];

  await Promise.allSettled(
    relays.map(async (url) => {
      const relay = await Relay.connect(url);
      try {
        await relay.publish(event);
        published.push(url);
      } catch {
        failed.push(url);
      } finally {
        relay.close();
      }
    })
  );

  if (published.length === 0) {
    throw new Error(`failed to publish: ${failed.join(", ") || "no relays"}`);
  }
  return { published, failed };
}
