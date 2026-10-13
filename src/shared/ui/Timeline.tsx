import { cn } from "@/shared/lib/cn";

type TimelineItem = {
  title: string;
  text: string;
};

type TimelineProps = {
  items: TimelineItem[];
  current?: number;
};

export function Timeline({ items, current = 0 }: TimelineProps) {
  return (
    <ol className="space-y-4 border-l border-line-strong pl-4">
      {items.map((item, index) => (
        <li key={item.title} className="relative">
          <span
            className={cn(
              "absolute top-1 -left-[21px] size-[9px] rounded-full border border-accent",
              index === current ? "bg-accent" : "bg-canvas",
            )}
            aria-hidden
          />
          <p className="text-small font-medium text-ink">{item.title}</p>
          <p className="text-caption text-ink-secondary">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
