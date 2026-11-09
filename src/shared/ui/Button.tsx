import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

import { Spinner } from "./Spinner";

const controlClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 py-2 text-body font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none disabled:pointer-events-none";

export const primaryLinkClass = `${controlClass} bg-accent text-night hover:bg-accent-hover`;

const buttonVariants = cva(controlClass,
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-night hover:bg-accent-hover disabled:bg-muted disabled:text-ink-tertiary",
        ghost:
          "border border-line-strong bg-transparent text-ink hover:bg-surface disabled:border-muted disabled:text-ink-tertiary",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      block: false,
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  block,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      <span className={cn("inline-flex items-center justify-center gap-2", loading && "opacity-80")}>
        {children}
      </span>
    </button>
  );
}
