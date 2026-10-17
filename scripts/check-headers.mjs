import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SECURITY_HEADERS, CSP_HEADERS } from "../security/csp.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metaPath = join(root, "security", "csp.js");

const netlify = readFileSync(join(root, "public", "_headers"), "utf8");
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));

const vercelHeaders = new Map(
  (vercel.headers?.[0]?.headers ?? []).map((h) => [h.key.toLowerCase(), h.value]),
);

const problems = [];

for (const { key, value } of SECURITY_HEADERS) {
  const line = `${key}: ${value}`;
  if (!netlify.includes(line)) {
    problems.push(`public/_headers is missing/outdated: ${key}`);
  }
  const got = vercelHeaders.get(key.toLowerCase());
  if (got !== value) {
    problems.push(`vercel.json ${key} is missing/outdated`);
  }
}

if (!netlify.includes(`Content-Security-Policy: ${CSP_HEADERS}`)) {
  problems.push("public/_headers CSP drifted from security/csp.js");
}
if (vercelHeaders.get("content-security-policy") !== CSP_HEADERS) {
  problems.push("vercel.json CSP drifted from security/csp.js");
}

if (problems.length) {
  console.error(`Header drift detected (source of truth: ${metaPath}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`OK - ${SECURITY_HEADERS.length} security headers match security/csp.js`);
