"use client"

import { useState, useMemo } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sliders } from "lucide-react"

/** ================== DATA (unchanged) ================== */
const allProducts = [
  { id: 1,  name: "DBS Sublimated Tracksuits",          price: "₦170,000", category: "tracksuits",  image: "track" },
  { id: 2,  name: "DBS Nylon Tracksuits",               price: "₦170,000", category: "tracksuits",  image: "sets" },
  { id: 3,  name: "DBS Christ De Savior T-shirt",       price: "₦100,000", category: "tops",        image: "dbs shirt white" },
  { id: 4,  name: "DBS raglan CropTop for ladies",      price: "₦50,000", category: "tops",        image: "raglan" },
  { id: 5,  name: "Soweto ladies CropTops",             price: "₦50,000", category: "tops",        image: "crop tank" },
  { id: 6,  name: "DripBySoweto Club members Jersey",   price: "₦120,000", category: "tops",        image: "jersey" },
  { id: 7,  name: "DBS Crzy Armless",                   price: "₦50,000", category: "tops",        image: "JS1" },
  { id: 8,  name: "DBS Christ D Savior Crop armless",   price: "₦30,000", category: "tops",        image: "tank" },
  { id: 9,  name: "DBS Double layer Jean",              price: "70,000", category: "bottoms",     image: "ascension front" },
  { id: 10, name: "DBS Ascension Shirt",                price: "₦100,000", category: "tops",        image: "ascension back" },
  { id: 11, name: "DripBySoweto Nylon Short",           price: "₨40,000".replace("₨","₦"), category: "bottoms",     image: "shorts" },
  { id: 12, name: "Soweto Arts Embroidery jorts",       price: "70,000", category: "bottoms",     image: "jean jorts" },
  { id: 13, name: "DBS Embroidered Suede Hat",          price: "₦100,000", category: "accessories", image: "suede" },
  { id: 14, name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", image: "jean snapback" },
  { id: 15, name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  image: "2piece hoodie" },
]

/** ================== HELPERS (unchanged) ================== */
const parseNairaToNumber = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0
const titleCase = (s: string) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())

const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/")

const sbRender = (key: string, width = 600, quality = 70) =>
  `${SB_URL}/storage/v1/render/image/public/product-images/${encodePath(key)}?width=${width}&quality=${quality}&format=webp`

const sbObject = (key: string) =>
  `${SB_URL}/storage/v1/object/public/product-images/${encodePath(key)}`

const buildCandidateKeys = (baseNoExt: string) => [
  `${baseNoExt}.jpg`,
  `${baseNoExt}.jpeg`,
  `${baseNoExt}.png`,
]

const buildImgSources = (key: string) => {
  const src400 = sbRender(key, 400, 70)
  const src600 = sbRender(key, 600, 70)
  const src800 = sbRender(key, 800, 75)
  const srcSet = `${src400} 400w, ${src600} 600w, ${src800} 800w`
  return { src400, src600, src800, srcSet }
}

const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const el = e.currentTarget as HTMLImageElement & { dataset: any }

  try {
    const candidates: string[] = JSON.parse(el.dataset.candidates || "[]")
    let idx = Number(el.dataset.idx || "0")
    let mode = el.dataset.mode || "render"

    console.warn("[IMG Fallback] Failed:", el.src, "mode:", mode, "candidate:", candidates[idx])

    if (mode === "render") {
      el.dataset.mode = "raw"
      el.src = sbObject(candidates[idx])
      el.srcset = ""
      return
    }

    idx += 1
    if (idx < candidates.length) {
      el.dataset.idx = String(idx)
      el.dataset.mode = "render"
      const nextKey = candidates[idx]
      const { src600, srcSet } = buildImgSources(nextKey)
      el.src = src600
      el.srcset = srcSet
      return
    }

    el.src = `https://source.unsplash.com/400x400/?streetwear,apparel`
    el.srcset = ""
  } catch (err) {
    console.error("[IMG Fallback] handler error:", err)
    el.src = `https://source.unsplash.com/400x400/?streetwear,apparel`
    el.srcset = ""
  }
}

/** ========== Build PRODUCTS ========== */
const PRODUCTS = allProducts.map((p, i) => {
  const priceNum = parseNairaToNumber(p.price)
  const categoryTC = titleCase(p.category)
  const baseNoExt = `products/${p.image}`

  return {
    id: p.id,
    name: p.name,
    category: categoryTC,
    price: priceNum,
    baseNoExt,
    rating: 5,
    reviews: 10 + (i % 25),
  }
})

const CATEGORIES = ["All", "Tracksuits", "Tops", "Bottoms", "Accessories"]
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦70,000 - ₦100,000", min: 70000, max: 100000 },
  { label: "₦120,000 - ₦150,000", min: 120000, max: 150000 },
  { label: "Over ₦150,000", min: 150000, max: Number.POSITIVE_INFINITY },
]

/** ================== PAGE ================== */
export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    const priceRange = PRICE_RANGES[selectedPriceRange]
    filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)

    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse()
    }

    return filtered
  }, [selectedCategory, selectedPriceRange, sortBy])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* LUXURY SHOP HERO */}
      <section className="border-b border-border bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/40">
              DBS STUDIO STORE
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
              Shop the Collection
            </h1>
            <p className="text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
              Curated drops in limited runs. Built for everyday luxury and street performance — crafted to move with you.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 text-xs md:text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-white/30" />
              <span>Free shipping on orders over ₦50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-white/30" />
              <span>1-3 day delivery within Nigeria</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-white/30" />
              <span>Secure checkout & easy returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-12">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block sticky top-24 self-start space-y-6">
            <div className="bg-card/60 backdrop-blur border border-border/70 rounded-2xl p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
                  Filter
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedPriceRange(0)
                    setSortBy("newest")
                  }}
                  className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">
                  Category
                </p>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-foreground text-background font-medium"
                          : "text-foreground/80 hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 border-t border-border/70 pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">
                  Price
                </p>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedPriceRange === idx
                          ? "bg-muted text-foreground font-medium"
                          : "text-foreground/80 hover:bg-muted/70"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Small note */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              All DBS pieces are produced with a focus on structure, fabric and longevity. Limited quantities per drop.
            </p>
          </aside>

          {/* PRODUCTS + MOBILE CONTROLS */}
          <div className="space-y-6 md:space-y-8">
            {/* TOP CONTROLS */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Mobile Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-full text-xs uppercase tracking-[0.18em] text-foreground hover:bg-muted transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>

                <p className="text-xs md:text-sm text-muted-foreground">
                  {filteredProducts.length} styles
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
                  Sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-full bg-background text-foreground text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* MOBILE FILTER PANEL */}
            {showFilters && (
              <div className="lg:hidden border border-border rounded-2xl bg-card/70 backdrop-blur p-4 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          // keep filters open or close? we'll keep open
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          selectedCategory === cat
                            ? "bg-foreground text-background"
                            : "border border-border text-foreground hover:bg-muted/60"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-border/70 pt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">
                    Price
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedPriceRange === idx
                            ? "bg-muted text-foreground font-medium"
                            : "text-foreground/80 hover:bg-muted/70"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("All")
                      setSelectedPriceRange(0)
                      setSortBy("newest")
                    }}
                    className="w-full text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map((product) => {
                  if (!SB_URL) {
                    console.warn("NEXT_PUBLIC_SUPABASE_URL is missing. Using placeholders.")
                  }
                  const candidates = buildCandidateKeys(product.baseNoExt)
                  const { src600, srcSet } = buildImgSources(candidates[0])

                  return (
                    <Link key={product.id} href={`/product/${product.id}`} className="group">
                      <article className="flex flex-col gap-3 md:gap-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-all duration-300">
                        {/* Image */}
                        <div className="relative aspect-3/4 bg-muted rounded-xl overflow-hidden">
                          <img
                            src={src600}
                            srcSet={srcSet}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            data-candidates={JSON.stringify(candidates)}
                            data-idx="0"
                            data-mode="render"
                            onError={handleImgError}
                          />
                          {/* subtle label */}
                          <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-black/60 text-[10px] uppercase tracking-[0.18em] text-white/80">
                            New Drop
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
                            {product.category}
                          </p>
                          <h3 className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-sm md:text-base font-semibold text-primary">
                              ₦{product.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-muted-foreground">
                                ★ {product.rating}.0
                              </span>
                              <span className="text-[11px] text-muted-foreground/70">
                                ({product.reviews})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          className="
                            w-full h-10 
                            bg-foreground text-background 
                            hover:bg-foreground/90 
                            text-xs md:text-sm 
                            rounded-full 
                            font-medium tracking-[0.12em] uppercase
                          "
                        >
                          View Options
                        </Button>
                      </article>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No products found in this selection.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedPriceRange(0)
                  }}
                  className="mt-4 text-primary hover:text-primary/80 font-medium text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
