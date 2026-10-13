type DecoProps = {
  variant?: "plant" | "lamp" | "arch";
  className?: string;
};

export function Deco({ variant = "plant", className }: DecoProps) {
  const paths = {
    plant: (
      <>
        <path d="M40 120h40l-6 34H46z" />
        <path d="M60 120V64" />
        <path d="M60 94C42 90 30 76 30 58c16 2 28 14 30 36z" />
        <path d="M60 80c16-6 26-20 26-38-16 4-26 18-26 38z" />
      </>
    ),
    lamp: (
      <>
        <path d="M50 0v74" />
        <path d="M20 116c0-24 13-42 30-42s30 18 30 42z" />
        <path d="M43 124a7 7 0 0 0 14 0" />
      </>
    ),
    arch: (
      <>
        <path d="M10 178V62a50 50 0 0 1 100 0v116z" />
        <path d="M60 12v166M10 112h100" />
      </>
    ),
  };

  return (
    <svg
      viewBox={variant === "lamp" ? "0 0 100 170" : variant === "arch" ? "0 0 120 180" : "0 0 120 160"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`pointer-events-none hidden text-accent opacity-40 lg:block ${className ?? ""}`}
    >
      {paths[variant]}
    </svg>
  );
}
