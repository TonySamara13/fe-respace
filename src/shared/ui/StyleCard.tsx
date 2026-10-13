import { cn } from "@/shared/lib/cn";

type StyleCardProps = {
  title: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
};

export function StyleCard({ title, description, selected = false, onClick }: StyleCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-surface p-4 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
        selected ? "border-2 border-accent" : "border-line hover:border-line-strong",
      )}
    >
      <span className="block text-body font-medium text-ink">{title}</span>
      <span className="mt-1 block text-caption text-ink-secondary">{description}</span>
    </button>
  );
}
