import { Link } from "react-router-dom";
import { ArrowRight, Target, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { RankBadge, XpBar } from "@/components/Hud";
import { SystemWindow } from "@/components/SystemWindow";
import { VaultControl } from "@/components/Vault";
import { SUBJECTS, allTopics } from "@/lib/jee/content";
import {
  STATS,
  STAT_ORDER,
  levelInfo,
  rankFor,
  DAILY_TARGET,
  XP_DAILY_QUEST,
  XP_CORRECT,
  type StatId,
} from "@/lib/jee/system";
import {
  accuracy,
  allocateStat,
  gateSummary,
  setName,
  titles,
  useProgress,
} from "@/lib/jee/store";

export function Home() {
  const { progress, ready } = useProgress();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const info = levelInfo(progress.totalXp);
  const rank = rankFor(info.level);
  const acc = accuracy(progress.history);
  const gates = gateSummary(progress);
  const earnedTitles = titles(progress);
  const doneToday = Math.min(progress.daily.answered, DAILY_TARGET);
  const cleared = progress.daily.cleared;
  const next = useMemo(() => {
    const topics = allTopics();
    const unseen = topics.find(({ topic }) => !progress.topicSeen[topic.id]);
    return unseen ?? topics[0];
  }, [progress.topicSeen]);

  return (
    <Shell>
      <SystemWindow title="Player status" className="p-5 md:p-6" tone="info">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-4">
            <RankBadge id={String(info.level)} color={rank.color} size={84} />
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em]" style={{ color: rank.color }}>
                {rank.label}
              </p>
              {editing ? (
                <form
                  className="mt-1 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setName(draft.trim());
                    setEditing(false);
                  }}
                >
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="min-h-10 w-40 rounded-lg bg-panel px-3 text-ink ring-1 ring-edge outline-none focus:ring-glow"
                    placeholder="Your name"
                  />
                  <button type="submit" className="min-h-10 rounded-lg bg-glow px-4 text-void">
                    Save
                  </button>
                </form>
              ) : (
                <h1 className="text-3xl font-semibold leading-tight">
                  {ready ? progress.name : "..."}
                </h1>
              )}
              <button
                type="button"
                className="mt-0.5 text-xs text-muted underline-offset-2 hover:text-glow hover:underline"
                onClick={() => {
                  setDraft(progress.name);
                  setEditing(true);
                }}
              >
                Rename
              </button>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-3">
            <Metric k="Streak" v={`${progress.streak}d`} />
            <Metric k="Accuracy" v={`${acc}%`} />
            <Metric k="Marks" v={String(progress.xp)} />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between font-mono text-[0.65rem] uppercase tracking-widest text-muted">
            <span>Experience → level {info.level + 1}</span>
            <span>
              {info.into} / {info.need} XP
            </span>
          </div>
          <XpBar into={info.into} need={info.need} />
          <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            {progress.totalXp} XP lifetime · {XP_CORRECT} XP per correct answer
          </p>
        </div>
      </SystemWindow>

      <SystemWindow
        title="Daily quest"
        tone={cleared ? "good" : "gold"}
        className="mt-5 p-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {cleared ? "Quest cleared" : "Answer 5 questions today"}
          </h2>
          <p className="font-mono text-sm text-muted">
            {doneToday}/{DAILY_TARGET}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted">
          The System does not accept excuses. Show up daily - this is what a streak is made of.
        </p>
        <div className="mt-3">
          <XpBar
            into={doneToday}
            need={DAILY_TARGET}
            gold={!cleared}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-gold">
            {cleared ? "+1 stat point claimed" : `Reward: +${XP_DAILY_QUEST} XP & +1 stat point`}
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-danger">
            Fail: streak resets
          </p>
        </div>
        {!cleared && (
          <Link
            to={`/practice/${next.topic.id}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-glow px-5 font-medium text-void"
          >
            Start today&apos;s drill <ArrowRight className="size-4" />
          </Link>
        )}
      </SystemWindow>

      <SystemWindow title="Stat window" tone="cyan" className="mt-5 p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-muted">Spend points earned on level-up.</p>
          <p
            className={
              "font-mono text-[0.65rem] uppercase tracking-widest " +
              (progress.statPoints > 0 ? "text-gold glow-text" : "text-muted")
            }
          >
            {progress.statPoints} available
          </p>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {STAT_ORDER.map((id) => (
            <StatRow
              key={id}
              id={id}
              value={progress.stats[id]}
              canSpend={progress.statPoints > 0}
            />
          ))}
        </ul>
      </SystemWindow>

      <SystemWindow title="Gates" className="mt-5 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {gates.map((g) => (
            <Link
              key={g.subject}
              to={`/syllabus?subject=${g.subject}`}
              className="rounded-xl bg-panel p-4 ring-1 ring-edge transition hover:ring-glow"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  {SUBJECTS[g.subject].short}
                </p>
                <span
                  className="rank-hex size-6 text-[0.6rem]"
                  style={{ background: g.color, color: "#04060d" }}
                  aria-hidden
                >
                  {g.rank}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-semibold">{SUBJECTS[g.subject].name}</h3>
              <p className="mt-0.5 text-xs text-muted">
                {g.drilled}/{g.total} topics drilled
              </p>
              <div className="mt-3">
                <XpBar into={g.pct} need={100} />
              </div>
            </Link>
          ))}
        </div>
      </SystemWindow>

      <SystemWindow title="Titles earned" className="mt-5 p-5">
        <ul className="flex flex-wrap gap-2">
          {earnedTitles.map((t) => (
            <li
              key={t.id}
              title={t.desc}
              className={
                "rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest ring-1 " +
                (t.on ? "bg-panel-2 text-gold ring-gold/50 glow-text" : "text-muted ring-edge")
              }
            >
              {t.on ? t.title : `locked · ${t.title}`}
            </li>
          ))}
        </ul>
      </SystemWindow>

      <VaultControl />

      {next && (
        <SystemWindow title="Continue" tone="cyan" className="mt-5">
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-glow">
                <Target className="size-3.5" /> next objective
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{next.topic.title}</h2>
              <p className="text-sm text-muted">
                {SUBJECTS[next.chapter.subject].name} · {next.chapter.title} · {next.topic.minutes} min
              </p>
            </div>
            <Link
              to={`/learn/${next.topic.id}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-glow px-5 font-medium text-void"
            >
              Open lesson <ArrowRight className="size-4" />
            </Link>
          </div>
        </SystemWindow>
      )}
    </Shell>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-panel px-3 py-2 ring-1 ring-edge">
      <p className="font-mono text-2xl font-semibold">{v}</p>
      <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">{k}</p>
    </div>
  );
}

function StatRow({
  id,
  value,
  canSpend,
}: {
  id: StatId;
  value: number;
  canSpend: boolean;
}) {
  const meta = STATS[id];
  return (
    <li className="flex items-center gap-3 rounded-xl bg-panel px-3 py-2.5 ring-1 ring-edge">
      <span className="font-mono text-xs font-semibold text-glow">{meta.short}</span>
      <span className="font-mono text-lg font-semibold">{value}</span>
      <span className="min-w-0 flex-1 truncate text-xs text-muted">{meta.desc}</span>
      {canSpend && (
        <button
          type="button"
          onClick={() => allocateStat(id)}
          aria-label={`Raise ${meta.label}`}
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-glow text-void"
        >
          <Plus className="size-4" />
        </button>
      )}
    </li>
  );
}
