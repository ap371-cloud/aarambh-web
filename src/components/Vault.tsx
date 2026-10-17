import { useState, type ReactNode } from "react";
import { KeyRound, Lock, ShieldCheck, ShieldOff } from "lucide-react";
import { SystemWindow } from "./SystemWindow";
import { disableVault, enableVault, lockVault, unlockVault, useVault } from "@/lib/jee/store";

export function VaultGate({ children }: { children: ReactNode }) {
  const { locked } = useVault();
  if (!locked) return <>{children}</>;
  return (
    <div className="mx-auto w-full max-w-md py-6">
      <UnlockScreen />
    </div>
  );
}

function UnlockScreen() {
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!passphrase || busy) return;
    setBusy(true);
    setError("");
    const ok = await unlockVault(passphrase);
    setBusy(false);
    if (!ok) {
      setError("Incorrect passphrase. The vault stays sealed.");
      setPassphrase("");
    }
  }

  return (
    <SystemWindow title="Vault sealed" tone="danger" className="p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-panel-2 text-danger ring-1 ring-edge">
          <Lock className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Enter passphrase</h2>
          <p className="text-xs text-muted">Your progress is encrypted on this device.</p>
        </div>
      </div>

      <form className="mt-5 flex flex-col gap-2" onSubmit={submit}>
        <input
          autoFocus
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase"
          autoComplete="current-password"
          className="min-h-11 rounded-lg bg-panel px-3 text-ink ring-1 ring-edge outline-none focus:ring-glow"
        />
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-lg bg-glow font-medium text-void disabled:opacity-60"
        >
          {busy ? "Decrypting..." : "Unlock"}
        </button>
      </form>

      {error && <p className="mt-2 font-mono text-xs text-danger">{error}</p>}

      <button
        type="button"
        onClick={disableVault}
        className="mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline-offset-2 hover:text-danger hover:underline"
      >
        Forgot passphrase - wipe & start over
      </button>
    </SystemWindow>
  );
}

export function VaultControl() {
  const { enabled, supported } = useVault();
  const [formOpen, setFormOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!passphrase.trim() || busy) return;
    setBusy(true);
    setError("");
    const ok = await enableVault(passphrase.trim());
    setBusy(false);
    if (ok) {
      setFormOpen(false);
      setPassphrase("");
    } else {
      setError("Could not engage the vault here.");
    }
  }

  return (
    <SystemWindow title="Vault" tone={enabled ? "cyan" : "info"} className="mt-5 p-5">
      <div className="flex items-start gap-3">
        <span
          className={
            "grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-edge " +
            (enabled ? "bg-panel-2 text-glow" : "bg-panel text-muted")
          }
        >
          {enabled ? <ShieldCheck className="size-5" /> : <ShieldOff className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">
            {enabled ? "Progress encrypted" : "Encrypt local progress"}
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {enabled
              ? "AES-256-GCM, key derived from your passphrase. The passphrase is never stored - lose it and the data is unrecoverable."
              : "Nothing leaves this device. Add a passphrase to keep your progress unreadable at rest in the browser."}
          </p>
        </div>
      </div>

      {!supported && (
        <p className="mt-3 rounded-lg bg-panel px-3 py-2 font-mono text-[0.62rem] text-danger ring-1 ring-edge">
          Encryption needs a secure context (https or localhost).
        </p>
      )}

      {supported && enabled && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={lockVault}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-glow px-4 font-medium text-void"
          >
            <Lock className="size-4" /> Lock now
          </button>
          <button
            type="button"
            onClick={disableVault}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-panel px-4 text-ink ring-1 ring-edge"
          >
            <ShieldOff className="size-4" /> Disable encryption
          </button>
        </div>
      )}

      {supported && !enabled && !formOpen && (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-glow px-4 font-medium text-void"
        >
          <KeyRound className="size-4" /> Enable encryption
        </button>
      )}

      {supported && !enabled && formOpen && (
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
          <input
            autoFocus
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Choose a passphrase"
            autoComplete="new-password"
            className="min-h-11 flex-1 rounded-lg bg-panel px-3 text-ink ring-1 ring-edge outline-none focus:ring-glow"
          />
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 rounded-lg bg-glow px-5 font-medium text-void disabled:opacity-60"
          >
            {busy ? "Sealing..." : "Engage vault"}
          </button>
        </form>
      )}

      {error && <p className="mt-2 font-mono text-xs text-danger">{error}</p>}
    </SystemWindow>
  );
}
