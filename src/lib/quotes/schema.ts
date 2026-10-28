import type { NostrDraft, NostrEvent } from "@/lib/nostr/types";
import type { SwapDirection } from "@/lib/swap/types";
import { BTC, QUOTE_CONTENT_VERSION, QUOTE_D_TAG, QUOTE_KIND, USDT } from "./constants";

export interface QuoteContent {
  version: number;
  quote_id: string;
  direction: SwapDirection;
  rate: string;
  min_amount: string;
  max_amount: string;
  expires_at: number;
  base: string;
  quote_asset: string;
}

export interface QuoteInput {
  quoteId: string;
  direction: SwapDirection;
  rate: string;
  minAmount: string;
  maxAmount: string;
  expiresAt: number;
  createdAt?: number;
}

export function buildQuoteDraft(input: QuoteInput): NostrDraft {
  const content: QuoteContent = {
    version: QUOTE_CONTENT_VERSION,
    quote_id: input.quoteId,
    direction: input.direction,
    rate: input.rate,
    min_amount: input.minAmount,
    max_amount: input.maxAmount,
    expires_at: input.expiresAt,
    base: BTC,
    quote_asset: USDT,
  };
  return {
    kind: QUOTE_KIND,
    created_at: input.createdAt ?? Math.floor(Date.now() / 1000),
    tags: [["d", QUOTE_D_TAG]],
    content: JSON.stringify(content),
  };
}

export function parseQuoteEvent(event: NostrEvent): QuoteContent | null {
  if (event.kind !== QUOTE_KIND) return null;
  try {
    const content = JSON.parse(event.content) as QuoteContent;
    if (content.version !== QUOTE_CONTENT_VERSION) return null;
    if (!content.quote_id || !content.rate) return null;
    return content;
  } catch {
    return null;
  }
}

export function isQuoteExpired(content: QuoteContent, now = Date.now() / 1000): boolean {
  return content.expires_at <= now;
}
