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
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* HERO – Full Page, Luxury, Minimal */}
<section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <img
    src="/read.jpg"
    alt="DripBySoweto brand hero"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/55" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div className="flex flex-col md:flex-row md:items-center gap-12">
      
      {/* Left Text Block */}
      <div className="max-w-xl space-y-6">
        <p className="text-xs tracking-[0.3em] uppercase text-white/60">
          About DripBySoweto
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
          Luxury Streetwear  
          <span className="block md:inline"> Born in Africa.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          DripBySoweto is a luxury streetwear house crafting bold, carefully
          constructed pieces that carry the energy of the streets and the
          discipline of high fashion.
        </p>
      </div>

      {/* Right Text Block */}
      <div className="md:ml-auto md:text-right space-y-6 max-w-sm">
        <p className="text-base md:text-lg text-white/70 leading-relaxed">
          Built for those who move differently — the creators, dreamers, and
          rebels who use style as their language.
        </p>

        <Link href="/shop">
          <Button className="bg-white text-black hover:bg-white/90 font-medium text-base h-12 px-8 flex items-center gap-2">
            Explore Collection
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

    </div>
  </div>
</section>


      {/* STORY – short, direct, no clutter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr,0.9fr] items-start">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight">
               From a sketch on paper  
              <span className="block md:inline">to a movement on the streets.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              DripBySoweto started with a simple question: what if African street
              culture was treated with the same reverence as a luxury fashion
              house? No shortcuts. No fast-fashion compromises. Just considered,
              intentional design.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every drop is designed in-house, with a focus on fit, fabric and
              finishing. From sublimated tracksuits to embroidered caps, each
              piece is built to move with you — in the studio, on stage, in the
              streets, or on a long-haul flight.
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-border/70 bg-card/60 px-6 py-6 md:px-8 md:py-8 space-y-4">
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                By the Numbers
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground">50k+</p>
                  <p className="text-xs text-muted-foreground">Pieces worn</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Curated drops</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground">15+</p>
                  <p className="text-xs text-muted-foreground">Countries reached</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/40 px-6 py-6 md:px-8 md:py-7 space-y-3">
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                Behind the Label
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DripBySoweto is led by a small team of designers, creatives and
                operators obsessed with one thing: making pieces you&apos;ll
                reach for again and again — season after season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS – clean 3-column “house codes” */}
      <section className="border-y border-border/60 bg-background/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-4 mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
              House Codes
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              The principles we design by.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-border/60 bg-card/40 px-6 py-7 md:px-7 md:py-8 space-y-3"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA – simple, not shouty */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50">
            Next Drop
          </p>
          <h2 className="text-3xl md:text-4xl font-light leading-tight">
            Build your rotation with pieces  
            <span className="block md:inline">that won&apos;t blend in.</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
            Discover tracksuits, jerseys, jorts and hoodies designed to move
            effortlessly between the streets, the studio, and your everyday.
          </p>
          <Link href="/shop">
            <Button className="bg-white text-black hover:bg-white/90 font-medium text-sm h-11 px-7 inline-flex items-center gap-2">
              Shop DripBySoweto
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
