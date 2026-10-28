import type { NostrEvent } from "@/lib/nostr/types";
import { PIP_02_KIND_ROOT, PIP_02_VERSION } from "./constants";
import type { SwapActionContent, SwapTerms } from "@/lib/swap/types";

export class ChainValidationError extends Error {}

export interface ChainState {
  state: string;
  disputed: boolean;
}

export interface ChainValidationResult {
  valid: boolean;
  state: ChainState | null;
  reason?: string;
}

export type ParsedAction = {
  event: NostrEvent;
  parsed: SwapActionContent;
};

export function parseActionContent(event: NostrEvent): SwapActionContent {
  const content = JSON.parse(event.content) as SwapActionContent;
  if (content.version !== PIP_02_VERSION) {
    throw new ChainValidationError(
      `unsupported PIP-02 content version: ${content.version}`
    );
  }
  if (typeof content.action !== "string") {
    throw new ChainValidationError("action identifier missing");
  }
  return content;
}

export function parseRootTerms(
  evt: NostrEvent
): { rootId: string; terms: SwapTerms; expiresAt: number; rootPubkey: string } {
  if (evt.kind !== PIP_02_KIND_ROOT) {
    throw new ChainValidationError(`kind ${evt.kind} is not a root`);
  }
  const content = JSON.parse(evt.content) as {
    version: number;
    terms: SwapTerms;
    expires_at: number;
  };
  if (content.version !== PIP_02_VERSION) {
    throw new ChainValidationError(
      `unsupported PIP-02 content version: ${content.version}`
    );
  }
  return {
    rootId: evt.id,
    rootPubkey: evt.pubkey,
    terms: content.terms,
    expiresAt: content.expires_at,
  };
}

export async function reconstructSwapChain(
  _coordinationId: string
): Promise<{ root: NostrEvent; actions: ParsedAction[] }> {
  throw new Error("not implemented: reconstructSwapChain (issue #11)");
}

export function validateKernelInvariants(
  _root: NostrEvent,
  _actions: ParsedAction[]
): ChainValidationResult {
  throw new Error(
    "not implemented: validateKernelInvariants (issue #11)"
  );
}
