import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { OptionList } from "@/components/OptionList";
import { SUBJECTS, findTopic } from "@/lib/jee/content";
import { recordAnswers, toggleBookmark, useProgress } from "@/lib/jee/store";
import { XP_ATTEMPT, XP_CORRECT } from "@/lib/jee/system";
import type { OptionId } from "@/lib/jee/types";

export function Practice() {
  const { topicId = "" } = useParams();
  const found = findTopic(topicId);
  const { progress } = useProgress();
  const questions = found?.topic.questions ?? [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<OptionId | null>(null);
  const [locked, setLocked] = useState(false);
  const [log, setLog] = useState<{ qid: string; picked: OptionId | null; correct: boolean }[]>([]);

  const q = questions[index];
  const done = index >= questions.length;

  const score = useMemo(
    () => log.reduce((s, x) => s + (x.correct ? 4 : x.picked ? -1 : 0), 0),
    [log],
  );
  const xpEarned = useMemo(
    () => log.reduce((s, x) => s + (x.correct ? XP_CORRECT : x.picked ? XP_ATTEMPT : 0), 0),
    [log],
  );

  if (!found) {
    return (
      <Shell>
        <p>That topic is not in the syllabus.</p>
        <Link to="/syllabus" className="mt-3 inline-block text-glow underline">
          Back to gates
        </Link>
      </Shell>
    );
  }

  function commit(choice: OptionId | null) {
    if (!q || locked) return;
    const entry = { qid: q.id, picked: choice, correct: choice === q.answer };
    setPicked(choice);
    setLocked(true);
    setLog((l) => [...l, entry]);
    recordAnswers(topicId, [entry]);
  }

  function next() {
    setIndex((i) => i + 1);
    setPicked(null);
    setLocked(false);
  }

  if (done) {
    const right = log.filter((x) => x.correct).length;
    return (
      <Shell>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-glow">
          {SUBJECTS[found.chapter.subject].name} · clear
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">{found.topic.title}</h1>
        <SystemWindow title="Dungeon cleared" tone="gold" className="mt-6 p-6">
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                Session score
              </p>
              <p className="font-mono text-5xl font-semibold glow-text text-gold">{score}</p>
            </div>
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">XP gained</p>
              <p className="font-mono text-5xl font-semibold glow-text text-glow">+{xpEarned}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">
            {right} correct · {log.length - right} missed · out of {questions.length * 4}
          </p>
        </SystemWindow>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-12 rounded-xl bg-glow px-5 font-medium text-void"
            onClick={() => {
              setIndex(0);
              setLog([]);
              setPicked(null);
              setLocked(false);
            }}
          >
            Drill again
          </button>
          <Link
            to="/syllabus"
            className="inline-flex min-h-12 items-center rounded-xl bg-panel px-5 ring-1 ring-edge"
          >
            Gates
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
        {SUBJECTS[found.chapter.subject].name} · {found.chapter.title}
      </p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">{found.topic.title}</h1>
        <p className="font-mono text-sm text-muted">
          {index + 1}/{questions.length}
        </p>
      </div>
      <div className="mt-3 xp-track rounded-full">
        <div
          className="xp-fill rounded-full"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <SystemWindow title="Question" className="mt-6 p-5 md:p-7">
        <p className="text-lg leading-relaxed">{q.stem}</p>
        <OptionList
          className="mt-5 grid gap-2"
          options={q.options}
          answer={q.answer}
          picked={picked}
          revealed={locked}
          disabled={locked}
          onPick={commit}
        />

        {locked && (
          <div className="mt-5 rounded-xl bg-abyss p-4 ring-1 ring-edge">
            <p className="text-sm font-medium">
              {picked === q.answer ? (
                <span className="text-good">Correct. +4 marks</span>
              ) : picked ? (
                <span className="text-danger">Incorrect. -1 mark</span>
              ) : (
                <span className="text-muted">Skipped.</span>
              )}{" "}
              Answer {q.answer}.
              <span className="ml-2 font-mono text-xs uppercase tracking-widest text-glow">
                +{picked === q.answer ? XP_CORRECT : picked ? XP_ATTEMPT : 0} XP
              </span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{q.explain}</p>
            <button
              type="button"
              className="mt-3 text-sm text-glow"
              onClick={() => toggleBookmark(q.id)}
            >
              {progress.bookmarks.includes(q.id) ? "Bookmarked" : "Bookmark this doubt"}
            </button>
            <button
              type="button"
              onClick={next}
              className="mt-4 min-h-11 rounded-xl bg-glow px-5 font-medium text-void"
            >
              {index + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </SystemWindow>
    </Shell>
  );
}
