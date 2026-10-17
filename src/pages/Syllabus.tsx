import { Link, useSearchParams } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { SUBJECTS, chapters } from "@/lib/jee/content";
import { gateSummary, useProgress } from "@/lib/jee/store";
import type { SubjectId } from "@/lib/jee/types";

const SUBJECT_IDS: SubjectId[] = ["phy", "chem", "math"];

function parseSubject(value: string | null): SubjectId | undefined {
  return value === "phy" || value === "chem" || value === "math" ? value : undefined;
}

export function Syllabus() {
  const [params] = useSearchParams();
  const subject = parseSubject(params.get("subject"));
  const { progress } = useProgress();
  const gates = gateSummary(progress);
  const list = subject ? chapters.filter((c) => c.subject === subject) : chapters;

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-glow">gate map</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Gates</h1>
      <p className="mt-1 max-w-xl text-muted">
        A tight slice of Class 11-12 - enough to drill, not a dumped textbook. Clear every topic to
        crash a gate.
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {gates.map((g) => (
          <li
            key={g.subject}
            className="flex items-center gap-3 rounded-xl bg-panel px-3 py-2 ring-1 ring-edge"
          >
            <span
              className="rank-hex size-7 text-[0.6rem]"
              style={{ background: g.color, color: "#04060d" }}
              aria-hidden
            >
              {g.rank}
            </span>
            <span className="text-sm">{SUBJECTS[g.subject].name}</span>
            <span className="ml-auto font-mono text-xs text-muted">
              {g.drilled}/{g.total}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <Filter to="/syllabus" active={!subject} label="All" />
        {SUBJECT_IDS.map((id) => (
          <Filter
            key={id}
            to={`/syllabus?subject=${id}`}
            active={subject === id}
            label={SUBJECTS[id].name}
          />
        ))}
      </div>

      <ul className="mt-6 grid gap-4">
        {list.map((c) => (
          <li key={c.id}>
            <SystemWindow title={`${SUBJECTS[c.subject].short} · class ${c.classLevel}`} className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-semibold">{c.title}</h2>
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  {c.weight}
                </p>
              </div>
              <ul className="mt-3 divide-y divide-edge">
                {c.topics.map((t) => {
                  const seen = progress.topicSeen[t.id] ?? 0;
                  return (
                    <li
                      key={t.id}
                      className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-sm text-muted">
                          {t.blurb} · {t.questions.length} Q · {t.minutes} min
                          {seen ? ` · drilled ${seen}×` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/learn/${t.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-panel px-4 text-sm ring-1 ring-edge transition hover:ring-glow"
                        >
                          Briefing
                        </Link>
                        <Link
                          to={`/practice/${t.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-glow px-4 text-sm font-medium text-void"
                        >
                          Enter
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SystemWindow>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Filter({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link
      to={to}
      className={
        "inline-flex min-h-11 items-center rounded-full px-4 text-sm ring-1 transition " +
        (active ? "bg-glow text-void ring-glow" : "bg-panel text-ink ring-edge hover:ring-glow")
      }
    >
      {label}
    </Link>
  );
}
