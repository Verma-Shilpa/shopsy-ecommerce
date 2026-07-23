import { AlertTriangle, RefreshCw, SearchX } from "lucide-react";

type StatusPanelProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "neutral" | "error" | "empty";
};

export function StatusPanel({
  title,
  message,
  actionLabel,
  onAction,
  tone = "neutral",
}: StatusPanelProps) {
  const Icon =
    tone === "empty" ? SearchX : tone === "error" ? AlertTriangle : RefreshCw;

  return (
    <section
      className={`status-panel status-panel--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <span className="status-icon">
        <Icon size={24} aria-hidden="true" />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {actionLabel && onAction ? (
        <button className="primary-button" type="button" onClick={onAction}>
          <RefreshCw size={17} aria-hidden="true" />
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
