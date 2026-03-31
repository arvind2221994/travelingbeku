"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  // While loading, show a subtle placeholder to avoid layout shift
  if (status === "loading") {
    return (
      <span className="text-sm text-neutral-600 animate-pulse">•••</span>
    );
  }

  // Logged in — show name + sign out
  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-black transition-colors font-medium text-blue"
        >
          <User size={14} />
          {session.user.name || "Admin"}
        </Link>
      </div>
    );
  }

  // Not logged in — show login link
  return (
    <Link
      href="/login"
      className="text-sm text-neutral-400 hover:text-white transition-colors"
    >
      Login
    </Link>
  );
}
