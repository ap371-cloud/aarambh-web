import { dismissNote, useSystemNotes } from "@/lib/jee/store";

export function SystemNotifications() {
  const notes = useSystemNotes();
  if (!notes.length) return null;
  return (
    <div className="sys-notes" role="status" aria-live="polite">
      {notes.map((n) => (
        <button
          key={n.id}
          type="button"
          className={`sys-note ${n.kind === "info" ? "" : n.kind} block w-full text-left`}
          onClick={() => dismissNote(n.id)}
        >
          <p className="sys-note-title">! {n.title}</p>
          {n.body && <p className="mt-1 text-sm leading-snug text-ink/90">{n.body}</p>}
        </button>
      ))}
    </div>
  );
}
