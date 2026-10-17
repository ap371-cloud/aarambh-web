export type StatId = "intelligence" | "focus" | "memory" | "speed" | "discipline";

export const STAT_ORDER: StatId[] = ["intelligence", "focus", "memory", "speed", "discipline"];

export const STATS: Record<StatId, { label: string; short: string; desc: string }> = {
  intelligence: { label: "Intelligence", short: "INT", desc: "Raw problem-solving. Feeds accuracy." },
  focus: { label: "Focus", short: "FOC", desc: "Long sittings without drift." },
  memory: { label: "Memory", short: "MEM", desc: "Forms and facts that stay put." },
  speed: { label: "Speed", short: "SPD", desc: "Pace under a ticking clock." },
  discipline: { label: "Discipline", short: "DIS", desc: "Showing up on the dull days." },
};

export const STAT_POINTS_PER_LEVEL = 3;

export type RankId = "E" | "D" | "C" | "B" | "A" | "S" | "N";

export const RANKS: { id: RankId; label: string; min: number; color: string }[] = [
  { id: "E", label: "E-RANK", min: 1, color: "#8ea0b8" },
  { id: "D", label: "D-RANK", min: 5, color: "#46d98a" },
  { id: "C", label: "C-RANK", min: 10, color: "#3b9dff" },
  { id: "B", label: "B-RANK", min: 18, color: "#a97bff" },
  { id: "A", label: "A-RANK", min: 28, color: "#ff9f45" },
  { id: "S", label: "S-RANK", min: 40, color: "#ff4d6d" },
  { id: "N", label: "NATIONAL", min: 60, color: "#ffd24a" },
];

const RANK_INDEX = new Map(RANKS.map((r, i) => [r.id, i]));

export function rankFor(level: number) {
  let current = RANKS[0];
  for (const r of RANKS) if (level >= r.min) current = r;
  return current;
}

export function isHigherRank(a: RankId, b: RankId) {
  return (RANK_INDEX.get(a) ?? 0) > (RANK_INDEX.get(b) ?? 0);
}

export function xpToNext(level: number) {
  return 100 + (level - 1) * 40;
}

export function levelInfo(totalXp: number) {
  let level = 1;
  let floor = 0;
  let need = xpToNext(level);
  while (totalXp >= floor + need) {
    floor += need;
    level += 1;
    need = xpToNext(level);
  }
  return { level, into: totalXp - floor, need, floor };
}

export const XP_CORRECT = 10;
export const XP_ATTEMPT = 2;
export const XP_LESSON = 5;
export const XP_DAILY_QUEST = 60;

export const DAILY_TARGET = 5;

export type NoteKind = "info" | "gold" | "danger" | "good";

export type SystemNote = {
  id: number;
  kind: NoteKind;
  title: string;
  body?: string;
};

export const STAT_LABELS: Record<StatId, string> = {
  intelligence: "INT",
  focus: "FOC",
  memory: "MEM",
  speed: "SPD",
  discipline: "DIS",
};
