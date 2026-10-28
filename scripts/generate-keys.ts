import { generateSecretKey } from "nostr-tools/pure";

const sk = generateSecretKey();
const hex = Buffer.from(sk).toString("hex");
console.log("NOSTR_SK=" + hex);
