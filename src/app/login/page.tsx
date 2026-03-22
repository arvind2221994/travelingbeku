"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Logo } from "../../components/layout/header";

/**
 * Admin login page — not linked from anywhere publicly.
 * Unauthenticated requests to /admin are redirected here.
 */
export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          username: fd.get("username") as string,
          password: fd.get("password") as string,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid credentials. Please double-check and try again.");
        } else if (res?.ok) {
          router.push("/admin");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Network error. Please try again later.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background orb */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="glass rounded-2xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-48 h-48 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
            <Logo className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Admin Access</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5 uppercase tracking-widest">
              Username
            </label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-semibold transition-all mt-2"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Lock size={14} />
            )}
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
