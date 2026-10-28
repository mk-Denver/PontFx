import { describe, expect, it } from "vitest";
import {
  buildQuoteDraft,
  isQuoteExpired,
  parseQuoteEvent,
} from "./schema";

describe("quote event schema", () => {
  it("builds and parses a round-trippable quote", () => {
    const draft = buildQuoteDraft({
      quoteId: "q-1",
      direction: "btc_to_stable",
      rate: "105000",
      minAmount: "1000",
      maxAmount: "100000000",
      expiresAt: Math.floor(Date.now() / 1000) + 120,
    });
    expect(draft.kind).toBe(30364);
    expect(draft.tags).toContainEqual(["d", "fx-quote"]);

    const fakeEvent = {
      kind: draft.kind,
      content: draft.content,
      id: "x",
      sig: "y",
      pubkey: "z",
      created_at: draft.created_at,
      tags: draft.tags,
    };
    const parsed = parseQuoteEvent(fakeEvent);
    expect(parsed?.quote_id).toBe("q-1");
    expect(parsed?.base).toBe("btc");
    expect(parsed?.quote_asset).toBe("usdt");
  });

  it("rejects expired quotes", () => {
    const past = Math.floor(Date.now() / 1000) - 10;
    expect(isQuoteExpired({ expires_at: past } as never)).toBe(true);
  });
});
