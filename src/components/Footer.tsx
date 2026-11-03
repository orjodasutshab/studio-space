"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/types";

// The new X logo (not the old Twitter bird)
function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/add-studio", label: "Host Your Space" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You are subscribed. Watch your inbox for new studios!");
    setEmail("");
  }

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-base-content/70">
            StudioSpace connects creators with beautiful, fully equipped spaces. Our mission is to make
            every great idea easy to shoot, record and build, one booked hour at a time.
          </p>
          <div className="flex gap-2">
            {[
              { label: "X", icon: <XLogo /> },
              { label: "Instagram", icon: <Instagram size={18} /> },
              { label: "YouTube", icon: <Youtube size={18} /> },
              { label: "LinkedIn", icon: <Linkedin size={18} /> },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="btn btn-circle btn-sm btn-outline border-base-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Popular Categories</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/studios?category=${encodeURIComponent(c)}`} className="hover:text-primary">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Studio news, once a month</h3>
          <form onSubmit={handleSubscribe} className="join w-full">
            <label className="input join-item flex w-full items-center gap-2">
              <Mail size={16} className="opacity-60" />
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </label>
            <button type="submit" className="btn btn-primary join-item">
              Join
            </button>
          </form>
          <p className="mt-3 text-xs text-base-content/60">New spaces, host tips and member offers. No spam.</p>
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-base-content/60 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
