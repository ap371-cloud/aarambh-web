import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { OptionList } from "@/components/OptionList";
import { SUBJECTS, allQuestions } from "@/lib/jee/content";
import { latestByQuestion, recordAnswers, useProgress } from "@/lib/jee/store";
import { XP_ATTEMPT, XP_CORRECT } from "@/lib/jee/system";
import type { OptionId } from "@/lib/jee/types";

export function Revise() {
  const { progress } = useProgress();
  const misses = useMemo(() => {
    const latest = latestByQuestion(progress.history);
    const bank = allQuestions();
    return bank.filter(({ q }) => {
      const a = latest.get(q.id);
      return a && a.picked != null && !a.correct;
    });
  }, [progress.history]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<OptionId | null>(null);
  // Freeze the list once so answering (which removes a hit from `misses`) never
  // shifts the index under the user mid-session.
  const [queue, setQueue] = useState<typeof misses>([]);
  useEffect(() => {
    setQueue((current) => (current.length === 0 && misses.length > 0 ? misses : current));
  }, [misses]);

  const active = queue.length > 0 ? queue : misses;
  const item = active[i];

  if (!item) {
    return (
      <Shell>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-good">
          no open wounds
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Repair room</h1>
        <p className="mt-2 max-w-md text-muted">
          Nothing to repair yet. Miss a question in a drill and it lands here, the way a doubt stays
          until you clear it.
        </p>
        <Link
          to="/syllabus"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-glow px-4 font-medium text-void"
        >
          Open gates
        </Link>
      </Shell>
    );
  }

  const locked = picked != null;

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-danger">
        missed once · clear it
      </p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Repair room</h1>
      <p className="mt-1 font-mono text-sm text-muted">
        {i + 1} / {active.length} · {SUBJECTS[item.chapter.subject].name}
      </p>
      <SystemWindow title="Repair" tone="danger" className="mt-5 p-5">
        <p className="text-lg leading-relaxed">{item.q.stem}</p>
        <OptionList
          options={item.q.options}
          answer={item.q.answer}
          picked={picked}
          revealed={locked}
          disabled={locked}
          onPick={(id) => {
            setPicked(id);
            recordAnswers(item.topic.id, [
              { qid: item.q.id, picked: id, correct: id === item.q.answer },
            ]);
          }}
        />
        {locked && (
          <p className="mt-4 text-sm text-muted">
            {item.q.explain}
            <span className="ml-2 font-mono text-xs uppercase tracking-widest text-glow">
              +{picked === item.q.answer ? XP_CORRECT : XP_ATTEMPT} XP
            </span>
          </p>
        )}
      </SystemWindow>
      {locked && (
        <button
          type="button"
          className="mt-4 min-h-11 rounded-xl bg-glow px-5 font-medium text-void"
          onClick={() => {
            setPicked(null);
            setI((n) => (n + 1) % Math.max(active.length, 1));
          }}
        >
          Next miss
        </button>
      )}
    </Shell>
  );
}
