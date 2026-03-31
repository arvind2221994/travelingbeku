import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, FilePlus } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Admin top bar */}
      <header className="border-b border-white/8 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">

            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm text-blue transition-colors"
              >
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
              <Link
                href="/admin/new"
                className="flex items-center gap-1.5 text-sm text-blue transition-colors"
              >
                <FilePlus size={13} />
                New Post
              </Link>
            </nav>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-red hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
}
