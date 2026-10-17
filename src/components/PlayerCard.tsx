import { Flame } from "lucide-react";
import { levelInfo, rankFor } from "@/lib/jee/system";
import { useProgress } from "@/lib/jee/store";
import { RankBadge, XpBar } from "./Hud";

export function PlayerCard() {
  const { progress, ready } = useProgress();
  const info = levelInfo(progress.totalXp);
  const rank = rankFor(info.level);

  return (
    <div className="sys-window p-3.5">
      <span className="sys-corner tl" />
      <span className="sys-corner tr" />
      <span className="sys-corner bl" />
      <span className="sys-corner br" />
      <div className="flex items-center gap-3">
        <div className="relative grid place-items-center">
          <RankBadge id={String(info.level)} color={rank.color} size={52} />
          <span className="absolute -bottom-1 text-[0.5rem] uppercase tracking-widest text-muted">
            lv
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: rank.color }}>
            {rank.label}
          </p>
          <p className="truncate text-lg font-semibold leading-tight">{ready ? progress.name : "..."}</p>
          <p className="flex items-center gap-1 text-xs text-muted">
            <Flame className="size-3.5 text-danger" />
            {progress.streak}-day streak
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          <span>XP</span>
          <span>
            {info.into} / {info.need}
          </span>
        </div>
        <XpBar into={info.into} need={info.need} />
      </div>

      {progress.statPoints > 0 && (
        <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-gold glow-text">
          {progress.statPoints} stat point{progress.statPoints > 1 ? "s" : ""} to spend
        </p>
      )}
    </div>
  );
}
