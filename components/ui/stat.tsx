interface StatProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function Stat({ label, value, highlight }: StatProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-elevated/50 px-4 py-3">
      <span className="text-xs uppercase tracking-wider text-muted">
        {label}
      </span>
      <span
        className={`text-lg font-semibold tabular-nums ${
          highlight ? "text-success" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
