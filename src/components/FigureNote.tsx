export function FigureNote({
  caption,
  className = "",
  tall = false,
}: {
  caption: string;
  className?: string;
  tall?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden border border-line bg-[linear-gradient(165deg,#2a4039_0%,#1d322c_46%,#3a211d_100%)] ${
          tall ? "min-h-[22rem]" : "min-h-[16rem]"
        }`}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 400 260"
          preserveAspectRatio="none"
        >
          <path
            d="M20 220 C 80 120, 140 160, 200 90 S 320 40, 380 130"
            fill="none"
            stroke="#f3eee4"
            strokeWidth="0.6"
          />
          <path
            d="M0 80 H400 M0 140 H400 M80 0 V260"
            fill="none"
            stroke="#f3eee4"
            strokeWidth="0.35"
          />
        </svg>
        <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end p-5 text-[#f3eee4]">
          <p className="eyebrow !text-[#d7c7a6]">Photograph brief</p>
          <p className="mt-2 max-w-md font-serif text-lg leading-snug">
            Replace with commissioned product or clinical photography.
          </p>
        </div>
      </div>
      <figcaption className="mt-2 max-w-prose text-[0.8rem] leading-5 text-slate">
        {caption}
      </figcaption>
    </figure>
  );
}
