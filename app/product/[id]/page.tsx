"use client"

import { useMemo, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus, Check, ArrowLeft, ShieldCheck, Truck, RefreshCcw, ChevronDown } from "lucide-react"
import { useCart } from "@/components/cart-provider"

/** ================== CONSTANTS & DATA ================== */
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
  { id: 13, name: "DBS Corduroy Hat",          price: "₦120,000", category: "accessories", image: "suedehat" },
  { id: 14, name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", image: "jean snapback" },
  { id: 15, name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  image: "2piece hoodie" },
  
  /* --- NEW DROPS ADDED BELOW --- */
  
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
]



/** ================== IMAGE HELPERS ================== */
const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const BUCKET = "product-images"

const getRawUrl = (path: string) => 
  `${SB_URL}/storage/v1/object/public/${BUCKET}/${path.replace(/^\/+/, "")}`

const getRenderUrl = (path: string, width = 1200, q = 75) => 
  `${SB_URL}/storage/v1/render/image/public/${BUCKET}/${path.replace(/^\/+/, "")}?width=${width}&quality=${q}&format=webp`

const buildCandidateKeys = (baseName: string) => [
  `products/${baseName}.jpg`,
  `products/${baseName}.jpeg`,
  `products/${baseName}.png`,
  `products/${baseName}.JPG`,
]

const parseNairaToNumber = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0
const titleCase = (s: string) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())

/** ================== HYDRATION ================== */
const hydrate = (p: (typeof allProducts)[number]) => ({
  ...p,
  category: titleCase(p.category),
  priceNum: parseNairaToNumber(p.price),
  description: `${p.name} — engineered for the modern silhouette. Features reinforced stitching and premium textile selection from the DBS archive.`,
  details: ["Hand-finished edges", "Signature DBS hardware", "Custom-developed fabric", "Dry clean recommended"],
  sizes: p.category === "tracksuits" ? ["XS", "S", "M", "L", "XL"] : p.category === "accessories" ? ["O/S"] : ["S", "M", "L", "XL"],
  colors: ["Onyx Black", "Optic White", "Slate"],
})

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const id = Number.parseInt(params.id as string)
  const [isAdding, setIsAdding] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isStickyVisible, setIsStickyVisible] = useState(false)
  const { addItem } = useCart()

  const base = allProducts.find((p) => p.id === id) || allProducts[0]
  const product = hydrate(base)
  
  // Gallery logic
  const candidateKeys = buildCandidateKeys(base.image)
  const [imgUrl, setImgUrl] = useState(getRenderUrl(candidateKeys[0]))
  const [imgMode, setImgMode] = useState<"render" | "raw">("render")
  const [imgKeyIdx, setImgKeyIdx] = useState(0)

  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsStickyVisible(window.scrollY > 500)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleImgError = () => {
    if (imgMode === "render") {
      setImgMode("raw")
      setImgUrl(getRawUrl(candidateKeys[imgKeyIdx]))
    } else if (imgKeyIdx < candidateKeys.length - 1) {
      const nextIdx = imgKeyIdx + 1
      setImgKeyIdx(nextIdx)
      setImgMode("render")
      setImgUrl(getRenderUrl(candidateKeys[nextIdx]))
    } else {
      setImgUrl("https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=1200")
    }
  }

  const related = useMemo(() => 
    allProducts.filter((p) => p.category.toLowerCase() === base.category.toLowerCase() && p.id !== base.id).slice(0, 4)
  , [base.id, base.category])

  const handleAddToBag = () => {
    setIsAdding(true)
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.priceNum, 
      quantity, 
      size: selectedSize, 
      color: "Onyx", 
      imageKey: candidateKeys[0] 
    })
    setTimeout(() => setIsAdding(false), 800)
  }

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#090909] text-foreground">
      <Navigation />

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-24 pb-32">
        {/* BREADCRUMB */}
        <div className="mb-12">
          <Link href="/shop" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return to Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl shadow-black/5">
              <img
                key={imgUrl}
                src={imgUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-700"
                onError={handleImgError}
              />
              
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={() => { setImgKeyIdx(0); setImgMode("render"); setImgUrl(getRenderUrl(candidateKeys[0])) }}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white hover:text-black transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setImgKeyIdx(0); setImgMode("render"); setImgUrl(getRenderUrl(candidateKeys[0])) }}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-white hover:text-black transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-widest">Limited Release</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{product.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-foreground ">
                {product.name}<span className="not-italic font-normal">.</span>
              </h1>
              <p className="text-2xl font-light tracking-tight text-foreground/80">₦{product.priceNum.toLocaleString()}</p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-md">
              {product.description}
            </p>

            <div className="space-y-8">
              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Select Size</span>
                  <button className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 opacity-50 hover:opacity-100">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-12 min-w-[3rem] px-4 rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === s ? "bg-black text-white border-black" : "bg-transparent border-border hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="flex gap-4">
                <div className="flex items-center bg-muted/50 rounded-2xl px-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-3 hover:text-primary"><Minus className="w-4 h-4"/></button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="p-3 hover:text-primary"><Plus className="w-4 h-4"/></button>
                </div>
                <Button
                  onClick={handleAddToBag}
                  className={`flex-1 h-14 rounded-2xl text-[14px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                    isAdding ? "bg-green-600 hover:bg-green-600 scale-95" : "bg-black hover:bg-black/90"
                  }`}
                >
                  {isAdding ? <><Check className="w-4 h-4 mr-2" /> Added</> : "Add to Vault"}
                </Button>
              </div>

              {/* Wishlist/Share */}
              <div className="flex gap-4">
                <button onClick={() => setIsFavorited(!isFavorited)} className="flex-1 h-14 rounded-2xl border border-border flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors">
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 stroke-red-500" : ""}`} /> Wishlist
                </button>
                <button className="flex-1 h-14 rounded-2xl border border-border flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border/40">
              <div className="text-center space-y-2">
                <Truck className="w-5 h-5 mx-auto opacity-40" />
                <p className="text-[9px] font-bold uppercase tracking-tighter">Fast Shipping</p>
              </div>
              <div className="text-center space-y-2">
                <ShieldCheck className="w-5 h-5 mx-auto opacity-40" />
                <p className="text-[9px] font-bold uppercase tracking-tighter">Secure Pay</p>
              </div>
              <div className="text-center space-y-2">
                <RefreshCcw className="w-5 h-5 mx-auto opacity-40" />
                <p className="text-[9px] font-bold uppercase tracking-tighter">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED SECTION */}
        {related.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="flex items-end justify-between border-b border-border/40 pb-6">
              <h2 className="text-3xl font-light tracking-tighter uppercase italic">You May Also Like<span className="not-italic">.</span></h2>
              <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100">Explore All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((rp) => (
                <Link key={rp.id} href={`/product/${rp.id}`} className="group space-y-4">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted">
                    <img 
                      src={getRenderUrl(`products/${rp.image}.jpg`, 600)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { e.currentTarget.src = getRawUrl(`products/${rp.image}.jpg`) }}
                    />
                  </div>
                  <div className="space-y-1 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-tight line-clamp-1">{rp.name}</h3>
                    <p className="text-sm font-light opacity-70">₦{parseNairaToNumber(rp.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MOBILE STICKY BAR */}
      {isStickyVisible && (
        <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden p-4 pb-8 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-border/40 animate-in fade-in slide-in-from-bottom-full duration-500">
          <div className="max-w-md mx-auto flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground line-clamp-1">{product.name}</p>
              <p className="text-sm font-bold tracking-tight">₦{product.priceNum.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 w-2/3">
              <div className="relative">
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="appearance-none h-12 pl-3 pr-8 rounded-xl border border-border bg-transparent text-xs font-bold focus:outline-none">
                  {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
              </div>
              <Button onClick={handleAddToBag} className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${isAdding ? "bg-green-600" : "bg-black"}`}>
                {isAdding ? <Check className="w-4 h-4" /> : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}