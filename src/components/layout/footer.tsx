import Link from "next/link";
import { Logo } from "./header";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden">
              <Logo className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              Travelling<span className="text-orange-400">Beku</span>
            </span>
          </Link>

          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} TravelingBeku. All rights reserved.
          </p>

          <div className="flex items-center gap-4">

            <a
              href="https://www.instagram.com/travelingbeku"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-600 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
