import type { OptionId } from "@/lib/jee/types";

const OPTIONS: OptionId[] = ["A", "B", "C", "D"];

type Props = {
  options: Record<OptionId, string>;
  answer: OptionId;
  picked: OptionId | null;
  revealed: boolean;
  disabled?: boolean;
  className?: string;
  onPick: (id: OptionId) => void;
};

export function OptionList({
  options,
  answer,
  picked,
  revealed,
  disabled,
  className = "mt-4 grid gap-2",
  onPick,
}: Props) {
  return (
    <ul className={className}>
      {OPTIONS.map((id) => {
        const correct = id === answer;
        const isPick = picked === id;
        let tone = "bg-panel ring-edge hover:ring-glow";
        if (revealed && correct) tone = "bg-good/10 ring-good text-good";
        else if (revealed && isPick && !correct) tone = "bg-danger/10 ring-danger text-danger";
        else if (isPick) tone = "bg-panel-2 ring-glow";
        return (
          <li key={id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(id)}
              className={
                "flex min-h-12 w-full items-start gap-3 rounded-xl px-4 py-3 text-left ring-1 transition " +
                tone
              }
            >
              <span className="font-mono font-medium">{id}</span>
              <span>{options[id]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
