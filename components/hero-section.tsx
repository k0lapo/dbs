"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative h-screen items-center justify-center w-full bg-black overflow-hidden">
        
      {/* Background image */}
      <div className="absolute inset-0">
        <img
    src="/1pac.jpg"
    alt="DripBySoweto brand hero"
    className="absolute inset-0 w-full h-full object-cover"
  />
        {/* Lux gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-black/75 via-black/65 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center items-end min-h-[80vh] md:min-h-[90vh]">
          <div className="w-full md:max-w-md lg:max-w-lg text-right space-y-6 md:space-y-8">
            <div className="space-y-3">
              <p className="text-[0.7rem] tracking-[0.35em] uppercase text-white/50">
                DripBySoweto · Drop
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                DBS
                <span className="block md:inline"> Collection</span>
              </h1>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs md:ml-auto md:max-w-none">
                Tailored cuts, clean lines, and unapologetic street energy — built for the ones
                who move different.
              </p>
            </div>

            {/* Little ":)" but make it feel intentional */}
            <div className="flex items-center justify-end gap-3 text-white/60 text-sm">
              <span className="h-px w-10 bg-white/30" />
              <span>:)</span>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/shop">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-xs md:text-sm font-medium text-white tracking-wide hover:bg-white/10 hover:border-white/60 transition-colors">
                  Explore the collection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
