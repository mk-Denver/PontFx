export const PIP_02_VERSION = 2;
export const PIP_02_KIND_ROOT = 7300;
export const PIP_02_KIND_ACTION = 7301;

export const PIP_00_KIND_AGENT = 30360;
export const PIP_01_KIND_DESCRIPTOR = 30361;

export const PONTFX_PROFILE = "pontfx/swap@1";
export const PIP_01_DESCRIPTOR_EXCROW_TYPE = "lightning_hold_invoice";
export const PIP_01_DESCRIPTOR_NETWORK = "lightning";
export const COMMITMENT_ALGORITHM = "sha256-bytes@1";

export interface NostrDraft {
  kind: number;
  created_at: number;
  tags: string[][];
  content: string;
  pubkey?: string;
}

export interface NostrEvent extends NostrDraft {
  pubkey: string;
  id: string;
  sig: string;
}

declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(draft: NostrDraft): Promise<NostrEvent>;
    };
  }
}
