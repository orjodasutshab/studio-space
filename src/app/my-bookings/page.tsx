"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import PrivateRoute from "@/components/PrivateRoute";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/lib/types";

type Tab = "mine" | "requests";

function BookingCard({ b, children, showGuest }: { b: Booking; children?: React.ReactNode; showGuest?: boolean }) {
  return (
    <article className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:flex-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.studioImage} alt="" className="h-32 w-full rounded-lg object-cover sm:w-48" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link href={`/studios/${b.studioId}`} className="text-lg font-bold hover:text-primary">
            {b.studioTitle}
          </Link>
          <StatusBadge status={b.status} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          <MapPin size={14} className="text-primary" /> {b.studioLocation}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <CalendarCheck size={14} className="text-primary" /> {b.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" /> {b.startTime} to {b.endTime} ({b.hours} hr)
          </span>
        </p>
        {showGuest && <p className="text-sm text-base-content/70">Requested by {b.userName} ({b.userEmail})</p>}
        {b.note && <p className="text-sm italic text-base-content/70">&ldquo;{b.note}&rdquo;</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-sm text-base-content/70">
            Total <span className="text-lg font-extrabold text-primary">${b.totalCost.toFixed(2)}</span> incl. deposit
          </p>
          <div className="flex gap-2">{children}</div>
        </div>
      </div>
    </article>
  );
}

function BookingsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "requests" ? "requests" : "mine";

  const [mine, setMine] = useState<Booking[] | null>(null);
  const [requests, setRequests] = useState<Booking[] | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Booking[]>("/api/my-bookings").then(setMine).catch(() => setMine([]));
    api<Booking[]>("/api/host-bookings").then(setRequests).catch(() => setRequests([]));
  }, []);

  const patch = (setter: typeof setMine, id: string, status: BookingStatus) =>
    setter((list) => (list ?? []).map((b) => (b._id === id ? { ...b, status } : b)));

  async function cancelMine() {
    if (!toCancel) return;
    setBusy(true);
    try {
      await api(`/api/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      patch(setMine, toCancel._id, "Cancelled");
      toast.success("Booking cancelled");
      setToCancel(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel this booking");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(b: Booking, status: BookingStatus) {
    try {
      await api(`/api/bookings/${b._id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      patch(setRequests, b._id, status);
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this booking");
    }
  }

  const list = tab === "mine" ? mine : requests;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mb-8 space-y-3">
        <h1 className="section-title">Bookings</h1>
        <p className="section-subtitle">Track the studios you booked and manage requests for the spaces you host.</p>
      </div>

      <div role="tablist" className="tabs tabs-border mb-6">
        <button role="tab" className={`tab ${tab === "mine" ? "tab-active font-bold" : ""}`} onClick={() => router.replace("/my-bookings")}>
          My bookings {mine ? `(${mine.length})` : ""}
        </button>
        <button role="tab" className={`tab ${tab === "requests" ? "tab-active font-bold" : ""}`} onClick={() => router.replace("/my-bookings?tab=requests")}>
          Requests for my studios {requests ? `(${requests.length})` : ""}
        </button>
      </div>

      {list === null && (
        <div className="space-y-4">
          <div className="skeleton h-36 w-full" />
          <div className="skeleton h-36 w-full" />
        </div>
      )}

      {list && list.length === 0 && (
        <div className="mx-auto max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
          <CalendarCheck className="mx-auto mb-3 text-primary" size={36} />
          <h2 className="mb-1 text-lg font-bold">{tab === "mine" ? "No bookings yet" : "No requests yet"}</h2>
          <p className="mb-4 text-sm text-base-content/70">
            {tab === "mine" ? "Find a studio you love and book your first session." : "When creators book your studios, their requests will show up here."}
          </p>
          <Link href={tab === "mine" ? "/studios" : "/add-studio"} className="btn btn-primary btn-sm">
            {tab === "mine" ? "Explore Studios" : "Add New Studio"}
          </Link>
        </div>
      )}

      {list && list.length > 0 && (
        <div className="space-y-4">
          {tab === "mine" &&
            list.map((b) => (
              <BookingCard key={b._id} b={b}>
                {b.status === "Pending" && (
                  <button className="btn btn-sm btn-error btn-outline" onClick={() => setToCancel(b)}>
                    Cancel Booking
                  </button>
                )}
              </BookingCard>
            ))}

          {tab === "requests" &&
            list.map((b) => (
              <BookingCard key={b._id} b={b} showGuest>
                {b.status === "Pending" && (
                  <button className="btn btn-sm btn-success" onClick={() => setStatus(b, "Confirmed")}>
                    Confirm
                  </button>
                )}
                {b.status === "Confirmed" && (
                  <button className="btn btn-sm btn-info" onClick={() => setStatus(b, "Completed")}>
                    Mark completed
                  </button>
                )}
                {(b.status === "Pending" || b.status === "Confirmed") && (
                  <button className="btn btn-sm btn-error btn-outline" onClick={() => setStatus(b, "Cancelled")}>
                    Decline
                  </button>
                )}
              </BookingCard>
            ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(toCancel)}
        title="Cancel this booking?"
        message={`Your pending request for "${toCancel?.studioTitle ?? ""}" on ${toCancel?.date ?? ""} will be cancelled.`}
        confirmText="Yes, cancel it"
        busy={busy}
        onConfirm={cancelMine}
        onCancel={() => setToCancel(null)}
      />
    </section>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-14"><div className="skeleton h-64 w-full" /></div>}>
        <BookingsContent />
      </Suspense>
    </PrivateRoute>
  );
}
