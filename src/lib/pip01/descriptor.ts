import type { NostrDraft } from "@/lib/nostr/types";
import {
  PIP_01_EXCROW_TYPE_LIGHTNING_HOLD,
  PIP_01_KIND_DESCRIPTOR,
  PIP_01_NETWORK_LIGHTNING,
} from "./constants";

export interface EscrowDescriptorInput {
  dTag?: string;
  expiresAt: number;
  createdAt?: number;
}

export function buildEscrowDescriptor(
  input: EscrowDescriptorInput
): NostrDraft {
  const content = {
    version: 1,
    escrow_type: PIP_01_EXCROW_TYPE_LIGHTNING_HOLD,
    networks: [PIP_01_NETWORK_LIGHTNING],
    expires_at: input.expiresAt,
  };
  return {
    kind: PIP_01_KIND_DESCRIPTOR,
    created_at: input.createdAt ?? Math.floor(Date.now() / 1000),
    tags: [
      ["d", input.dTag ?? PIP_01_EXCROW_TYPE_LIGHTNING_HOLD],
      ["t", `pontmore-network:${PIP_01_NETWORK_LIGHTNING}`],
    ],
    content: JSON.stringify(content),
  };
}
