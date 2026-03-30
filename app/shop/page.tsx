"use client"

import { useState, useMemo } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sliders, ArrowRight, ChevronDown } from "lucide-react"

/** ================== DATA & HELPERS (unchanged per instructions) ================== */
const allProducts = [
  { id: 1,  name: "DBS Sublimated Tracksuits",          price: "₦170,000", category: "tracksuits",  image: "track" },
  { id: 2,  name: "DBS Nylon Tracksuits",               price: "₦170,000", category: "tracksuits",  image: "sets" },
  { id: 3,  name: "DBS Christ De Savior T-shirt",       price: "₦100,000", category: "tops",        image: "dbs shirt white" },
  { id: 4,  name: "DBS raglan CropTop for ladies",      price: "₦50,000", category: "tops",        image: "raglan" },
  { id: 5,  name: "Soweto ladies CropTops",             price: "₦50,000", category: "tops",        image: "crop tank" },
  { id: 6,  name: "DripBySoweto Club members Jersey",   price: "₦120,000", category: "tops",        image: "jersey" },
  { id: 7,  name: "DBS Crzy Armless",                   price: "₦50,000", category: "tops",        image: "JS1" },
  { id: 8,  name: "DBS Christ D Savior Crop armless",   price: "₦30,000", category: "tops",        image: "tank" },
  { id: 9,  name: "DBS Double layer Jean",              price: "₦70,000", category: "bottoms",     image: "ascension front" },
  { id: 10, name: "DBS Ascension Shirt",                price: "₦100,000", category: "tops",        image: "ascension back" },
  { id: 11, name: "DripBySoweto Nylon Short",           price: "₦40,000", category: "bottoms",     image: "shorts" },
  { id: 12, name: "Soweto Arts Embroidery jorts",       price: "₦70,000", category: "bottoms",     image: "jean jorts" },
  { id: 13, name: "DBS Embroidered Suede Hat",          price: "₦100,000", category: "accessories", image: "suedehat" },
  { id: 14, name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", image: "jean snapback" },
  { id: 15, name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  image: "2piece hoodie" },
]

const parseNairaToNumber = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0
const titleCase = (s: string) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())
const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/")
const sbRender = (key: string, width = 600, quality = 70) => `${SB_URL}/storage/v1/render/image/public/product-images/${encodePath(key)}?width=${width}&quality=${quality}&format=webp`
const sbObject = (key: string) => `${SB_URL}/storage/v1/object/public/product-images/${encodePath(key)}`
const buildCandidateKeys = (baseNoExt: string) => [`${baseNoExt}.jpg`, `${baseNoExt}.jpeg`, `${baseNoExt}.png`]
const buildImgSources = (key: string) => {
  const src400 = sbRender(key, 400, 70); const src600 = sbRender(key, 600, 70); const src800 = sbRender(key, 800, 75)
  return { src400, src600, src800, srcSet: `${src400} 400w, ${src600} 600w, ${src800} 800w` }
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
    el.src = `https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=400&h=400&auto=format&fit=crop`
  } catch (err) { el.src = `https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=400&h=400&auto=format&fit=crop` }
}

const PRODUCTS = allProducts.map((p, i) => ({
  id: p.id, name: p.name, category: titleCase(p.category), price: parseNairaToNumber(p.price),
  baseNoExt: `products/${p.image}`, rating: 5, reviews: 10 + (i % 25),
}))

const CATEGORIES = ["All", "Tracksuits", "Tops", "Bottoms", "Accessories"]
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦70,000 - ₦100,000", min: 70000, max: 100000 },
  { label: "₦120,000 - ₦150,000", min: 120000, max: 150000 },
  { label: "Over ₦150,000", min: 150000, max: Number.POSITIVE_INFINITY },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS
    if (selectedCategory !== "All") filtered = filtered.filter((p) => p.category === selectedCategory)
    const priceRange = PRICE_RANGES[selectedPriceRange]
    filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)
    if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price)
    else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price)
    else if (sortBy === "newest") filtered = [...filtered].reverse()
    return filtered
  }, [selectedCategory, selectedPriceRange, sortBy])

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] selection:bg-black selection:text-white">
      <Navigation />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 pb-24">
        {/* HEADER SECTION */}
        <header className="mb-16 space-y-4">
          
          <h1 className="text-4xl md:text-6xl font-extralight pt-8 tracking-tighter text-foreground uppercase italic">
            Collections<span className="not-italic font-normal">.</span>
          </h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-border via-border/40 to-transparent" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          {/* SIDEBAR */}
          <aside className="hidden lg:block sticky top-32 self-start h-fit space-y-12">
            {/* Categories */}
            <section className="space-y-6">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/40">Categories</h3>
              <ul className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`group flex items-center gap-3 text-sm transition-all duration-300 ${
                        selectedCategory === cat ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`h-[1px] transition-all duration-500 bg-foreground ${selectedCategory === cat ? "w-6" : "w-0 group-hover:w-4"}`} />
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Price Filter */}
            <section className="space-y-6 pt-6 border-t border-border/40">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/40">Price Range</h3>
              <div className="flex flex-col gap-3">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(idx)}
                    className={`text-left text-xs py-1 transition-colors ${
                      selectedPriceRange === idx ? "text-foreground font-semibold underline underline-offset-8" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </section>
            
            <div className="p-6 bg-muted/30 rounded-3xl border border-border/50">
              <p className="text-[11px] leading-relaxed text-muted-foreground uppercase tracking-widest">
                DBS Essentials.
              </p>
            </div>
          </aside>

          {/* MAIN GRID */}
          <section className="space-y-8">
            {/* CONTROLS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-[10px] uppercase font-bold tracking-widest"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Filters
                </button>
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  Showing {filteredProducts.length} Results
                </span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Sort By</span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pl-2 pr-8 py-1 text-xs font-semibold uppercase tracking-widest focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => {
                const candidates = buildCandidateKeys(product.baseNoExt)
                const { src600, srcSet } = buildImgSources(candidates[0])

                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="group relative block">
                    <div className="space-y-5">
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2f2] dark:bg-[#151515] rounded-[2rem]">
                        <img
                          src={src600}
                          srcSet={srcSet}
                          alt={product.name}
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                          loading="lazy"
                          data-candidates={JSON.stringify(candidates)}
                          data-idx="0"
                          data-mode="render"
                          onError={handleImgError}
                        />
                        <div className="absolute top-4 left-4">
                           <span className="px-3 py-1.5 backdrop-blur-md bg-black/50 border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                            DBS Official
                           </span>
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <span className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2">
                               Quick View <ArrowRight className="w-3 h-3" />
                             </span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="px-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
                              {product.category}
                            </p>
                            <h3 className="text-sm md:text-base font-medium tracking-tight text-foreground line-clamp-1">
                              {product.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                           <p className="text-lg font-light tracking-tighter">
                            ₦{product.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1.5 opacity-60">
                            <span className="text-[10px] font-bold">★ {product.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-40 space-y-6">
                <p className="text-sm uppercase tracking-widest text-muted-foreground italic">No pieces found in this vault.</p>
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectedCategory("All"); setSelectedPriceRange(0); }}
                  className="rounded-full px-8 border-foreground/20 uppercase text-[10px] tracking-widest font-bold"
                >
                  Reset Curation
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}