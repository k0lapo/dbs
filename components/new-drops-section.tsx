"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from "lucide-react"

// --- SUPABASE CONFIG & UTILS ---
const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/")
const sbRender = (key: string, width = 600, quality = 70) => 
  `${SB_URL}/storage/v1/render/image/public/product-images/${encodePath(key)}?width=${width}&quality=${quality}&format=webp`
const sbObject = (key: string) => 
  `${SB_URL}/storage/v1/object/public/product-images/${encodePath(key)}`
const buildCandidateKeys = (baseNoExt: string) => [`${baseNoExt}.jpg`, `${baseNoExt}.jpeg`, `${baseNoExt}.png`]
const buildImgSources = (key: string) => {
  const src400 = sbRender(key, 400, 70); const src600 = sbRender(key, 600, 70)
  return { src600, srcSet: `${src400} 400w, ${src600} 600w` }
}

const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const el = e.currentTarget as HTMLImageElement & { dataset: any }
  try {
    const candidates: string[] = JSON.parse(el.dataset.candidates || "[]")
    let idx = Number(el.dataset.idx || "0"); let mode = el.dataset.mode || "render"
    if (mode === "render") { el.dataset.mode = "raw"; el.src = sbObject(candidates[idx]); el.srcset = ""; return }
    idx += 1
    if (idx < candidates.length) {
      el.dataset.idx = String(idx); el.dataset.mode = "render"
      const { src600, srcSet } = buildImgSources(candidates[idx]); el.src = src600; el.srcset = srcSet; return
    }
    el.src = "https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=400&h=400&auto=format&fit=crop"
  } catch (err) { el.src = "https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=400&h=400&auto=format&fit=crop" }
}

export default function NewDropsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNewDrops = async () => {
      try {
        const rawData = [
          { 
    id: 16, 
    name: "DBS Tailored Jersey", 
    price: "₦100,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "tailored-jersey" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 17, 
    name: "DBS Tailored Pattern Crop Shirt", 
    price: "₦70,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "pattern-shirt" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 18, 
    name: "DBS Collared Polo", 
    price: "₦180,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "collared-polo" // PLACEHOLDER IMAGE SLUG
  },
  { id: 19, name: "DBS Blade Shirt", price: "₦75,000", category: "tops", image: "dbs-blade" },
  { 
    id: 21, 
    name: "Soweto Embroidered Denim Set", 
    price: "₦280,000", // PLACEHOLDER PRICE
    category: "tracksuits", // Categorized as tracksuits/sets
    image: "denim-set" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 22, 
    name: "DBS Patched Embroidered Leather Jacket", 
    price: "₦200,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "varsity-jacket" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 23, 
    name: "DBS Quarter Jort Denim", 
    price: "₦120,000", // PLACEHOLDER PRICE
    category: "bottoms", 
    image: "quarter-jorts" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 24, 
    name: "Soweto Sweat Stripes", 
    price: "₦140,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "sweat-stripes" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 25, 
    name: "DBS Fabric Jumper Jacket", 
    price: "₦109,000", // PLACEHOLDER PRICE
    category: "tops", 
    image: "fabric-jumper" // PLACEHOLDER IMAGE SLUG
  },
  { 
    id: 26, 
    name: "DBS Stone Flair Pant Joggers", 
    price: "₦100,000", // PLACEHOLDER PRICE
    category: "bottoms", 
    image: "stone-flair" // PLACEHOLDER IMAGE SLUG
  }
        ].reverse()
        setProducts(rawData)
      } finally { setLoading(false) }
    }
    fetchNewDrops()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (loading) return (
    <div className="py-40 text-center">
      <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground animate-pulse">Accessing Archive...</span>
    </div>
  )

  return (
    <section className="bg-background py-24 md:py-32 overflow-hidden border-b border-foreground/[0.03]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Plus className="w-3 h-3 text-primary/40" />
              <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-muted-foreground/60">New Era Arrivals</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tighter text-foreground leading-none">
              The Drops.
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <Link 
              href="/shop" 
              className="group hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-all duration-500"
            >
              View Full Collection
              <div className="w-6 h-[1px] bg-foreground/20 group-hover:w-10 transition-all duration-500" />
            </Link>
            
            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-4 border border-foreground/5 hover:border-foreground/20 rounded-full transition-colors"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 font-light" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-4 border border-foreground/5 hover:border-foreground/20 rounded-full transition-colors"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 font-light" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Slider Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide gap-6 px-6 lg:px-12 transition-all cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const baseNoExt = `products/${product.image}`
          const candidates = buildCandidateKeys(baseNoExt)
          const { src600, srcSet } = buildImgSources(candidates[0])

          return (
            <div key={product.id} className="min-w-[75vw] md:min-w-[35vw] lg:min-w-[22vw] snap-start mb-4">
              <Link href={`/product/${product.id}`} className="group block space-y-6">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-[#f9f9f9] dark:bg-[#0c0c0c] overflow-hidden">
                  <img
                    src={src600}
                    srcSet={srcSet}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s] ease-out"
                    loading="lazy"
                    data-candidates={JSON.stringify(candidates)}
                    data-idx="0"
                    data-mode="render"
                    onError={handleImgError}
                  />
                  
                  {/* Subtle Luxury Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/[0.02] group-hover:bg-black/10 transition-all duration-700" />
                  
                  {/* Hover Tag */}
                  <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <span className="text-[9px] tracking-[0.3em] uppercase bg-white/90 dark:bg-black/90 px-3 py-1.5 backdrop-blur-sm">
                      Details +
                    </span>
                  </div>
                </div>

                {/* Product Label */}
                <div className="space-y-2 px-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[12px] md:text-sm font-medium uppercase tracking-[0.1em] text-foreground leading-tight max-w-[70%]">
                      {product.name}
                    </h3>
                    <p className="text-[12px] md:text-sm font-light tracking-tighter text-muted-foreground italic">
                      {product.price}
                    </p>
                  </div>
                  <div className="w-0 group-hover:w-full h-[1px] bg-foreground/10 transition-all duration-1000" />
                </div>
              </Link>
            </div>
          )
        })}
        
        {/* Final "View All" Card for the Slider */}
        <div className="min-w-[60vw] md:min-w-[25vw] flex items-center justify-center snap-start">
          <Link href="/shop" className="group text-center space-y-4">
             <div className="w-20 h-20 rounded-full border border-foreground/5 flex items-center justify-center group-hover:scale-110 group-hover:border-foreground/20 transition-all duration-700">
               <ArrowRight className="w-6 h-6 font-thin" />
             </div>
             <span className="block text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 group-hover:text-foreground transition-colors">
                Full Boutique
             </span>
          </Link>
        </div>
      </div>

      {/* Progress Bar (Visual Polish) */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-12 opacity-20">
        <div className="h-[1px] w-full bg-foreground/10 relative overflow-hidden">
           <div className="absolute inset-y-0 left-0 bg-foreground w-1/4 animate-subtle-slide" />
        </div>
      </div>
    </section>
  )
}