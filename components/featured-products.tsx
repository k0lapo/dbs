"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Plus } from "lucide-react"

export default function FeaturedProducts() {
  const categories = [
    { 
      name: "The Sets", 
      label: "DBS Collection",
      description: "A dialogue between structure and fluidity. Exploring the silhouette of modern movement.",
      image: "denim-set" 
    },
    { 
      name: "Sportswear", 
      label: "From the Streets, For the Streets",
      description: "Where laboratory precision meets the raw energy of the street. Engineered to endure.",
      image: "beach" 
    },
  ]

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("success")
    setEmail("")
  }

  return (
    <section className="bg-[#fcfcfc] dark:bg-[#080808]">
      {/* Editorial Category Sections */}
      {categories.map((category, idx) => (
        <div key={category.name} className="relative group border-b border-foreground/[0.04]">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[90vh] lg:h-[90vh] items-stretch">
              
              {/* Media Block - 7/12 width */}
              <div className={`relative overflow-hidden lg:col-span-7 ${idx % 2 !== 0 ? "lg:order-2 lg:border-l border-foreground/[0.04]" : "lg:border-r border-foreground/[0.04]"}`}>
                <img
                  src={`/${category.image}.jpg`}
                  alt={category.name}
                  className="w-full h-full object-cover  transition-transform duration-[4s] ease-out scale-105 group-hover:scale-100"
                />
                
                {/* Luxury Glass Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 transition-colors duration-1000" />
                
                {/* Technical Corner Markers */}
                <div className="absolute top-10 left-10 md:top-14 md:left-14 mix-blend-difference">
                   <Plus className="w-5 h-5 text-white/30 stroke-[1px]" />
                </div>
                
              </div>

              {/* Textual Block - 5/12 width */}
              <div className={`py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-between lg:col-span-5 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-muted-foreground/50">
                    {category.label}
                  </span>
                  <div className="w-12 h-px bg-foreground/10" />
                </div>

                <div className="space-y-8 max-w-md">
                  <h3 className="text-6xl md:text-8xl font-extralight tracking-tighter text-foreground leading-[0.85]">
                    {category.name}.
                  </h3>
                  <p className="text-muted-foreground/80 leading-relaxed font-light text-lg md:text-xl italic">
                    {category.description}
                  </p>
                </div>
                
                <Link href="/shop" className="group/link w-fit inline-flex items-center gap-4 py-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-foreground border-b border-transparent group-hover/link:border-foreground transition-all duration-500">
                    Discover Pieces
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Minimalist Archive Signup (Newsletter) */}
      <div className="relative py-40 md:py-64 bg-background">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="text-left space-y-6">
            <h2 className="text-4xl md:text-6xl font-extralight tracking-tighter text-foreground">
              The <span className="italic font-normal">Archive</span> List
            </h2>
            <p className="text-muted-foreground font-light tracking-wide max-w-sm leading-relaxed">
              Register to receive seasonal lookbooks, private invitations to studio viewings, and priority access to limited drops.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="relative group">
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-foreground/10 py-6 text-sm tracking-[0.3em] focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-0 bottom-6 text-[10px] font-bold tracking-[0.4em] uppercase text-foreground hover:text-primary transition-colors"
                >
                  {status === "loading" ? "..." : status === "success" ? "Done" : "Register"}
                </button>
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 leading-loose">
                By registering, you accept our <span className="underline underline-offset-4 cursor-pointer">Terms</span> and read our <span className="underline underline-offset-4 cursor-pointer">FAQs</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}