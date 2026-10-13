type OrderProgressProps = {
  message: string;
  done: number;
  total: number;
};

export function OrderProgress({ message, done, total }: OrderProgressProps) {
  const width = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return (
    <div aria-live="polite">
      <p className="text-ink-secondary">{message}</p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full bg-accent" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-2 text-caption font-medium text-accent">
        {done} из {total}
      </p>
    </div>
  );
}
