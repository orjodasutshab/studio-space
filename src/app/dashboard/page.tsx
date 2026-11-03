"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, CalendarCheck, Clock, Inbox, PlusCircle } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Counts {
  listings: number;
  bookings: number;
  pending: number;
  requests: number;
}

function DashboardContent() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      api<unknown[]>("/api/my-listings"),
      api<{ status: string }[]>("/api/my-bookings"),
      api<unknown[]>("/api/host-bookings"),
    ])
      .then(([listings, bookings, requests]) =>
        setCounts({
          listings: listings.length,
          bookings: bookings.length,
          pending: bookings.filter((b) => b.status === "Pending").length,
          requests: requests.length,
        })
      )
      .catch(() => setCounts({ listings: 0, bookings: 0, pending: 0, requests: 0 }));
  }, []);

  const cards = [
    { label: "My studio listings", value: counts?.listings, icon: Building2, href: "/my-listings" },
    { label: "My bookings", value: counts?.bookings, icon: CalendarCheck, href: "/my-bookings" },
    { label: "Pending bookings", value: counts?.pending, icon: Clock, href: "/my-bookings" },
    { label: "Requests for my studios", value: counts?.requests, icon: Inbox, href: "/my-bookings?tab=requests" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="section-title">Welcome back, {user?.name.split(" ")[0]}</h1>
          <p className="section-subtitle">Here is a quick look at your studios and bookings.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Studio
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="flex h-full items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 transition hover:border-primary hover:shadow-lg">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon size={22} />
            </span>
            <div>
              {value === undefined ? <div className="skeleton h-8 w-10" /> : <p className="text-3xl font-extrabold">{value}</p>}
              <p className="text-sm text-base-content/70">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
