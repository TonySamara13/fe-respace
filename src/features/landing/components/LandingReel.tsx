import Image from "next/image";

import { REEL } from "../pins";

export function LandingReel() {
  return (
    <div id="ideas" className="flex gap-4 overflow-x-auto px-4 pb-6 lg:px-12">
      {REEL.map((pin) => (
        <figure key={pin.src} className="w-64 shrink-0 lg:w-72">
          <div className="relative h-40 lg:h-44">
            <Image src={pin.src} alt={pin.alt} fill className="rounded-2xl object-cover" sizes="288px" />
          </div>
          <figcaption className="text-small text-cream-dim mt-2">
            {pin.kicker} · {pin.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
