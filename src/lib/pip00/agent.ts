import type { NostrDraft, NostrEvent } from "@/lib/nostr/types";
import { signEvent } from "@/lib/nostr/sign";
import { publishEvent, type PublishResult } from "@/lib/nostr/publish";
import { PIP_00_D_TAG_DEFAULT, PIP_00_KIND_AGENT } from "./constants";

export interface AgentCapabilityRef {
  id: string;
  version: number;
}

export interface AgentDefinitionInput {
  capabilities: AgentCapabilityRef[];
  escrowDescriptor?: {
    publisherPubkey: string;
    dTag: string;
    relayHint?: string;
  };
  createdAt?: number;
}

const CAPABILITY_ID_RE = /^[a-z0-9_-]+\/[a-z0-9_-]+@\d+$/;

export function buildAgentDefinition(
  input: AgentDefinitionInput
): NostrDraft {
  const tags: string[][] = [
    ["d", PIP_00_D_TAG_DEFAULT],
    ["t", "agent"],
  ];
  for (const cap of input.capabilities) {
    const id = `${cap.id}@${cap.version}`;
    if (!CAPABILITY_ID_RE.test(id)) {
      throw new Error(`invalid capability identifier: ${id}`);
    }
    tags.push(["t", `pontmore-capability:${id}`]);
  }
  if (input.escrowDescriptor) {
    const ed = input.escrowDescriptor;
    tags.push([
      "a",
      `30361:${ed.publisherPubkey}:${ed.dTag}`,
      ed.relayHint ?? "",
      "escrow",
    ]);
  }
  const content = {
    version: 1,
    capabilities: input.capabilities.map((c) => `${c.id}@${c.version}`),
  };
  return {
    kind: PIP_00_KIND_AGENT,
    created_at: input.createdAt ?? Math.floor(Date.now() / 1000),
    tags,
    content: JSON.stringify(content),
  };
}

export interface PublishedAgentDefinition {
  event: NostrEvent;
  relays: string[];
}

export async function publishAgentDefinition(
  input: AgentDefinitionInput
): Promise<PublishedAgentDefinition> {
  const draft = buildAgentDefinition(input);
  const event = await signEvent(draft);
  const result: PublishResult = await publishEvent(event);
  return { event, relays: result.published };
}
