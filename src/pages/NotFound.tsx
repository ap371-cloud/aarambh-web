import { Link } from "react-router-dom";
import { Shell } from "@/components/Shell";

export function NotFound() {
  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-danger">
        signal lost
      </p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-muted">That page isn&apos;t in the System.</p>
      <Link
        to="/"
        className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-glow px-4 font-medium text-void"
      >
        Back to status
      </Link>
    </Shell>
  );
}
