// AES-256-GCM under a PBKDF2-SHA256 key, kept free of DOM and storage so the
// store can reuse it and Node can test it directly. crypto.subtle exists only in
// a secure context (https/localhost) - call isSupported() before reaching for it.

// 200k rounds: heavy enough to make guessing a passphrase expensive, still under
// a second on a normal laptop.
export const PBKDF2_ITERATIONS = 200000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function isSupported() {
  return Boolean(globalThis.crypto && globalThis.crypto.subtle);
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function deriveKey(passphrase, salt, iterations = PBKDF2_ITERATIONS) {
  const base = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function sealWithKey(key, obj, salt, iterations = PBKDF2_ITERATIONS) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(obj)),
  );
  return {
    v: 2,
    enc: true,
    kdf: "PBKDF2",
    hash: "SHA-256",
    iter: iterations,
    salt: typeof salt === "string" ? salt : toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(cipher)),
  };
}

export async function createVault(passphrase, obj, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(passphrase, salt, iterations);
  const meta = await sealWithKey(key, obj, salt, iterations);
  return { key, meta };
}

// A wrong passphrase fails GCM's authentication tag and throws - there is no
// partial or garbage decrypt to guard against.
export async function openWithPassphrase(passphrase, meta) {
  const salt = fromBase64(meta.salt);
  const iterations = meta.iter || PBKDF2_ITERATIONS;
  const key = await deriveKey(passphrase, salt, iterations);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(meta.iv) },
    key,
    fromBase64(meta.data),
  );
  return { key, salt: meta.salt, iterations, obj: JSON.parse(decoder.decode(plain)) };
}
