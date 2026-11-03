"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Search, SearchX } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import StudioCard from "@/components/StudioCard";
import { api } from "@/lib/api";
import { CATEGORIES, type Studio } from "@/lib/types";

interface Result {
  key: string;
  studios: Studio[];
  error: string;
}

function Explore() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  // Wait until the visitor stops typing before asking the server.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (debounced) query.set("q", debounced);
  if (maxPrice) query.set("maxPrice", maxPrice);
  query.set("sort", sort);
  const key = query.toString();

  useEffect(() => {
    let cancelled = false;
    api<Studio[]>(`/api/studios?${key}`)
      .then((studios) => !cancelled && setResult({ key, studios, error: "" }))
      .catch((e: Error) => !cancelled && setResult({ key, studios: [], error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [key]);

  const loading = result?.key !== key;
  const studios = result?.studios ?? [];

  function setCategory(value: string) {
    router.replace(value ? `/studios?category=${encodeURIComponent(value)}` : "/studios");
  }

  function clearFilters() {
    setSearch("");
    setMaxPrice("");
    setSort("newest");
    setCategory("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="section-title">Explore studios</h1>
        <p className="section-subtitle">Search by name or place, pick a category and find the right space for your next project.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 rounded-box border border-base-300 bg-base-100 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="input w-full">
          <Search size={16} className="opacity-60" />
          <input type="search" placeholder="Search by studio or location" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search studios" />
        </label>
        <select className="select" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Maximum price">
          <option value="">Any price</option>
          <option value="30">Up to $30 / hr</option>
          <option value="60">Up to $60 / hr</option>
          <option value="100">Up to $100 / hr</option>
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort studios">
          <option value="newest">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["", ...CATEGORIES].map((c) => (
          <button
            key={c || "all"}
            onClick={() => setCategory(c)}
            className={`btn btn-sm ${category === c ? "btn-primary" : "btn-outline border-base-300"}`}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {!loading && !result?.error && (
        <p className="mb-4 text-sm text-base-content/70">
          {studios.length} {studios.length === 1 ? "studio" : "studios"} found
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        {!loading && studios.map((s) => <StudioCard key={s._id} studio={s} />)}
      </div>

      {!loading && studios.length === 0 && (
        <div className="mx-auto mt-4 max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
          <SearchX className="mx-auto mb-3 text-primary" size={36} />
          <h2 className="mb-1 text-lg font-bold">{result?.error ? "We could not load studios" : "No studios match your search"}</h2>
          <p className="mb-4 text-sm text-base-content/70">
            {result?.error || "Try a different word, a wider price range or another category."}
          </p>
          <div className="flex justify-center gap-2">
            <button onClick={clearFilters} className="btn btn-primary btn-sm">
              Clear filters
            </button>
            <Link href="/add-studio" className="btn btn-outline btn-sm">
              Host Your Space
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-14"><div className="skeleton h-64 w-full" /></div>}>
      <Explore />
    </Suspense>
  );
}
