export function getRelays(): string[] {
  const raw = process.env.NEXT_PUBLIC_RELAYS ?? "ws://localhost:7777";
  const urls = raw
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u.startsWith("ws://") || u.startsWith("wss://"));
  return urls.length > 0 ? urls : ["ws://localhost:7777"];
}
