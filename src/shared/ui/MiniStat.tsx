type MiniStatProps = {
  value: string;
  label: string;
};

export function MiniStat({ value, label }: MiniStatProps) {
  return (
    <div>
      <p className="font-display text-stat font-semibold lining-nums text-ink">{value}</p>
      <p className="mt-1 text-label text-ink-tertiary">{label}</p>
    </div>
  );
}
