import { Link, useLocation } from "react-router-dom";
import { Atom, BookOpen, Crosshair, LayoutDashboard, RotateCcw, Search, Sigma } from "lucide-react";
import type { ReactNode } from "react";
import { PlayerCard } from "./PlayerCard";
import { SystemNotifications } from "./SystemNotifications";
import { VaultGate } from "./Vault";

const NAV = [
  { to: "/", label: "Status", icon: LayoutDashboard },
  { to: "/syllabus", label: "Gates", icon: BookOpen },
  { to: "/revise", label: "Repair", icon: RotateCcw },
  { to: "/mock", label: "Raid", icon: Crosshair },
] as const;

const MOBILE_NAV = [...NAV, { to: "/formulas", label: "Vault", icon: Sigma }] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-5 md:px-8 md:pb-10">
      <header className="mb-5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-panel-2 text-glow ring-1 ring-edge glow-text">
            <Atom className="size-5" strokeWidth={1.75} />
          </span>
          <span>
            <span className="block text-xl font-semibold leading-none tracking-[0.14em]">AARAMBH</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-glow">
              the system
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full bg-panel px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-good ring-1 ring-edge sm:inline-flex">
            <span className="sys-dot" /> online
          </span>
          <Link
            to="/search"
            className="grid size-11 place-items-center rounded-full bg-panel text-ink ring-1 ring-edge transition hover:text-glow"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>
        </div>
      </header>

      <VaultGate>
      <div className="mb-5 md:hidden">
        <PlayerCard />
      </div>

      <div className="grid flex-1 gap-6 md:grid-cols-[230px_1fr]">
        <aside className="hidden flex-col gap-3 md:flex">
          <PlayerCard />
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm transition " +
                    (active
                      ? "bg-panel-2 text-glow ring-1 ring-edge glow-text"
                      : "text-muted hover:bg-panel hover:text-ink")
                  }
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/formulas"
              className={
                "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm transition " +
                (pathname.startsWith("/formulas")
                  ? "bg-panel-2 text-glow ring-1 ring-edge glow-text"
                  : "text-muted hover:bg-panel hover:text-ink")
              }
            >
              <Sigma className="size-4" />
              Vault
            </Link>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      </VaultGate>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-edge bg-abyss/95 px-2 py-2 backdrop-blur md:hidden">
        {MOBILE_NAV.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[0.65rem] uppercase tracking-wider " +
                (active ? "text-glow glow-text" : "text-muted")
              }
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <SystemNotifications />
    </div>
  );
}
