import type { ReactNode } from "react";

type Tone = "info" | "gold" | "danger" | "good" | "cyan";

export function SystemWindow({
  title,
  tone = "info",
  className = "",
  bodyClassName = "",
  children,
}: {
  title?: string;
  tone?: Tone;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const toneClass = tone === "info" ? "" : tone;
  return (
    <section className={`sys-window ${toneClass} ${className}`}>
      <span className="sys-corner tl" />
      <span className="sys-corner tr" />
      <span className="sys-corner bl" />
      <span className="sys-corner br" />
      {title && (
        <header className="sys-head">
          <span className="sys-dot" />
          {title}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
