import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Ambient background orbs */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #0d32aaff 0%, #1d8ec2ff 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, #0c0fcfff 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="text-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Traveling beku guru!
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          <span className="gradient-text">EXPLORE.</span>{" "}
          The world isn't a feed.
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unfiltered travel stories, practical guides, and adventures from
          every corner of the globe — written for those who actually go.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/blogs"
            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(249,115,22,0.4)] active:scale-95"
          >
            Read the Blog →
          </Link>
          <Link
            href="#tools"
            className="px-8 py-3.5 rounded-xl bg-brand-dark hover:bg-brand-dark/90 white-cta text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm"
          >
            Explore Tools
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-neutral-600">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-orange-500/40" />
          <span className="text-[10px] uppercase tracking-widest">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
