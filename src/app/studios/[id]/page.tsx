"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, MapPin, Pencil, Star, Users } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Review, Studio } from "@/lib/types";

interface Loaded {
  key: string;
  studio: Studio | null;
  reviews: Review[];
  error: string;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? "fill-primary text-primary" : "text-base-content/25"} />
      ))}
    </span>
  );
}

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const [data, setData] = useState<Loaded | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const key = `${id}:${version}`;
  useEffect(() => {
    let cancelled = false;
    Promise.all([api<Studio>(`/api/studios/${id}`), api<Review[]>(`/api/studios/${id}/reviews`).catch(() => [] as Review[])])
      .then(([studio, reviews]) => !cancelled && setData({ key, studio, reviews, error: "" }))
      .catch((e: Error) => !cancelled && setData({ key, studio: null, reviews: [], error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [id, key]);

  const loading = data?.key !== key;
  const studio = data?.studio ?? null;
  const reviews = data?.reviews ?? [];

  function handleBook() {
    if (!user) {
      toast.info("Please log in to book a studio");
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setBookingOpen(true);
  }

  async function handleReview(e: React.SyntheticEvent) {
    e.preventDefault();
    setPosting(true);
    try {
      await api(`/api/studios/${id}/reviews`, { method: "POST", body: JSON.stringify({ rating, comment }) });
      toast.success("Thanks! Your review is live.");
      setComment("");
      setVersion((v) => v + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post your review");
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <div className="skeleton h-96 w-full" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-24 w-full" />
        </div>
        <div className="skeleton h-80 w-full" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="section-title mb-3">Studio not found</h1>
        <p className="section-subtitle mb-6">{data?.error || "This studio may have been removed by its host."}</p>
        <Link href="/studios" className="btn btn-primary">
          Browse studios
        </Link>
      </div>
    );
  }

  const isOwner = user?.email === studio.ownerEmail;
  const gallery = [studio.imageUrl, `https://picsum.photos/seed/${studio._id}-b/1200/800`, `https://picsum.photos/seed/${studio._id}-c/1200/800`];
  const alreadyReviewed = reviews.some((r) => r.userEmail === user?.email);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Gallery */}
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="h-72 w-full overflow-hidden rounded-box sm:h-[26rem]">
            {gallery.map((src, i) => (
              <SwiperSlide key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${studio.title}, photo ${i + 1}`} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-primary font-semibold">{studio.category}</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Star size={16} className="fill-primary text-primary" />
                {studio.rating ? studio.rating.toFixed(1) : "New"}
                <span className="font-normal text-base-content/60">({studio.reviewCount} reviews)</span>
              </span>
            </div>
            <h1 className="section-title">{studio.title}</h1>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base-content/70">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" /> {studio.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} className="text-primary" /> Up to {studio.capacity} people
              </span>
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-extrabold">About this space</h2>
            <p className="whitespace-pre-line leading-relaxed text-base-content/80">{studio.overview}</p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-extrabold">Amenities</h2>
            {studio.amenities.length === 0 ? (
              <p className="text-sm text-base-content/60">The host has not listed any amenities yet.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <Check size={16} className="text-success" /> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="mb-4 text-xl font-extrabold">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="rounded-box border border-dashed border-base-300 p-6 text-sm text-base-content/70">No reviews yet. Be the first to share how your session went.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r._id} className="rounded-box border border-base-300 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {r.userPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.userPhoto} alt={r.userName} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-bold text-primary-content">{r.userName.charAt(0).toUpperCase()}</span>
                        )}
                        <div>
                          <p className="text-sm font-bold">{r.userName}</p>
                          <p className="text-xs text-base-content/60">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} />
                    </div>
                    <p className="text-sm leading-relaxed text-base-content/80">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            {user && !isOwner && !alreadyReviewed && (
              <form onSubmit={handleReview} className="mt-6 space-y-3 rounded-box border border-base-300 bg-base-200 p-4">
                <p className="font-bold">Leave a review</p>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} aria-pressed={rating === n}>
                      <Star size={26} className={n <= rating ? "fill-primary text-primary" : "text-base-content/30"} />
                    </button>
                  ))}
                </div>
                <textarea className="textarea w-full" rows={3} placeholder="What stood out about this studio?" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="btn btn-primary btn-sm" disabled={posting}>
                  {posting && <span className="loading loading-spinner loading-xs" />}
                  Post review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
            <p>
              <span className="text-4xl font-extrabold text-primary">${studio.hourlyRate}</span>
              <span className="text-base-content/60"> / hour</span>
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-base-content/70">Refundable deposit</span>
                <span className="font-semibold">${studio.securityDeposit}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-base-content/70">Capacity</span>
                <span className="font-semibold">{studio.capacity} people</span>
              </li>
            </ul>
            {isOwner ? (
              <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline w-full">
                <Pencil size={16} /> Edit your listing
              </Link>
            ) : (
              <button className="btn btn-primary w-full" onClick={handleBook}>
                Book Workspace Now
              </button>
            )}

            <div className="flex items-center gap-3 border-t border-base-300 pt-5">
              {studio.ownerPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={studio.ownerPhoto} alt={studio.ownerName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-bold text-primary-content">{studio.ownerName.charAt(0).toUpperCase()}</span>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-base-content/60">Hosted by</p>
                <p className="font-bold">{studio.ownerName}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
