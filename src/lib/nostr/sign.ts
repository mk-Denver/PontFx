import { finalizeEvent, generateSecretKey } from "nostr-tools/pure";
import type { NostrDraft, NostrEvent } from "./types";

function getEmbeddedKey(): Uint8Array {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    return getBrowserKey();
  }
  const hex = process.env.NOSTR_SK;
  if (!hex) {
    throw new Error(
      "NOSTR_SK is not set. Generate one with: npm run keys"
    );
  }
  return hexToBytes(hex);
}

function getBrowserKey(): Uint8Array {
  const storageKey = "pontfx.sk";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    return hexToBytes(existing);
  }
  const generated = generateSecretKey();
  window.localStorage.setItem(storageKey, bytesToHex(generated));
  return generated;
}

export async function signEvent(draft: NostrDraft): Promise<NostrEvent> {
  if (typeof window !== "undefined" && window.nostr) {
    return window.nostr.signEvent(draft);
  }
  return finalizeEvent(draft, getEmbeddedKey()) as unknown as NostrEvent;
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error("invalid hex string");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
