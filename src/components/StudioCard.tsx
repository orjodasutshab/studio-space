import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Studio } from "@/lib/types";

// Every card has the same height: fixed image box, title clamped to 2 lines, button pinned to the bottom.
export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.imageUrl}
          alt={studio.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="badge badge-primary absolute left-3 top-3 font-semibold">{studio.category}</span>
        <span className="badge absolute right-3 top-3 gap-1 border-0 bg-base-100/90 font-semibold">
          <Star size={12} className="fill-primary text-primary" />
          {studio.rating ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          <MapPin size={15} className="shrink-0 text-primary" />
          <span className="truncate">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p>
            <span className="text-2xl font-extrabold text-primary">${studio.hourlyRate}</span>
            <span className="text-sm text-base-content/60"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
