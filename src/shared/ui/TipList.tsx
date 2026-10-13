type TipListProps = {
  items: string[];
};

export function TipList({ items }: TipListProps) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4 text-small text-ink-secondary">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-accent text-caption text-accent">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
