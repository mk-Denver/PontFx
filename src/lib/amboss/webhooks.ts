import type { NextRequest } from "next/server";

export interface AmbossWebhookEnvelope {
  id: string;
  event_type: "payment.completed" | "payment.failed" | "payment.expired";
  environment: string;
  wallet_id: string;
  data: {
    id: string;
    direction: "receive" | "send";
    status: string;
    payment_details?: { payment_type: string; payment_hash?: string };
    amount?: { amount: string; asset_symbol: string; precision: number };
    settle_amount?: { amount: string; asset_symbol: string; precision: number };
    metadata?: Record<string, string>;
  };
}

export function verifyAmbossWebhook(
  _payload: string,
  _headers: {
    signature?: string | null;
    timestamp?: string | null;
  }
): AmbossWebhookEnvelope {
  throw new Error("not implemented: verifyAmbossWebhook (issue #7)");
}

export type PIP02ActionPayload = {
  coordinationId: string;
  action: "swap/btc_leg_settled" | "swap/stable_leg_settled";
  payment_reference: string;
  payment_hash?: string;
};

export function translateAmbossEvent(
  _envelope: AmbossWebhookEnvelope,
  _request: NextRequest
): PIP02ActionPayload {
  throw new Error("not implemented: translateAmbossEvent (issue #7)");
}
