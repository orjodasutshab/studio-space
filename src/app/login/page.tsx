"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Only allow redirects to pages inside this website.
const safePath = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back to StudioSpace!");
      router.replace(safePath(params.get("redirect")));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-8 shadow-xl">
      <h1 className="section-title mb-2">Log in to StudioSpace</h1>
      <p className="mb-6 text-sm text-base-content/70">Book spaces, manage your listings and track every booking.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <label className="form-control block">
          <span className="mb-1 block text-sm font-semibold">Email</span>
          <input
            type="email"
            className="input w-full"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="form-control block">
          <span className="mb-1 block text-sm font-semibold">Password</span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input w-full pr-11"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="text-right">
          <button
            type="button"
            className="text-sm font-semibold text-primary hover:underline"
            onClick={() => toast.info("Password reset is coming soon. Use the demo account below to explore.")}
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? <span className="loading loading-spinner loading-sm" /> : <LogIn size={18} />}
          Login
        </button>

        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => {
            setEmail("examiner@studiospace.com");
            setPassword("Studio123");
            toast.info("Demo account filled in. Press Login.");
          }}
        >
          Use demo account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to StudioSpace?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 py-14">
      <Suspense fallback={<div className="skeleton h-96 w-full max-w-md" />}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
