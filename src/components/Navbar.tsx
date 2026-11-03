"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Sun,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  async function handleLogout() {
    try {
      await logout();
      toast.success("You have been logged out");
      setOpen(false);
      router.push("/");
    } catch {
      toast.error("Could not log out. Please try again");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-base-content/80"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label={theme === "studiolight" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "studiolight" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {loading ? (
            <div className="skeleton h-9 w-9 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" aria-label="Account menu">
                <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoUrl} alt={user.name} />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-primary text-primary-content font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 mt-2 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title px-3 py-2">
                  <span className="block text-base font-bold text-base-content">{user.name}</span>
                  <span className="block text-xs font-normal">{user.email}</span>
                </li>
                {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href}>
                      <Icon size={16} /> {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          <button
            className="btn btn-ghost btn-circle btn-sm lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 font-semibold ${
                  isActive(link.href) ? "bg-primary/15 text-primary" : "hover:bg-base-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && !loading && (
              <div className="mt-2 flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1">
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary btn-sm flex-1">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
