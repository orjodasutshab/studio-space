import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";

const ITEMS = [
  { name: "Photo Studio", icon: Camera, text: "Cyc walls, lofts and lit sets" },
  { name: "Film Stage", icon: Clapperboard, text: "Soundproof stages and grids" },
  { name: "Podcast Lounge", icon: Mic, text: "Treated rooms with pro mics" },
  { name: "Music Suite", icon: Music, text: "Booths, live rooms and monitors" },
  { name: "Workshop", icon: Palette, text: "Art, craft and class spaces" },
];

export default function Categories() {
  return (
    <section className="bg-base-200 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="section-title">Browse by studio category</h2>
          <p className="section-subtitle mx-auto">Pick the kind of space you need and see what is open near you.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map(({ name, icon: Icon, text }) => (
            <Link
              key={name}
              href={`/studios?category=${encodeURIComponent(name)}`}
              className="group flex h-full flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                <Icon size={26} />
              </span>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-base-content/70">{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
