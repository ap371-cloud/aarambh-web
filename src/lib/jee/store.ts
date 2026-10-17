import { useEffect, useState } from "react";
import type { Attempt, OptionId, SubjectId } from "./types";
import { chapters } from "./content";
import {
  DAILY_TARGET,
  STAT_POINTS_PER_LEVEL,
  STAT_ORDER,
  XP_ATTEMPT,
  XP_CORRECT,
  XP_DAILY_QUEST,
  XP_LESSON,
  isHigherRank,
  levelInfo,
  rankFor,
  type RankId,
  type StatId,
  type SystemNote,
} from "./system";
import {
  isSupported as vaultSupported,
  openWithPassphrase,
  sealWithKey,
  createVault,
  type VaultEnvelope,
} from "../../../security/vault.js";

const KEY = "aarambh-progress-v1";

export type Progress = {
  name: string;
  xp: number;
  totalXp: number;
  streak: number;
  lastActive: string;
  history: Attempt[];
  topicSeen: Record<string, number>;
  lessons: Record<string, boolean>;
  bookmarks: string[];
  notes: Record<string, string>;
  stats: Record<StatId, number>;
  statPoints: number;
  questDays: string[];
  daily: { date: string; answered: number; cleared: boolean };
};

const BASE_STAT = 10;

const empty = (): Progress => ({
  name: "Aspirant",
  xp: 0,
  totalXp: 0,
  streak: 0,
  lastActive: "",
  history: [],
  topicSeen: {},
  lessons: {},
  bookmarks: [],
  notes: {},
  stats: { intelligence: BASE_STAT, focus: BASE_STAT, memory: BASE_STAT, speed: BASE_STAT, discipline: BASE_STAT },
  statPoints: 0,
  questDays: [],
  daily: { date: "", answered: 0, cleared: false },
});

function localDay(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function today() {
  return localDay(new Date());
}

function distinctToday(history: Attempt[]) {
  const day = today();
  const seen = new Set<string>();
  for (const h of history) {
    if (localDay(new Date(h.at)) === day) seen.add(h.qid);
  }
  return seen.size;
}

function normalize(parsed: Partial<Progress>): Progress {
  const base = empty();
  const merged: Progress = {
    ...base,
    ...parsed,
    stats: { ...base.stats, ...(parsed.stats ?? {}) },
    daily: { ...base.daily, ...(parsed.daily ?? {}) },
    questDays: parsed.questDays ?? [],
  };
  const day = today();
  if (merged.daily.date !== day) {
    merged.daily = { date: day, answered: distinctToday(merged.history), cleared: false };
  } else {
    merged.daily.answered = distinctToday(merged.history);
  }
  return merged;
}

function save(p: Progress) {
  if (vaultKey && vaultSalt) {
    // Fire-and-forget: an unwritable vault shouldn't tear the interaction down.
    void sealWithKey(vaultKey, p, vaultSalt, vaultIterations)
      .then((meta) => localStorage.setItem(KEY, JSON.stringify(meta)))
      .catch(() => {});
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(p));
}

let memory = empty();
const listeners = new Set<() => void>();

function emit(next: Progress) {
  memory = next;
  save(next);
  listeners.forEach((l) => l());
}

let vaultKey: CryptoKey | null = null;
let vaultSalt: string | null = null;
let vaultIterations = 0;
let vaultLocked = false;
const vaultSubs = new Set<() => void>();

function notifyVault() {
  vaultSubs.forEach((s) => s());
}

function parseStored(): unknown {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    // A half-written blob (quota crash, someone poking devtools) reads as no data.
    if (err instanceof SyntaxError) return null;
    throw err;
  }
}

function readVault(): VaultEnvelope | null {
  const parsed = parseStored();
  return parsed && (parsed as VaultEnvelope).enc ? (parsed as VaultEnvelope) : null;
}

async function loadProgress(): Promise<{ progress: Progress; locked: boolean }> {
  const parsed = parseStored();
  if (parsed === null) return { progress: empty(), locked: false };
  if ((parsed as VaultEnvelope).enc) {
    // Unlocked: `memory` already holds the decrypted payload. Otherwise the disk
    // stays sealed until unlockVault runs.
    if (!vaultKey) return { progress: empty(), locked: true };
    return { progress: memory, locked: false };
  }
  return { progress: normalize(parsed as Partial<Progress>), locked: false };
}

export function useProgress() {
  const [state, setState] = useState<Progress>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;
    loadProgress().then(({ progress, locked }) => {
      if (!active) return;
      vaultLocked = locked;
      memory = locked ? empty() : progress;
      setState({ ...memory });
      setReady(true);
      notifyVault();
      const sub = () => setState({ ...memory });
      listeners.add(sub);
      unsub = () => listeners.delete(sub);
    });
    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  return { progress: state, ready };
}

export function useVault() {
  const [state, setState] = useState({
    locked: false,
    enabled: false,
    supported: vaultSupported(),
  });
  useEffect(() => {
    const read = () => ({
      locked: vaultLocked,
      enabled: readVault() !== null || vaultKey !== null,
      supported: vaultSupported(),
    });
    setState(read());
    const sub = () => setState(read());
    vaultSubs.add(sub);
    return () => {
      vaultSubs.delete(sub);
    };
  }, []);
  return state;
}

export async function enableVault(passphrase: string): Promise<boolean> {
  if (!vaultSupported() || !passphrase.trim()) return false;
  const { key, meta } = await createVault(passphrase, memory);
  vaultKey = key;
  vaultSalt = meta.salt;
  vaultIterations = meta.iter;
  vaultLocked = false;
  localStorage.setItem(KEY, JSON.stringify(meta));
  notifyVault();
  notify({
    kind: "good",
    title: "Vault engaged",
    body: "Progress is now encrypted with AES-256-GCM. Keep the passphrase - it is not stored anywhere.",
  });
  return true;
}

export function disableVault() {
  if (!vaultKey && !readVault()) return;
  vaultKey = null;
  vaultSalt = null;
  vaultIterations = 0;
  vaultLocked = false;
  localStorage.setItem(KEY, JSON.stringify(memory));
  notifyVault();
  notify({ kind: "danger", title: "Vault disengaged", body: "Progress is stored unencrypted on this device again." });
}

export async function unlockVault(passphrase: string): Promise<boolean> {
  const meta = readVault();
  if (!meta) return false;
  try {
    const { key, salt, iterations, obj } = await openWithPassphrase(passphrase, meta);
    vaultKey = key;
    vaultSalt = salt;
    vaultIterations = iterations;
    vaultLocked = false;
    memory = normalize(obj as Partial<Progress>);
    save(memory);
    listeners.forEach((l) => l());
    notifyVault();
    return true;
  } catch (err) {
    // A wrong passphrase only fails GCM authentication (a DOMException). Anything
    // else is a real bug and should surface instead of reading as "bad passphrase".
    if (err instanceof DOMException) return false;
    throw err;
  }
}

export function lockVault() {
  if (!vaultKey) return;
  vaultKey = null;
  vaultSalt = null;
  vaultIterations = 0;
  vaultLocked = true;
  memory = empty();
  listeners.forEach((l) => l());
  notifyVault();
}

let notes: SystemNote[] = [];
let noteSeq = 0;
const noteSubs = new Set<() => void>();

function setNotes(next: SystemNote[]) {
  notes = next;
  noteSubs.forEach((s) => s());
}

export function notify(note: Omit<SystemNote, "id">) {
  const id = ++noteSeq;
  setNotes([...notes, { ...note, id }].slice(-4));
  window.setTimeout(() => setNotes(notes.filter((n) => n.id !== id)), note.kind === "gold" ? 7000 : 5200);
}

export function dismissNote(id: number) {
  setNotes(notes.filter((n) => n.id !== id));
}

export function useSystemNotes() {
  const [state, setState] = useState(notes);
  useEffect(() => {
    const sub = () => setState([...notes]);
    noteSubs.add(sub);
    return () => {
      noteSubs.delete(sub);
    };
  }, []);
  return state;
}

function withXp(p: Progress, amount: number) {
  const before = levelInfo(p.totalXp).level;
  const totalXp = p.totalXp + amount;
  const after = levelInfo(totalXp).level;
  const gained = after - before;
  return {
    totalXp,
    beforeLevel: before,
    afterLevel: after,
    statPoints: p.statPoints + gained * STAT_POINTS_PER_LEVEL,
  };
}

function announceLevel(beforeLevel: number, afterLevel: number) {
  if (afterLevel <= beforeLevel) return;
  const rank = rankFor(afterLevel);
  notify({ kind: "gold", title: "You have leveled up", body: `Level ${beforeLevel} → ${afterLevel} · now ${rank.label} · +${(afterLevel - beforeLevel) * STAT_POINTS_PER_LEVEL} stat points` });
  const beforeRank = rankFor(beforeLevel).id;
  if (isHigherRank(rank.id, beforeRank)) {
    notify({ kind: "gold", title: "Rank up", body: `You are now ${rank.label}. The System has recorded your growth.` });
  }
}

export function setName(name: string) {
  emit({ ...memory, name: name.slice(0, 24) || "Aspirant" });
}

export function allocateStat(stat: StatId) {
  if (memory.statPoints <= 0) return;
  emit({
    ...memory,
    statPoints: memory.statPoints - 1,
    stats: { ...memory.stats, [stat]: (memory.stats[stat] ?? BASE_STAT) + 1 },
  });
  notify({ kind: "info", title: "Stat raised", body: `${stat.toUpperCase()} increased.` });
}

export function recordAnswers(
  topicId: string,
  picks: { qid: string; picked: OptionId | null; correct: boolean }[],
) {
  const day = today();
  const yesterday = localDay(new Date(Date.now() - 86400000));
  const brokeStreak = memory.streak > 1 && memory.lastActive !== day && memory.lastActive !== yesterday && memory.lastActive !== "";

  let streak = memory.streak;
  if (memory.lastActive !== day) {
    streak = memory.lastActive === yesterday ? memory.streak + 1 : 1;
  } else if (streak === 0) {
    streak = 1;
  }

  const delta = picks.reduce((s, p) => s + (p.correct ? 4 : p.picked ? -1 : 0), 0);
  const attemptsXp = picks.reduce((s, p) => s + (p.correct ? XP_CORRECT : p.picked ? XP_ATTEMPT : 0), 0);

  const history: Attempt[] = [
    ...memory.history,
    ...picks.map((p) => ({ ...p, at: Date.now() })),
  ].slice(-400);

  const answeredToday = distinctToday(history);
  const wasCleared = memory.daily.cleared;
  const clearsNow = !wasCleared && answeredToday >= DAILY_TARGET;

  const bonusXp = clearsNow ? XP_DAILY_QUEST : 0;
  const xp = withXp(memory, attemptsXp + bonusXp);

  emit({
    ...memory,
    xp: Math.max(0, memory.xp + delta),
    totalXp: xp.totalXp,
    streak,
    lastActive: day,
    history,
    topicSeen: { ...memory.topicSeen, [topicId]: (memory.topicSeen[topicId] ?? 0) + 1 },
    statPoints: xp.statPoints + (clearsNow ? 1 : 0),
    questDays: clearsNow ? [...memory.questDays, day] : memory.questDays,
    daily: { date: day, answered: answeredToday, cleared: wasCleared || clearsNow },
  });

  if (brokeStreak) {
    notify({ kind: "danger", title: "Penalty zone", body: `A day slipped by. Streak reset to ${streak}. Start the daily quest again.` });
  }
  if (clearsNow) {
    notify({ kind: "good", title: "Daily quest complete", body: `+${XP_DAILY_QUEST} XP and a stat point. Discipline holds.` });
  }
  announceLevel(xp.beforeLevel, xp.afterLevel);
}

export function markLesson(topicId: string) {
  const first = !memory.lessons[topicId];
  if (!first) {
    emit({ ...memory, lessons: { ...memory.lessons, [topicId]: true } });
    return;
  }
  const xp = withXp(memory, XP_LESSON);
  emit({
    ...memory,
    lessons: { ...memory.lessons, [topicId]: true },
    totalXp: xp.totalXp,
    statPoints: xp.statPoints,
  });
  notify({ kind: "info", title: "Lesson logged", body: `+${XP_LESSON} XP for walking the chapter.` });
  announceLevel(xp.beforeLevel, xp.afterLevel);
}

export function subjectStats(history: Attempt[]) {
  const map: Record<SubjectId, { right: number; wrong: number }> = {
    phy: { right: 0, wrong: 0 },
    chem: { right: 0, wrong: 0 },
    math: { right: 0, wrong: 0 },
  };
  const byId = new Map<string, SubjectId>();
  for (const c of chapters) {
    for (const t of c.topics) {
      for (const q of t.questions) byId.set(q.id, c.subject);
    }
  }
  for (const h of history) {
    const s = byId.get(h.qid);
    if (!s || h.picked == null) continue;
    if (h.correct) map[s].right += 1;
    else map[s].wrong += 1;
  }
  return map;
}

export function accuracy(history: Attempt[]) {
  const graded = history.filter((h) => h.picked != null);
  if (!graded.length) return 0;
  return Math.round((graded.filter((h) => h.correct).length / graded.length) * 100);
}

export function todayCount(history: Attempt[]) {
  return distinctToday(history);
}

export function latestByQuestion(history: Attempt[]) {
  const map = new Map<string, Attempt>();
  for (const h of history) map.set(h.qid, h);
  return map;
}

export function toggleBookmark(id: string) {
  const has = memory.bookmarks.includes(id);
  emit({
    ...memory,
    bookmarks: has ? memory.bookmarks.filter((b) => b !== id) : [...memory.bookmarks, id],
  });
}

export function saveNote(topicId: string, text: string) {
  emit({ ...memory, notes: { ...memory.notes, [topicId]: text.slice(0, 800) } });
}

const GATE_RANKS: { min: number; id: RankId; color: string }[] = [
  { min: 100, id: "S", color: "#ff4d6d" },
  { min: 75, id: "A", color: "#ff9f45" },
  { min: 50, id: "B", color: "#a97bff" },
  { min: 25, id: "C", color: "#3b9dff" },
  { min: 1, id: "D", color: "#46d98a" },
  { min: 0, id: "E", color: "#8ea0b8" },
];

export type Gate = {
  subject: SubjectId;
  total: number;
  drilled: number;
  pct: number;
  rank: RankId;
  color: string;
  clearedAll: boolean;
};

export function gateSummary(p: Progress): Gate[] {
  return (Object.keys(subjectStats(p.history)) as SubjectId[]).map((subject) => {
    const topics = chapters.filter((c) => c.subject === subject).flatMap((c) => c.topics);
    const drilled = topics.filter((t) => (p.topicSeen[t.id] ?? 0) > 0).length;
    const pct = topics.length ? Math.round((drilled / topics.length) * 100) : 0;
    const rank = GATE_RANKS.find((r) => pct >= r.min) ?? GATE_RANKS[GATE_RANKS.length - 1];
    return { subject, total: topics.length, drilled, pct, rank: rank.id, color: rank.color, clearedAll: pct >= 100 };
  });
}

export function titles(p: Progress) {
  const graded = p.history.filter((h) => h.picked != null);
  const right = graded.filter((h) => h.correct).length;
  const level = levelInfo(p.totalXp).level;
  const gates = gateSummary(p);
  return [
    { id: "awakened", title: "Awakened", on: graded.length > 0, desc: "Answer your first question." },
    { id: "hunter", title: "Hunter", on: level >= 5, desc: "Reach D-rank (level 5)." },
    { id: "marksman", title: "Sharpshooter", on: right >= 20, desc: "20 correct answers." },
    { id: "disciple", title: "Daily Disciple", on: p.questDays.length >= 3, desc: "Clear the daily quest 3×." },
    { id: "gate", title: "Gate Crasher", on: gates.some((g) => g.clearedAll), desc: "Drill every topic in one subject." },
    { id: "monarch", title: "Shadow Monarch", on: level >= 40, desc: "Reach S-rank (level 40)." },
  ];
}

export { STAT_ORDER };
