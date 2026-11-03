import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      {/* Studio illustration: a spotlight on a stand, a film clapper and a cut-off set */}
      <svg viewBox="0 0 320 220" className="mb-8 w-full max-w-sm" role="img" aria-label="Empty studio with a spotlight">
        <ellipse cx="160" cy="200" rx="130" ry="12" className="fill-base-300" />
        <polygon points="120,60 200,60 250,196 70,196" className="fill-primary/20" />
        <rect x="150" y="110" width="20" height="86" rx="4" className="fill-neutral" />
        <rect x="126" y="192" width="68" height="8" rx="4" className="fill-neutral" />
        <g transform="rotate(-18 160 60)">
          <rect x="128" y="30" width="64" height="40" rx="10" className="fill-neutral" />
          <circle cx="160" cy="50" r="13" className="fill-primary" />
        </g>
        <g transform="translate(228 138) rotate(-8)">
          <rect x="0" y="12" width="56" height="38" rx="4" className="fill-base-content" />
          <rect x="0" y="0" width="56" height="14" rx="3" className="fill-primary" />
          <text x="28" y="38" textAnchor="middle" className="fill-base-100" fontSize="16" fontWeight="800">
            404
          </text>
        </g>
        <circle cx="58" cy="52" r="3" className="fill-primary" />
        <circle cx="270" cy="44" r="2.5" className="fill-primary" />
        <circle cx="40" cy="110" r="2" className="fill-secondary" />
      </svg>
      <h1 className="section-title mb-3">Cut! This scene is not on our set</h1>
      <p className="section-subtitle mb-8">
        The page you are looking for has moved, been deleted or never existed. Let us get you back to the studio.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </section>
  );
}
