import type { NostrEvent } from "@/lib/nostr/types";

export type SwapDirection = "btc_to_stable" | "stable_to_btc";

export interface StableLeg {
  asset: string;
  amount: string;
  precision: number;
  network: string;
}

export interface BitcoinLeg {
  amount: string;
  unit: "sat";
  network: string;
}

export interface SwapDeadlines {
  btc_leg_settle_by: number;
  stable_leg_settle_by: number;
}

export interface SwapTerms {
  direction: SwapDirection;
  stable: StableLeg;
  bitcoin: BitcoinLeg;
  deadlines: SwapDeadlines;
}

export interface Commitment {
  algorithm: string;
  digest: string;
}

export type CommitmentKey = "quote" | "private_terms";

export interface SwapRootContent {
  version: 2;
  profile: string;
  terms: SwapTerms;
  expires_at: number;
  commitments?: Partial<Record<CommitmentKey, Commitment>>;
}

export type KernelActionId =
  | "core/accept"
  | "core/decline"
  | "core/secure"
  | "core/authorize_settlement"
  | "core/settle"
  | "core/authorize_refund"
  | "core/refund"
  | "core/cancel"
  | "core/expire"
  | "core/open_dispute"
  | "core/resolve_dispute";

export type ProfileActionId =
  | "swap/btc_leg_settled"
  | "swap/stable_leg_settled";

export type SwapActionId = KernelActionId | ProfileActionId;

export interface LegSettledData {
  payment_reference: string;
  payment_hash?: string;
}

export type SwapActionContent = {
  version: 2;
  action: SwapActionId;
  data?: LegSettledData & Record<string, unknown>;
};

export interface Quote {
  quote_id: string;
  agent_pubkey: string;
  direction: SwapDirection;
  from_asset: string;
  to_asset: string;
  rate: string;
  min_amount: string;
  max_amount: string;
  expires_at: number;
  event: NostrEvent;
}

export interface PublishedRoot {
  coordination_id: string;
  event: NostrEvent;
  terms: SwapTerms;
  quote: Quote | null;
  expires_at: number;
}

export interface SwapHandle {
  coordination_id: string;
  invoice: string | null;
  quote: Quote;
}

export interface SwapCompletion {
  coordination_id: string;
  final_state: string;
  settle_amount?: string;
}
