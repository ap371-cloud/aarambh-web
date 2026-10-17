import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { toggleBookmark, useProgress } from "@/lib/jee/store";
import { SUBJECTS, allFormulas } from "@/lib/jee/content";

export function Formulas() {
  const [q, setQ] = useState("");
  const { progress } = useProgress();
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allFormulas().filter(({ chapter, topic, f }) => {
      if (!needle) return true;
      return (
        f.name.toLowerCase().includes(needle) ||
        f.expr.toLowerCase().includes(needle) ||
        topic.title.toLowerCase().includes(needle) ||
        chapter.title.toLowerCase().includes(needle)
      );
    });
  }, [q]);

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-glow">archive</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Formula vault</h1>
      <p className="mt-1 text-muted">
        The identities used inside the drills. Search by name or chapter.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search - range, mole, discriminant..."
        className="mt-4 min-h-12 w-full rounded-xl bg-panel px-4 ring-1 ring-edge outline-none focus:ring-glow"
      />
      <ul className="mt-4 grid gap-3">
        {rows.map(({ chapter, topic, f }) => (
          <li key={`${topic.id}-${f.name}`}>
            <SystemWindow title={`${SUBJECTS[chapter.subject].short} · ${chapter.title}`} className="p-4">
              <p className="font-medium">{f.name}</p>
              <p className="mt-1 font-mono text-2xl tracking-tight text-cyan glow-text">{f.expr}</p>
              <p className="mt-1 text-sm text-muted">
                {f.note} · {topic.title}
              </p>
              <button
                type="button"
                className="mt-2 min-h-11 text-sm text-glow"
                onClick={() => toggleBookmark(`${topic.id}:${f.name}`)}
              >
                {progress.bookmarks.includes(`${topic.id}:${f.name}`) ? "Saved" : "Save formula"}
              </button>
            </SystemWindow>
          </li>
        ))}
        {rows.length === 0 && <li className="text-muted">Nothing matches that search.</li>}
      </ul>
    </Shell>
  );
}
