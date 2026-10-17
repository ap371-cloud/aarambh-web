export type VaultEnvelope = {
  v: number;
  enc: true;
  kdf: string;
  hash: string;
  iter: number;
  salt: string;
  iv: string;
  data: string;
};

export declare const PBKDF2_ITERATIONS: number;

export declare function isSupported(): boolean;

export declare function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iterations?: number,
): Promise<CryptoKey>;

export declare function sealWithKey(
  key: CryptoKey,
  obj: unknown,
  salt: Uint8Array | string,
  iterations?: number,
): Promise<VaultEnvelope>;

export declare function createVault(
  passphrase: string,
  obj: unknown,
  iterations?: number,
): Promise<{ key: CryptoKey; meta: VaultEnvelope }>;

export declare function openWithPassphrase(
  passphrase: string,
  meta: VaultEnvelope,
): Promise<{ key: CryptoKey; salt: string; iterations: number; obj: unknown }>;
