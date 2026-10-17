export function RankBadge({
  id,
  color,
  size = 44,
}: {
  id: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="rank-hex shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        color: "#04060d",
        fontSize: size * 0.44,
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
      aria-hidden
    >
      {id}
    </span>
  );
}

export function XpBar({
  into,
  need,
  gold = false,
}: {
  into: number;
  need: number;
  gold?: boolean;
}) {
  const pct = need > 0 ? Math.min(100, (into / need) * 100) : 0;
  return (
    <div className="xp-track rounded-full">
      <div className={"xp-fill rounded-full" + (gold ? " gold" : "")} style={{ width: `${pct}%` }} />
    </div>
  );
}
