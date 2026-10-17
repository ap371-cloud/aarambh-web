import { Link } from "react-router-dom";
import { useMemo, useState, type ReactNode } from "react";
import { Shell } from "@/components/Shell";
import { SUBJECTS, allFormulas, allTopics, chapters } from "@/lib/jee/content";

export function Search() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const hits = useMemo(() => {
    const topics = allTopics()
      .filter(
        ({ chapter, topic }) =>
          !needle ||
          topic.title.toLowerCase().includes(needle) ||
          topic.blurb.toLowerCase().includes(needle) ||
          chapter.title.toLowerCase().includes(needle),
      )
      .slice(0, 8);
    const formulas = allFormulas()
      .filter(
        ({ f, chapter }) =>
          !needle ||
          f.name.toLowerCase().includes(needle) ||
          f.expr.toLowerCase().includes(needle) ||
          chapter.title.toLowerCase().includes(needle),
      )
      .slice(0, 8);
    const qs = chapters
      .flatMap((c) => c.topics.flatMap((t) => t.questions.map((question) => ({ c, t, question }))))
      .filter(({ question }) => !needle || question.stem.toLowerCase().includes(needle))
      .slice(0, 6);
    return { topics, formulas, qs };
  }, [needle]);

  return (
    <Shell>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-glow">scan</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Search</h1>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Topic, formula, or a word from a question"
        className="mt-4 min-h-12 w-full rounded-xl bg-panel px-4 ring-1 ring-edge outline-none focus:ring-glow"
      />
      {needle.length < 2 && (
        <p className="mt-4 text-sm text-muted">Type at least two letters.</p>
      )}
      {needle.length >= 2 && (
        <div className="mt-5 grid gap-6">
          <Block title="Lessons">
            {hits.topics.length === 0 && <Empty />}
            {hits.topics.map(({ chapter, topic }) => (
              <Link key={topic.id} to={`/learn/${topic.id}`} className="block py-2 hover:text-glow">
                <span className="font-medium">{topic.title}</span>
                <span className="block text-sm text-muted">
                  {SUBJECTS[chapter.subject].name} · {chapter.title}
                </span>
              </Link>
            ))}
          </Block>
          <Block title="Formulas">
            {hits.formulas.length === 0 && <Empty />}
            {hits.formulas.map(({ f, topic }) => (
              <p key={topic.id + f.name} className="py-2">
                <span className="font-medium">{f.name}</span>
                <span className="block font-mono text-lg text-cyan">{f.expr}</span>
              </p>
            ))}
          </Block>
          <Block title="Questions">
            {hits.qs.length === 0 && <Empty />}
            {hits.qs.map(({ question, t }) => (
              <Link
                key={question.id}
                to={`/practice/${t.id}`}
                className="block py-2 text-sm hover:text-glow"
              >
                {question.stem}
              </Link>
            ))}
          </Block>
        </div>
      )}
    </Shell>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{title}</h2>
      <div className="mt-1 divide-y divide-edge">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="py-2 text-sm text-muted">No match.</p>;
}
