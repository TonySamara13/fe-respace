type PolaroidProps = {
  src: string;
  tag: string;
  caption: string;
  rotate?: "left" | "right";
};

export function Polaroid({ src, tag, caption, rotate = "left" }: PolaroidProps) {
  return (
    <figure
      className={`hidden w-40 bg-surface p-2.5 pb-3.5 shadow-card lg:block ${rotate === "left" ? "-rotate-2" : "rotate-3"} rounded-md`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
      <figcaption className="mt-2">
        <span className="text-micro tracking-wide text-accent uppercase">{tag}</span>
        <span className="mt-0.5 block text-label text-ink-secondary">{caption}</span>
      </figcaption>
    </figure>
  );
}
