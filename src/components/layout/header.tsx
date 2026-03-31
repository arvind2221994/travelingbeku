import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "../layout/auth-button";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/favicons/android-chrome-192x192.png"
      alt="TravelingBeku Logo"
      width={192}
      height={192}
      className={`w-full h-full object-contain ${className || ""}`}
    />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden p-2">
            <Logo className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Traveling<span className="text-orange-400">Beku</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Home
          </Link>

          <AuthButton />

          <Link
            href="/blogs"
            className="text-sm px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors font-medium"
          >
            Blogs →
          </Link>
        </nav>
      </div>
    </header>
  );
}

