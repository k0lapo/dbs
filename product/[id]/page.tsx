"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"        // ✅ ADD THIS
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
import { useCart } from "@/components/cart-provider"


// Keep the SAME list as shop for id/name/category/slug
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


// helpers
const parseNairaToNumber = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0
const titleCase = (s: string) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())

const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const sbRender = (key: string, width = 1200, q = 75) =>
  `${SB_URL}/storage/v1/render/image/public/product-images/${encodeURIComponent(key).replace(
    /%2F/g,
    "/"
  )}?width=${width}&quality=${q}&format=webp`
const sbObject = (key: string) =>
  `${SB_URL}/storage/v1/object/public/product-images/${encodeURIComponent(key).replace(/%2F/g, "/")}`

// Build product details
const hydrate = (p: (typeof allProducts)[number]) => {
  const price = parseNairaToNumber(p.price)
  return {
    id: p.id,
    name: p.name,
    category: titleCase(p.category),
    price,
    rating: 5,
    reviews: 12,
    description: `${p.name} — premium DBS quality with comfort, durability, and street-ready style.`,
    details: [
      "Premium fabric & stitching",
      "Comfort-first fit",
      "Durable print/embroidery",
      "Care: Machine wash cold",
    ],
    sizes:
      p.category === "tracksuits"
        ? ["XS", "S", "M", "L", "XL", "XXL"]
        : p.category === "bottoms"
        ? ["28", "30", "32", "34", "36", "38"]
        : p.category === "accessories"
        ? ["One Size"]
        : ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Grey"],
    // image key base (no -2/-3 yet)
    baseKey: `products/${p.image}.jpg`,
    sku: `DBS-${p.category.toUpperCase().slice(0, 3)}-${String(p.id).padStart(3, "0")}`,
    inStock: true,
  }
}

// Hide-on-error <img>
function Thumb({
  url,
  alt,
  onClick,
}: {
  url: string
  alt: string
  onClick: () => void
}) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border/60 hover:border-foreground/70 transition-colors"
      aria-label={`View ${alt}`}
    >
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setHidden(true)}
      />
    </button>
  )
}

export default function ProductPage() {
  // ✅ Use useParams in a client component
  const params = useParams<{ id: string }>()
  const id = Number.parseInt(params.id as string)

  // same as before:
  const base = allProducts.find((p) => p.id === id) || allProducts[0]
  const product = hydrate(base)

  const { addItem } = useCart()

  // Build gallery candidates:
  const candidateKeys = [
    product.baseKey,
    product.baseKey.replace(".jpg", "-1.jpg"),
    product.baseKey.replace(".jpg", "-2.jpg"),
    product.baseKey.replace(".jpg", "-3.jpg"),
  ]

  const fullSize = candidateKeys.map((k) => sbRender(k, 1200, 75))
  const thumbs = candidateKeys.map((k) => sbRender(k, 160, 70))

  const [currentIdx, setCurrentIdx] = useState(0)
  const [mainUrl, setMainUrl] = useState(fullSize[0])

  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleMainError = (e: any) => {
    const failingUrl = e.currentTarget.src
    const idx = fullSize.findIndex((u) => u === failingUrl)
    if (idx >= 0) setMainUrl(sbObject(candidateKeys[idx]))
    else e.currentTarget.src = `https://source.unsplash.com/1200x1200/?streetwear,apparel`
  }

  // related (same category)
  const related = useMemo(
    () =>
      allProducts
        .filter((p) => p.category === base.category && p.id !== base.id)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: parseNairaToNumber(p.price),
          key: `products/${p.image}.jpg`,
        })),
    [base.id, base.category]
  )

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* BREADCRUMB + PRODUCT STRIP (lux, minimal) */}
      <section className="border-b border-border bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40">DBS STUDIO</p>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/60">
              <Link href="/" className="hover:text-white/90">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-white/90">
                Shop
              </Link>
              <span>/</span>
              <span className="text-white/90">{product.name}</span>
            </div>
          </div>

          <div className="text-xs md:text-sm text-white/70 space-y-1 md:text-right">
            <p>Crafted in limited runs</p>
            <p>Free shipping above ₦50,000</p>
          </div>
        </div>
      </section>


      {/* MAIN PRODUCT AREA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 lg:gap-14">
          {/* GALLERY SIDE */}
          <div className="space-y-5">
            <div className="relative bg-card/60 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-border/60">
              <img
                key={mainUrl}
                src={mainUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                fetchPriority="high"
                onError={handleMainError}
              />

              {/* Arrows */}
              <button
                onClick={() =>
                  setCurrentIdx((prev) => {
                    const next = prev === 0 ? candidateKeys.length - 1 : prev - 1
                    setMainUrl(fullSize[next])
                    return next
                  })
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentIdx((prev) => {
                    const next = prev === candidateKeys.length - 1 ? 0 : prev + 1
                    setMainUrl(fullSize[next])
                    return next
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Pagination chip */}
              <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-xs">
                {currentIdx + 1} / {candidateKeys.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {thumbs.map((tUrl, idx) => (
                <Thumb
                  key={tUrl}
                  url={tUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => {
                    setCurrentIdx(idx)
                    setMainUrl(fullSize[idx])
                  }}
                />
              ))}
            </div>
          </div>

          {/* INFO SIDE – sticky card on desktop */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 md:p-7 space-y-6 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
              {/* Title + rating */}
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
                  {product.category}
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < product.rating ? "text-accent" : "text-muted-foreground"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {product.reviews} verified reviews
                  </span>
                </div>
              </div>

              {/* Price + sku + stock */}
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-semibold text-primary">
                  ₦{product.price.toLocaleString()}
                </p>
                <p
                  className={`text-xs font-medium ${
                    product.inStock ? "text-secondary" : "text-destructive"
                  }`}
                >
                  {product.inStock ? "In stock • Ready to ship" : "Out of stock"}
                </p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                  SKU: {product.sku}
                </p>
              </div>

              {/* Short description */}
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Color selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="font-semibold text-foreground">
                    Color <span className="font-normal text-muted-foreground">/ {selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-all ${
                        selectedColor === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground/80"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="font-semibold text-foreground">
                    Size <span className="font-normal text-muted-foreground">/ {selectedSize}</span>
                  </span>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80">
                    Size Guide
                  </Link>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-lg border flex items-center justify-center text-xs md:text-sm font-semibold transition-all ${
                        selectedSize === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground/80"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <span className="text-xs md:text-sm font-semibold text-foreground">Quantity</span>
                <div className="flex items-center gap-3 w-fit">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm md:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Primary actions */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full h-11 md:h-12 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs md:text-sm font-semibold tracking-[0.18em] uppercase"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity,
                      color: selectedColor,
                      size: selectedSize,
                      imageKey: product.baseKey,
                    })
                  }
                >
                  Add to Bag
                </Button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorited((v) => !v)}
                    className={`flex-1 h-11 rounded-full border-2 flex items-center justify-center gap-2 text-xs md:text-sm font-medium transition-all ${
                      isFavorited
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                    Wishlist
                  </button>
                  <button className="flex-1 h-11 rounded-full border-2 border-border text-foreground hover:border-foreground flex items-center justify-center gap-2 text-xs md:text-sm font-medium transition-all">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Quick info */}
              <div className="pt-4 border-t border-border/70 space-y-2 text-xs md:text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span>1–3 day delivery within Nigeria</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span>30-day return policy on unworn items</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>

            {/* Product details block under card on desktop */}
            <div className="mt-8 space-y-4 border-t border-border pt-6">
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                Product Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.details.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RELATED SECTION – keep it clean + shoppable */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10 md:pt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-light text-foreground">
                You may also like
              </h2>
              <Link
                href="/shop"
                className="text-xs md:text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {related.map((rp) => (
                <Link key={rp.id} href={`/product/${rp.id}`} className="group">
                  <div className="space-y-3">
                    <div className="relative aspect-3/4 bg-muted rounded-xl overflow-hidden border border-border/60">
                      <img
                        src={sbRender(rp.key, 400, 70)}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement
                          el.src = sbObject(rp.key)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-[15px] font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rp.name}
                      </h3>
                      <p className="text-sm font-semibold text-primary">
                        ₦{rp.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      className="w-full h-9 rounded-full bg-foreground hover:bg-foreground/90 text-background text-[11px] md:text-xs tracking-[0.18em] uppercase"
                      onClick={(e) => {
                        e.preventDefault() // stay on this page
                        addItem({
                          id: rp.id,
                          name: rp.name,
                          price: rp.price,
                          quantity: 1,
                          color: "Black",
                          size: "M",
                          imageKey: rp.key,
                        })
                      }}
                    >
                      Add to Bag
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
