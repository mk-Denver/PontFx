import type {
  PublishedRoot,
  Quote,
  SwapCompletion,
  SwapHandle,
  SwapTerms,
} from "./types";

export interface InitiateSwapInput {
  quote: Quote;
  amount: { kind: "btc_sats"; value: string } | { kind: "stable_base"; value: string };
}

export async function initiateSwap(
  _input: InitiateSwapInput
): Promise<SwapHandle> {
  throw new Error("not implemented: initiateSwap (issue #12)");
}

export interface ExecutePayoutInput {
  coordinationId: string;
  terms: SwapTerms;
}

export async function executePayout(
  _input: ExecutePayoutInput
): Promise<{ transactionId: string }> {
  throw new Error("not implemented: executePayout (issue #13)");
}

export async function finalizeSwap(
  _coordinationId: string
): Promise<SwapCompletion> {
  throw new Error("not implemented: finalizeSwap (issue #13)");
}

export type { PublishedRoot };
