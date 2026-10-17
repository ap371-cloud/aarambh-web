import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { OptionList } from "@/components/OptionList";
import { SUBJECTS, allQuestions } from "@/lib/jee/content";
import { recordAnswers } from "@/lib/jee/store";
import { XP_ATTEMPT, XP_CORRECT } from "@/lib/jee/system";
import type { OptionId } from "@/lib/jee/types";

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Mock() {
  const bank = useMemo(() => shuffle(allQuestions()).slice(0, 8), []);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(OptionId | null)[]>(() => bank.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const item = bank[i];

  function choose(id: OptionId) {
    if (submitted) return;
    setPicks((p) => p.map((x, idx) => (idx === i ? id : x)));
  }

  function finish() {
    if (submitted) return;
    const entries = bank.map((b, idx) => ({
      qid: b.q.id,
      picked: picks[idx],
      correct: picks[idx] === b.q.answer,
    }));
    const byTopic = new Map<string, typeof entries>();
    bank.forEach((b, idx) => {
      const arr = byTopic.get(b.topic.id) ?? [];
      arr.push(entries[idx]);
      byTopic.set(b.topic.id, arr);
    });
    byTopic.forEach((rows, topicId) => recordAnswers(topicId, rows));
    setSubmitted(true);
  }

  const score = bank.reduce((s, b, idx) => {
    const p = picks[idx];
    if (p == null) return s;
    return s + (p === b.q.answer ? 4 : -1);
  }, 0);

  const xp = bank.reduce((s, b, idx) => {
    const p = picks[idx];
    if (p == null) return s;
    return s + (p === b.q.answer ? XP_CORRECT : XP_ATTEMPT);
  }, 0);

  if (!item) {
    return (
      <Shell>
        <p>Question bank is empty.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-gold">
            Raid · 8 questions
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">Mixed paper</h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">+4 · -1 · skip 0</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {bank.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            className={
              "grid size-11 place-items-center rounded-lg font-mono text-sm ring-1 transition " +
              (idx === i
                ? "bg-glow text-void ring-glow"
                : picks[idx]
                  ? "bg-good/10 text-good ring-good"
                  : "bg-panel text-ink ring-edge")
            }
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <SystemWindow title="Question" className="mt-5 p-5 md:p-7">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {SUBJECTS[item.chapter.subject].name} · {item.topic.title}
        </p>
        <p className="mt-2 text-lg leading-relaxed">{item.q.stem}</p>
        <OptionList
          options={item.q.options}
          answer={item.q.answer}
          picked={picks[i]}
          revealed={submitted}
          disabled={submitted}
          onPick={choose}
        />
        {submitted && <p className="mt-4 text-sm leading-relaxed text-muted">{item.q.explain}</p>}
      </SystemWindow>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl bg-panel px-4 ring-1 ring-edge"
          onClick={() => setI((n) => Math.max(0, n - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl bg-panel px-4 ring-1 ring-edge"
          onClick={() => setI((n) => Math.min(bank.length - 1, n + 1))}
        >
          Next
        </button>
        {!submitted ? (
          <button
            type="button"
            onClick={finish}
            className="min-h-11 rounded-xl bg-glow px-5 font-medium text-void"
          >
            Submit paper
          </button>
        ) : (
          <p className="font-mono text-2xl">
            Score <span className="font-semibold glow-text text-gold">{score}</span> ·{" "}
            <span className="glow-text text-glow">+{xp} XP</span>
          </p>
        )}
      </div>
    </Shell>
  );
}
