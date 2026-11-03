"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { StudioInput } from "@/lib/types";

function AddStudioContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleSubmit(data: StudioInput) {
    setBusy(true);
    try {
      await api("/api/studios", { method: "POST", body: JSON.stringify(data) });
      toast.success("Your studio is live!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your studio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mb-8 space-y-3">
        <h1 className="section-title">Add a new studio</h1>
        <p className="section-subtitle">Share your space with creators. Honest photos and clear details get booked faster.</p>
      </div>
      <StudioForm owner={{ name: user!.name, email: user!.email }} submitLabel="Publish studio" busy={busy} onSubmit={handleSubmit} />
    </section>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudioContent />
    </PrivateRoute>
  );
}
