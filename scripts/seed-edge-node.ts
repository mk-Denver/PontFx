import { buildAgentDefinition, publishAgentDefinition } from "../src/lib/pip00/agent";
import { buildEscrowDescriptor } from "../src/lib/pip01/descriptor";
import { buildQuoteDraft } from "../src/lib/quotes/schema";
import { signEvent } from "../src/lib/nostr/sign";
import { publishEvent } from "../src/lib/nostr/publish";

async function main() {
  try {
    process.loadEnvFile(".env");
  } catch {
    console.error("missing .env (copy .env.example)");
    process.exit(1);
  }
  if (!process.env.NOSTR_SK) {
    console.error("NOSTR_SK not set (run: npm run keys)");
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  const loan = 365 * 24 * 3600;

  const descriptorDraft = buildEscrowDescriptor({ expiresAt: now + loan });
  const descriptorEvent = await signEvent(descriptorDraft);
  const descriptorResult = await publishEvent(descriptorEvent);
  console.log("descriptor published:", descriptorResult.published.join(", "));

  const dTag = descriptorDraft.tags.find((t) => t[0] === "d")![1];
  const agent = await publishAgentDefinition({
    capabilities: [{ id: "pontfx/swap", version: 1 }],
    escrowDescriptor: {
      publisherPubkey: descriptorEvent.pubkey,
      dTag,
      relayHint: "",
    },
  });
  console.log("agent definition published:", agent.relays.join(", "));

  const quoteDraft = buildQuoteDraft({
    quoteId: `seed-${now}`,
    direction: "btc_to_stable",
    rate: "105000",
    minAmount: "1000",
    maxAmount: "500000",
    expiresAt: now + 600,
  });
  const quoteEvent = await signEvent(quoteDraft);
  const quoteResult = await publishEvent(quoteEvent);
  console.log("quote published:", quoteResult.published.join(", "));
  console.log("operator pubkey:", quoteEvent.pubkey);
}

main();
