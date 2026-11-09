type TrustStripProps = {
  items: string[];
};

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-caption text-ink-tertiary">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-accent" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
