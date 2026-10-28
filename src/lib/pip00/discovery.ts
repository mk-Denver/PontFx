import type { NostrEvent } from "@/lib/nostr/types";
import type { Quote } from "@/lib/swap/types";

export interface AgentDefinitionRecord {
  pubkey: string;
  capabilities: string[];
  event: NostrEvent;
}

export interface QuoteCandidate {
  agentPubkey: string;
  quote: Quote;
}

export async function queryAgents(): Promise<AgentDefinitionRecord[]> {
  throw new Error("not implemented: queryAgents (issue #4)");
}

export async function extractQuote(
  _agentPubkey: string
): Promise<Quote | null> {
  throw new Error("not implemented: extractQuote (issue #4)");
}
