import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelingBeku — Adventure Awaits",
    template: "%s | TravelingBeku",
  },
  description:
    "Discover breathtaking travel stories, tips, and guides from around the world. TravelingBeku — your companion for every journey.",
  keywords: ["travel", "blog", "adventure", "backpacking", "travel tips"],
  authors: [{ name: "TravelingBeku" }],
  openGraph: {
    type: "website",
    siteName: "TravelingBeku",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

