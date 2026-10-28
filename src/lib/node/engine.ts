import type { Quote } from "@/lib/swap/types";
import { BTC, USDT, USDT_PRECISION } from "@/lib/quotes/constants";

export interface InventoryConfig {
  btc_sats_balance: number;
  usdt_base_units: number;
  spread_bps: number;
}

export interface QuoteEngineOutput {
  btc_to_stable: Omit<Quote, "event" | "agent_pubkey" | "quote_id">;
  stable_to_btc: Omit<Quote, "event" | "agent_pubkey" | "quote_id">;
}

export const DEFAULT_INVENTORY: InventoryConfig = {
  btc_sats_balance: 2_000_000,
  usdt_base_units: 1_000_000_000,
  spread_bps: Number(process.env.FX_DEFAULT_SPREAD_BPS ?? 150),
};

export function computeQuote(
  inventory: InventoryConfig,
  externalMidRateStablePerSat: number
): QuoteEngineOutput {
  const halfSpread = inventory.spread_bps / 2 / 10_000;

  const buyRate = externalMidRateStablePerSat * (1 - halfSpread);
  const sellRate = externalMidRateStablePerSat * (1 + halfSpread);

  return {
    btc_to_stable: {
      direction: "btc_to_stable",
      from_asset: BTC,
      to_asset: USDT,
      rate: buyRate.toFixed(USDT_PRECISION),
      min_amount: "1",
      max_amount: String(inventory.btc_sats_balance),
      expires_at: 0,
    },
    stable_to_btc: {
      direction: "stable_to_btc",
      from_asset: USDT,
      to_asset: BTC,
      rate: (1 / sellRate).toFixed(12),
      min_amount: "1",
      max_amount: String(inventory.usdt_base_units),
      expires_at: 0,
    },
  };
}

export function setInventoryConfig(patch: Partial<InventoryConfig>): InventoryConfig {
  return { ...DEFAULT_INVENTORY, ...patch };
}
