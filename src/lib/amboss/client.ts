import { Payments } from "@ambosstech/payments";

export function makeAmbossClient(): Payments {
  const apiKey = process.env.AMBOSS_API_KEY;
  if (!apiKey) {
    throw new Error("AMBOSS_API_KEY is not set");
  }
  return new Payments({
    serviceApiKey: apiKey,
    webhookSecret: process.env.AMBOSS_WEBHOOK_SECRET,
  });
}

export interface ReceiveLegInput {
  walletId: string;
  amount: string;
  description?: string;
  coordinationId?: string;
  sandboxBehavior?: "complete" | "fail" | "expire";
}

export interface TrackedLeg {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "expired";
  settleAmount?: string;
  assetSymbol?: string;
  paymentHash?: string;
}

export async function receive(_input: ReceiveLegInput): Promise<{ invoice: string; transactionId: string }> {
  throw new Error("not implemented: receive (issue #5)");
}

export async function track(_transactionId: string): Promise<TrackedLeg> {
  throw new Error("not implemented: track (issue #5)");
}

export interface SendLegInput {
  walletId: string;
  destination: { bolt11: string } | { lightning_address: string };
  metadata?: Record<string, string>;
  sandboxBehavior?: "complete" | "fail" | "expire";
}

export async function send(_input: SendLegInput): Promise<{ transactionId: string }> {
  throw new Error("not implemented: send (issue #6)");
}
