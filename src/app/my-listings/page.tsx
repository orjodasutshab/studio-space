"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import PrivateRoute from "@/components/PrivateRoute";
import { api } from "@/lib/api";
import type { Studio } from "@/lib/types";

function ListingsContent() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<Studio | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Studio[]>("/api/my-listings")
      .then(setStudios)
      .catch((e: Error) => {
        setError(e.message);
        setStudios([]);
      });
  }, []);

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api(`/api/studios/${toDelete._id}`, { method: "DELETE" });
      setStudios((list) => (list ?? []).filter((s) => s._id !== toDelete._id));
      toast.success("Studio deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this studio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="section-title">My studio listings</h1>
          <p className="section-subtitle">Update the details of your spaces or remove ones you no longer offer.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Studio
        </Link>
      </div>

      {studios === null && <div className="skeleton h-64 w-full" />}

      {studios && studios.length === 0 && (
        <div className="mx-auto max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
          <Building2 className="mx-auto mb-3 text-primary" size={36} />
          <h2 className="mb-1 text-lg font-bold">{error ? "We could not load your studios" : "You have not listed a studio yet"}</h2>
          <p className="mb-4 text-sm text-base-content/70">{error || "Add your first space and start welcoming creators."}</p>
          <Link href="/add-studio" className="btn btn-primary btn-sm">
            Add New Studio
          </Link>
        </div>
      )}

      {studios && studios.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex min-w-60 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.imageUrl} alt="" className="h-14 w-20 rounded-lg object-cover" />
                      <div>
                        <Link href={`/studios/${s._id}`} className="font-bold hover:text-primary">
                          {s.title}
                        </Link>
                        <p className="text-xs text-base-content/60">{s.location}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">{s.category}</span>
                  </td>
                  <td className="font-semibold">${s.hourlyRate} / hr</td>
                  <td>{s.rating ? s.rating.toFixed(1) : "New"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline">
                        <Pencil size={14} /> Update
                      </Link>
                      <button className="btn btn-sm btn-error btn-outline" onClick={() => setToDelete(s)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete this studio?"
        message={`"${toDelete?.title ?? ""}" will be removed from StudioSpace for good. This cannot be undone.`}
        confirmText="Yes, delete it"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <ListingsContent />
    </PrivateRoute>
  );
}
