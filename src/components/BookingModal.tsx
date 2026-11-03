"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import { api } from "@/lib/api";
import type { Studio } from "@/lib/types";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Today's date in the visitor's own time zone (YYYY-MM-DD)
const localToday = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function BookingModal({ studio, open, onClose }: { studio: Studio; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const hours = startTime && endTime && toMinutes(endTime) > toMinutes(startTime) ? (toMinutes(endTime) - toMinutes(startTime)) / 60 : 0;
  const subtotal = hours * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    if (!date) return setError("Please choose a date");
    if (hours <= 0) return setError("The end time must be after the start time");
    setBusy(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ studioId: studio._id, date, startTime, endTime, note }),
      });
      toast.success("Booking request sent! Your host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not book this studio";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="Book this workspace" onClose={busy ? () => {} : onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <p className="text-sm text-base-content/70">
          <span className="font-bold text-base-content">{studio.title}</span> &middot; ${studio.hourlyRate} / hr
        </p>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Date</span>
          <input type="date" className="input w-full" min={localToday()} value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Start time</span>
            <input type="time" className="input w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">End time</span>
            <input type="time" className="input w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Note for the host (optional)</span>
          <textarea className="textarea w-full" rows={2} maxLength={500} placeholder="What are you planning to create?" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <div className="space-y-1 rounded-box bg-base-200 p-4 text-sm">
          <div className="flex justify-between">
            <span>{hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"} x $${studio.hourlyRate}` : "Studio time"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Refundable security deposit</span>
            <span>${studio.securityDeposit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-base-300 pt-2 text-base font-extrabold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            Confirm booking
          </button>
        </div>
      </form>
    </Modal>
  );
}
