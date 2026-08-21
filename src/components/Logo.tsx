import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  invert?: boolean;
  compact?: boolean;
};

export function Logo({ invert = false, compact = false }: LogoProps) {
  if (invert) {
    return (
      <Link
        href="/"
        className="group inline-flex flex-col justify-center no-underline"
        aria-label="Northcoast Orthopedic Sales home"
      >
        <span className="font-sans text-[1.7rem] font-semibold leading-none tracking-[0.08em] text-[#e24b3d]">
          NCOS
        </span>
        {!compact ? (
          <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.16em] text-white/90 uppercase">
            Northcoast Orthopedic Sales
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Northcoast Orthopedic Sales home">
      <Image
        src="/brand/ncos-logo.png"
        alt="NCOS Northcoast Orthopedic Sales"
        width={compact ? 140 : 188}
        height={compact ? 62 : 83}
        className="h-10 w-auto md:h-12"
        priority
      />
    </Link>
  );
}
