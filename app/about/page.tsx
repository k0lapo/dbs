"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  const pillars = [
    {
      title: "Elevated Streetwear",
      description:
        "Tailored silhouettes, precise detailing, and premium fabrics. Every piece is designed to feel as good as it looks.",
    },
    {
      title: "African Heritage",
      description:
        "Inspired by the rhythm, architecture, and attitude of African cities — especially the streets that raised us.",
    },
    {
      title: "Intentional Craft",
      description:
        "Small-batch drops, considered design, and obsessive quality control. No noise. Just pieces worth owning.",
    },
  ]

  return (
    <main className="min-h-screen bg-background pt-16 md:pt-20">
      {/* Fixed Nav */}
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/read.jpg"
          alt="DripBySoweto brand hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 lg:gap-16">
            {/* Left Text Block */}
            <div className="max-w-xl space-y-5 sm:space-y-6">
              <p className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-white/60">
                About DripBySoweto
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight">
                Luxury Streetwear
                <span className="block md:inline"> Born in Africa.</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
                DripBySoweto is a luxury streetwear house crafting bold, carefully
                constructed pieces that carry the energy of the streets and the
                discipline of high fashion.
              </p>
            </div>

            {/* Right Text Block */}
            <div className="md:ml-auto md:text-right space-y-4 sm:space-y-5 max-w-md w-full">
              <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed">
                Built for those who move differently — the creators, dreamers, and
                rebels who use style as their language.
              </p>

              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-medium text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 flex items-center justify-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.1fr,0.9fr] items-start">
          {/* Story Text */}
          <div className="space-y-5 sm:space-y-6">
            <p className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground">
              Our Story
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground leading-tight">
              From a sketch on paper
              <span className="block md:inline"> to a movement on the streets.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              DripBySoweto started with a simple question: what if African street
              culture was treated with the same reverence as a luxury fashion
              house? No shortcuts. No fast-fashion compromises. Just considered,
              intentional design.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every drop is designed in-house, with a focus on fit, fabric and
              finishing. From sublimated tracksuits to embroidered caps, each
              piece is built to move with you — in the studio, on stage, in the
              streets, or on a long-haul flight.
            </p>
          </div>

          {/* Stats / Side Cards */}
          <div className="space-y-6 sm:space-y-8">
            <div className="rounded-2xl border border-border/70 bg-card/60 px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 space-y-4">
              <p className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground">
                By the Numbers
              </p>
              <div className="grid grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                    50k+
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">
                    Pieces worn
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                    12
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">
                    Curated drops
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                    15+
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">
                    Countries reached
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/40 px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 space-y-3">
              <p className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground">
                Behind the Label
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                DripBySoweto is led by a small team of designers, creatives and
                operators obsessed with one thing: making pieces you&apos;ll
                reach for again and again — season after season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="border-y border-border/60 bg-background/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
            <p className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground">
              House Codes
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground">
              The principles we design by.
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-border/60 bg-card/40 px-5 py-6 sm:px-6 sm:py-7 md:px-7 md:py-8 space-y-2.5 sm:space-y-3"
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6">
          <p className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase text-white/50">
            New Drop
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight">
            Build your rotation with pieces
            <span className="block md:inline"> that won&apos;t blend in.</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
            Discover tracksuits, jerseys, jorts and hoodies designed to move
            effortlessly between the streets, the studio, and your everyday.
          </p>
          <Link href="/shop">
            <Button className="bg-white text-black hover:bg-white/90 font-medium text-xs sm:text-sm h-10 sm:h-11 md:h-11 px-6 sm:px-7 inline-flex items-center gap-2">
              Shop DBS
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
