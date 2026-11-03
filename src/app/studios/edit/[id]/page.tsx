"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Studio, StudioInput } from "@/lib/types";

function EditContent() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [loaded, setLoaded] = useState<{ id: string; studio: Studio | null; error: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<Studio>(`/api/studios/${id}`)
      .then((studio) => !cancelled && setLoaded({ id, studio, error: "" }))
      .catch((e: Error) => !cancelled && setLoaded({ id, studio: null, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(data: StudioInput) {
    setBusy(true);
    try {
      await api(`/api/studios/${id}`, { method: "PUT", body: JSON.stringify(data) });
      toast.success("Studio updated");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this studio");
    } finally {
      setBusy(false);
    }
  }

  if (loaded?.id !== id) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="skeleton h-[32rem] w-full" />
      </div>
    );
  }

  const studio = loaded.studio;
  if (!studio || studio.ownerEmail !== user?.email) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="section-title mb-3">{studio ? "This is not your studio" : "Studio not found"}</h1>
        <p className="section-subtitle mb-6">{studio ? "You can only edit studios that you host." : loaded.error}</p>
        <Link href="/my-listings" className="btn btn-primary">
          Back to my listings
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mb-8 space-y-3">
        <h1 className="section-title">Update your studio</h1>
        <p className="section-subtitle">Change anything below and save. Your host details stay the same.</p>
      </div>
      <StudioForm initial={studio} owner={{ name: studio.ownerName, email: studio.ownerEmail }} submitLabel="Save changes" busy={busy} onSubmit={handleSubmit} />
    </section>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditContent />
    </PrivateRoute>
  );
}
