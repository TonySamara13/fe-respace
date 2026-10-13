type BalanceRow = {
  label: string;
  value: string;
  accent?: boolean;
};

type BalanceRowsProps = {
  rows: BalanceRow[];
};

export function BalanceRows({ rows }: BalanceRowsProps) {
  return (
    <div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between border-b border-line py-3 text-small"
        >
          <span className="text-ink-secondary">{row.label}</span>
          <span className={row.accent ? "font-medium text-accent tabular-nums" : "tabular-nums"}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
