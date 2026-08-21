import Link from "next/link";

const regions = [
  { href: "/products/spine", label: "Spine & neck", x: 118, y: 28, w: 64, h: 22 },
  { href: "/products/shoulder", label: "Shoulder", x: 28, y: 62, w: 70, h: 22 },
  { href: "/products/elbow", label: "Elbow", x: 8, y: 118, w: 56, h: 22 },
  { href: "/products/wrist-hand", label: "Wrist & hand", x: 0, y: 176, w: 86, h: 22 },
  { href: "/products/hip", label: "Hip", x: 196, y: 150, w: 48, h: 22 },
  { href: "/products/knee", label: "Knee", x: 196, y: 214, w: 52, h: 22 },
  { href: "/products/foot-ankle", label: "Foot & ankle", x: 188, y: 286, w: 86, h: 22 },
];

export function BodyMap() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center">
      <div className="relative mx-auto w-full max-w-[280px]">
        <svg
          viewBox="0 0 280 340"
          role="img"
          aria-labelledby="body-map-title"
          className="h-auto w-full"
        >
          <title id="body-map-title">
            Orthopedic product regions: spine, shoulder, elbow, wrist, hip, knee, foot and ankle
          </title>
          <ellipse cx="140" cy="28" rx="18" ry="22" fill="none" stroke="#161310" strokeWidth="1.4" />
          <path
            d="M122 52 C120 70 118 92 128 118 L128 168 C110 176 104 210 110 250 L118 318"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <path
            d="M158 52 C160 70 162 92 152 118 L152 168 C170 176 176 210 170 250 L162 318"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <path
            d="M128 70 C90 78 62 100 48 138"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <path
            d="M152 70 C190 78 218 100 232 138"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <path
            d="M48 138 C36 168 28 196 22 228"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <path
            d="M232 138 C244 168 252 196 258 228"
            fill="none"
            stroke="#161310"
            strokeWidth="1.4"
          />
          <circle cx="140" cy="86" r="3" fill="#b42318" />
          <circle cx="140" cy="150" r="3" fill="#b42318" />
          <circle cx="118" cy="236" r="3" fill="#b42318" />
          <circle cx="162" cy="236" r="3" fill="#b42318" />
          {regions.map((region) => (
            <g key={region.href}>
              <rect
                x={region.x}
                y={region.y}
                width={region.w}
                height={region.h}
                rx="1"
                fill="#f3eee4"
                stroke="#b42318"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>
        <ul className="sr-only">
          {regions.map((region) => (
            <li key={region.href}>
              <Link href={region.href}>{region.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <nav aria-label="Product regions">
        <p className="eyebrow">Clinical map</p>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {regions.map((region, index) => (
            <li key={region.href}>
              <Link
                href={region.href}
                className="flex items-baseline justify-between gap-4 py-3 no-underline hover:text-red"
              >
                <span className="font-serif text-xl">
                  <span className="mr-3 font-mono text-xs text-slate">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {region.label}
                </span>
                <span aria-hidden="true" className="text-sm text-slate">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
