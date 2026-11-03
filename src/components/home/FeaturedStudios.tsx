"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import SkeletonCard from "../SkeletonCard";
import StudioCard from "../StudioCard";
import { api } from "@/lib/api";
import type { Studio } from "@/lib/types";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Studio[]>("/api/studios?limit=6&sort=rating")
      .then(setStudios)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h2 className="section-title">Featured studios</h2>
          <p className="section-subtitle">Top-rated spaces our creators love to book again and again.</p>
        </div>
        <Link href="/studios" className="btn btn-outline btn-primary">
          View all studios
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        {!loading && studios.map((s) => <StudioCard key={s._id} studio={s} />)}
      </div>

      {!loading && (error || studios.length === 0) && (
        <div className="mx-auto max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
          <SearchX className="mx-auto mb-3 text-primary" size={36} />
          <h3 className="mb-1 text-lg font-bold">{error ? "We could not load studios" : "No studios yet"}</h3>
          <p className="mb-4 text-sm text-base-content/70">
            {error || "Be the first to list a space and start earning."}
          </p>
          <Link href="/add-studio" className="btn btn-primary btn-sm">
            Host Your Space
          </Link>
        </div>
      )}
    </section>
  );
}
