import { createVault, openWithPassphrase, isSupported } from "../security/vault.js";

if (!isSupported()) {
  console.error("SKIP - crypto.subtle unavailable in this runtime");
  process.exit(1);
}

const secret = {
  name: "Aryan",
  totalXp: 1234,
  streak: 12,
  history: [{ qid: "kin-1", picked: "A", correct: true, at: 1 }],
  notes: { "kin-1d": "SUVAT signs" },
};
const passphrase = "correct horse battery staple";

const { meta } = await createVault(passphrase, secret);

if (!meta.enc || meta.v !== 2 || typeof meta.data !== "string") {
  throw new Error("vault envelope malformed");
}
if (JSON.stringify(meta).includes("Aryan") || JSON.stringify(meta).includes("SUVAT")) {
  throw new Error("plaintext leaked into the stored envelope");
}

const opened = await openWithPassphrase(passphrase, meta);
if (JSON.stringify(opened.obj) !== JSON.stringify(secret)) {
  throw new Error("decrypt round-trip mismatch");
}

let rejected = false;
try {
  await openWithPassphrase("wrong passphrase", meta);
} catch {
  rejected = true;
}
if (!rejected) {
  throw new Error("a wrong passphrase was accepted");
}

console.log("OK - AES-256-GCM round-trip holds, ciphertext carries no plaintext, wrong pass rejected");
