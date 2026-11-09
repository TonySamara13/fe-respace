import { cn } from "@/shared/lib/cn";

type ChipProps = {
  selected?: boolean;
  children: string;
  onClick: () => void;
};

export function Chip({ selected = false, children, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-full px-4 py-2 text-small transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
        selected ? "bg-accent text-night" : "bg-muted text-ink hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
