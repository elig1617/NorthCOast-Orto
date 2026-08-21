import Link from "next/link";

type LogoProps = {
  invert?: boolean;
  compact?: boolean;
};

export function Logo({ invert = false, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="group inline-flex flex-col justify-center no-underline"
      aria-label="Northcoast Orthopedic Sales home"
    >
      <span
        className={`font-sans text-[1.7rem] font-semibold leading-none tracking-[0.08em] ${
          invert ? "text-[#e24b3d]" : "text-red"
        }`}
      >
        NCOS
      </span>
      {!compact ? (
        <span
          className={`mt-1 text-[0.58rem] font-semibold tracking-[0.16em] uppercase ${
            invert ? "text-white/90" : "text-ink"
          }`}
        >
          Northcoast Orthopedic Sales
        </span>
      ) : null}
    </Link>
  );
}
