import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { SystemWindow } from "@/components/SystemWindow";
import { SUBJECTS, lessonFor } from "@/lib/jee/content";
import { markLesson, saveNote, useProgress } from "@/lib/jee/store";

export function Learn() {
  const { topicId = "" } = useParams();
  const lesson = lessonFor(topicId);
  const { progress } = useProgress();
  const [step, setStep] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  if (!lesson) {
    return (
      <Shell>
        <p>That lesson is not on the path.</p>
        <Link to="/syllabus" className="mt-3 inline-block text-glow underline">
          Gates
        </Link>
      </Shell>
    );
  }

  const current = lesson.steps[step];
  const text = note ?? progress.notes[topicId] ?? "";
  const last = step === lesson.steps.length - 1;

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
        {SUBJECTS[lesson.chapter.subject].name} · {lesson.chapter.title}
      </p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">{lesson.topic.title}</h1>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-glow">
        briefing {step + 1} / {lesson.steps.length} · {lesson.topic.minutes} min
      </p>
      <div className="mt-3 xp-track rounded-full">
        <div
          className="xp-fill rounded-full"
          style={{ width: `${((step + 1) / lesson.steps.length) * 100}%` }}
        />
      </div>

      <SystemWindow title="Briefing" tone="cyan" className="mt-5 p-6">
        <h2 className="text-2xl font-semibold">{current.title}</h2>
        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink/90">{current.body}</p>
      </SystemWindow>

      <label className="mt-4 block font-mono text-[0.65rem] uppercase tracking-widest text-muted">
        Field note
        <textarea
          value={text}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => saveNote(topicId, note ?? progress.notes[topicId] ?? "")}
          rows={3}
          placeholder="Write the one line you want to remember."
          className="mt-1 w-full rounded-xl bg-panel px-3 py-2 font-sans text-base text-ink ring-1 ring-edge outline-none focus:ring-glow"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl bg-panel px-4 ring-1 ring-edge"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </button>
        {last ? (
          <Link
            to={`/practice/${topicId}`}
            onClick={() => markLesson(topicId)}
            className="inline-flex min-h-11 items-center rounded-xl bg-glow px-5 font-medium text-void"
          >
            Enter practice
          </Link>
        ) : (
          <button
            type="button"
            className="min-h-11 rounded-xl bg-glow px-5 font-medium text-void"
            onClick={() => setStep((s) => s + 1)}
          >
            Next idea
          </button>
        )}
      </div>
    </Shell>
  );
}
