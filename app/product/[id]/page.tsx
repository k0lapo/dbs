"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus, Check } from "lucide-react"
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
  { id: 9,  name: "DBS Double layer Jean",              price: "₦70,000", category: "bottoms",     image: "ascension front" },
  { id: 10, name: "DBS Ascension Shirt",                price: "₦100,000", category: "tops",       image: "ascension back" },
  { id: 11, name: "DripBySoweto Nylon Short",           price: "₨40,000".replace("₨","₦"), category: "bottoms",     image: "shorts" },
  { id: 12, name: "Soweto Arts Embroidery jorts",       price: "₦70,000", category: "bottoms",     image: "jean jorts" },
  { id: 13, name: "DBS Embroidered Suede Hat",          price: "₦100,000", category: "accessories", image: "suedehat" },
  { id: 14, name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", image: "jean snapback" },
  { id: 15, name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  image: "2piece hoodie" },
]

// helpers
const parseNairaToNumber = (p: string) =>
  Number(p.replace(/[^\d]/g, "")) || 0

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())

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
      className="shrink-0 w-16 h-16 rounded-md overflow-hidden border border-neutral-200 hover:border-neutral-800 transition-colors"
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
  const params = useParams<{ id: string }>()
  const id = Number.parseInt(params.id as string)
  const [isAdding, setIsAdding] = useState(false)

  const base = allProducts.find((p) => p.id === id) || allProducts[0]
  const product = hydrate(base)

  const { addItem } = useCart()

  // gallery
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

  const handleAddToBag = () => {
    if (isAdding) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      imageKey: product.baseKey,
    })

    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 400)
  }

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20 text-neutral-900">
      <Navigation />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Small, minimal back link */}
        <div className="mb-6 md:mb-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <span className="h-px w-4 bg-neutral-400" />
            Back to shop
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* GALLERY SIDE */}
          <div className="space-y-4">
            <div className="relative bg-white border border-neutral-200 rounded-none lg:rounded-md overflow-hidden aspect-[3/4] flex items-center justify-center">
              <img
                key={mainUrl}
                src={mainUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                fetchPriority="high"
                onError={handleMainError}
              />

              {/* Arrows – minimal */}
              <button
                onClick={() =>
                  setCurrentIdx((prev) => {
                    const next = prev === 0 ? candidateKeys.length - 1 : prev - 1
                    setMainUrl(fullSize[next])
                    return next
                  })
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-neutral-900 border border-neutral-300 rounded-full p-1.5 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentIdx((prev) => {
                    const next = prev === candidateKeys.length - 1 ? 0 : prev + 1
                    setMainUrl(fullSize[next])
                    return next
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-neutral-900 border border-neutral-300 rounded-full p-1.5 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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

          {/* INFO SIDE */}
          <div className="space-y-8 lg:space-y-10">
            {/* Title, category, price */}
            <div className="space-y-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-normal">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">
                In stock · Ships in 3–5 business days within Nigeria
              </p>
            </div>

            {/* Short description */}
            <p className="text-sm leading-relaxed text-neutral-600 max-w-prose">
              {product.description}
            </p>

            {/* Color selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.16em] text-neutral-700">
                  Color
                </span>
                <span className="text-neutral-500">{selectedColor}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-full border text-xs tracking-[0.14em] uppercase transition-all ${
                      selectedColor === c
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 text-neutral-800 hover:border-neutral-900"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.16em] text-neutral-700">
                  Size
                </span>
                <Link
                  href="#"
                  className="underline underline-offset-4 text-neutral-500 hover:text-neutral-900"
                >
                  Size guide
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-none border text-xs tracking-[0.14em] uppercase transition-all ${
                      selectedSize === s
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 text-neutral-800 hover:border-neutral-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.16em] text-neutral-700">
                Quantity
              </span>
              <div className="flex items-center gap-3 w-fit border border-neutral-300 px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary actions */}
            <div className="space-y-3">
              <Button
                className={`w-full h-11 md:h-12 rounded-none bg-neutral-900 text-white text-[11px] tracking-[0.2em] uppercase
                  flex items-center justify-center gap-2 transition-transform duration-150
                  ${isAdding ? "scale-[0.98]" : "hover:bg-black"}`}
                onClick={handleAddToBag}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to bag
                  </>
                ) : (
                  <>Add to bag</>
                )}
              </Button>

              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setIsFavorited((v) => !v)}
                  className="flex-1 h-10 border border-neutral-300 rounded-none flex items-center justify-center gap-2 uppercase tracking-[0.16em] hover:border-neutral-900 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-neutral-900" : ""}`} />
                  Wishlist
                </button>
                <button className="flex-1 h-10 border border-neutral-300 rounded-none flex items-center justify-center gap-2 uppercase tracking-[0.16em] hover:border-neutral-900 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Product details */}
            <div className="border-t border-neutral-200 pt-6 space-y-3 text-sm text-neutral-600">
              <h3 className="text-xs uppercase tracking-[0.16em] text-neutral-700">
                Product details
              </h3>
              <ul className="space-y-1.5">
                {product.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
              <div className="pt-3 space-y-1 text-xs text-neutral-500">
                <p>3–5 business days delivery within Nigeria</p>
                <p>30-day return policy on unworn items</p>
                <p>Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm md:text-base uppercase tracking-[0.18em] text-neutral-700">
                You may also like
              </h2>
              <Link
                href="/shop"
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link key={rp.id} href={`/product/${rp.id}`} className="group">
                  <div className="space-y-2">
                    <div className="aspect-[3/4] bg-white border border-neutral-200 overflow-hidden">
                      <img
                        src={sbRender(rp.key, 480, 70)}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement
                          el.src = sbObject(rp.key)
                        }}
                      />
                    </div>
                    <p className="text-xs md:text-sm text-neutral-900 line-clamp-2">
                      {rp.name}
                    </p>
                    <p className="text-xs text-neutral-700">
                      ₦{rp.price.toLocaleString()}
                    </p>
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
