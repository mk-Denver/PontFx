import { createHash } from "node:crypto";
import type { NostrDraft, NostrEvent } from "@/lib/nostr/types";
import {
  PIP_02_KIND_ACTION,
  PIP_02_KIND_ROOT,
  PIP_02_VERSION,
  PROFILE,
  ROLE_AGENT,
  CORE_ESCROW_ROLE,
  CORE_RESOLVER_ROLE,
  ROLE_CUSTOMER,
} from "./constants";
import type {
  Commitment,
  SwapActionContent,
  SwapActionId,
  SwapRootContent,
  SwapTerms,
} from "@/lib/swap/types";

export interface SwapRootInput {
  terms: SwapTerms;
  quoteCommitment?: Commitment;
  expiresAt: number;
  createdAt?: number;
  participants: {
    customer: string;
    agent: string;
    escrow: string;
    resolver?: string;
  };
  relayHint?: string;
}

export function buildRootDraft(input: SwapRootInput): NostrDraft {
  if (input.participants.customer === input.participants.agent) {
    throw new Error("customer and agent MUST use different pubkeys");
  }
  const content: SwapRootContent = {
    version: PIP_02_VERSION,
    profile: PROFILE,
    terms: input.terms,
    expires_at: input.expiresAt,
  };
  if (input.quoteCommitment) {
    content.commitments = { quote: input.quoteCommitment };
  }

  const tags: string[][] = [];
  const pushRole = (pubkey: string, role: string) => {
    if (!pubkey || tags.some((t) => t[0] === "p" && t[1] === pubkey)) return;
    tags.push(["p", pubkey, input.relayHint ?? "", role]);
  };
  pushRole(input.participants.customer, ROLE_CUSTOMER);
  pushRole(input.participants.agent, ROLE_AGENT);
  pushRole(input.participants.escrow, CORE_ESCROW_ROLE);
  if (input.participants.resolver) {
    pushRole(input.participants.resolver, CORE_RESOLVER_ROLE);
  }

  return {
    kind: PIP_02_KIND_ROOT,
    created_at: input.createdAt ?? Math.floor(Date.now() / 1000),
    tags,
    content: JSON.stringify(content),
  };
}

export interface BuildActionInput {
  rootId: string;
  predecessorId: string;
  action: SwapActionId;
  data?: SwapActionContent["data"];
  createdAt?: number;
}

export function buildActionDraft(input: BuildActionInput): NostrDraft {
  const content: SwapActionContent = {
    version: PIP_02_VERSION,
    action: input.action,
  };
  if (input.data) {
    content.data = input.data;
  }
  return {
    kind: PIP_02_KIND_ACTION,
    created_at: input.createdAt ?? Math.floor(Date.now() / 1000),
    tags: [
      ["e", input.rootId, "", "root"],
      ["e", input.predecessorId, "", "prev"],
    ],
    content: JSON.stringify(content),
  };
}

export function sha256Hex(data: string): string {
  return `sha256:${createHash("sha256").update(data, "utf8").digest("hex")}`;
}

export type SignedNostrEvent = NostrEvent;

export interface CreateRootCall {
  input: SwapRootInput;
  actorSkHint?: string;
}

export async function createSwapRoot(
  _input: SwapRootInput
): Promise<{ event: NostrEvent; terms: SwapTerms; coordination_id: string }> {
  throw new Error("not implemented: createSwapRoot (issue #9)");
}

export interface AppendActionCall {
  coordinationId: string;
  predecessorId: string;
  actor: { role: string };
  action: SwapActionId;
  data?: SwapActionContent["data"];
}

export async function appendAction(
  _input: AppendActionCall
): Promise<{ event: NostrEvent; coordination_id: string }> {
  throw new Error("not implemented: appendAction (issue #10)");
}
