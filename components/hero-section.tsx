"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/1pac.jpg" // Ensure this is in your /public folder
          alt="DBS Editorial Hero"
          fill
          priority // Tells Next.js to load this immediately
          quality={90}
          className="object-cover object-center scale-105 animate-slow-zoom transition-transform duration-[10s]"
        />
        {/* Sophisticated Multi-layer Overlay */}
        <div className="absolute inset-0 bg-black/30" /> {/* Dimmer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent md:block hidden" />
      </div>

      {/* Decorative Technical Elements */}
      <div className="absolute top-12 left-12 z-20 hidden md:block">
        <div className="flex items-center gap-4">
          <Plus className="w-4 h-4 text-white/30" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-light">
            Est. 2026 / Archive 01
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
        <div className="max-w-4xl space-y-10">
          
          <div className="space-y-4">
            
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight text-white tracking-tighter leading-[0.85]">
              Drip by Soweto 
            </h1>
            
            <p className="text-base md:text-xl text-white/60 font-light leading-relaxed max-w-md italic border-l border-white/10 pl-6">
              "Tailored cuts and clean lines engineered for those who navigate the city in silence."
            </p>
          </div>

          {/* Luxury CTA Interaction */}
          <div className="pt-4">
            <Link href="/shop" className="group relative inline-flex items-center gap-6 overflow-hidden">
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">
                Explore Latest Drop
              </span>
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 transition-all duration-700" />
                <ArrowRight className="w-4 h-4 text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            </Link>
          </div>
        </div>
      </div>

  

      
    </section>
  )
}