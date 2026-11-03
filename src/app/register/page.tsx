"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Eye, EyeOff, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const rules = [
    { ok: /[A-Z]/.test(password), text: "One uppercase letter" },
    { ok: /[a-z]/.test(password), text: "One lowercase letter" },
    { ok: password.length >= 6, text: "At least 6 characters" },
  ];

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email");
      return;
    }
    const failed = rules.find((r) => !r.ok);
    if (failed) {
      const msg = `Password rule not met: ${failed.text.toLowerCase()}`;
      setError(msg);
      toast.error(msg);
      return;
    }
    setBusy(true);
    try {
      await register(name, email, photoUrl, password);
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid min-h-[70vh] place-items-center px-4 py-14">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-8 shadow-xl">
        <h1 className="section-title mb-2">Create your account</h1>
        <p className="mb-6 text-sm text-base-content/70">Join creators and hosts on StudioSpace.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Name</span>
            <input className="input w-full" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Email</span>
            <input type="email" className="input w-full" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Photo URL</span>
            <input type="url" className="input w-full" placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          </label>
          <div>
            <span className="mb-1 block text-sm font-semibold">Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="input w-full pr-11"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              {rules.map((r) => (
                <li key={r.text} className={`flex items-center gap-1.5 ${r.ok ? "text-success" : "text-base-content/60"}`}>
                  {r.ok ? <Check size={14} /> : <X size={14} />} {r.text}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : <UserPlus size={18} />}
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
