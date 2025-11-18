"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useState } from "react"

// Supabase helpers (to render your stored images fast)
const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const sbRender = (key: string, width = 300, q = 70) =>
  `${SB_URL}/storage/v1/render/image/public/product-images/${encodeURIComponent(key).replace(
    /%2F/g,
    "/"
  )}?width=${width}&quality=${q}&format=webp`
const sbObject = (key: string) =>
  `${SB_URL}/storage/v1/object/public/product-images/${encodeURIComponent(key).replace(/%2F/g, "/")}`

export default function CartPage() {
  const { items, setQty, removeItem, subtotal } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [promoError, setPromoError] = useState("")

  const discount = appliedCoupon ? Math.floor(subtotal * 0.1) : 0
  const shipping = subtotal > 50000 ? 0 : items.length ? 2000 : 0
  const tax = Math.floor((subtotal - discount) * 0.075)
  const total = subtotal - discount + shipping + tax

  const applyCoupon = () => {
    setPromoError("")
    const code = couponCode.trim().toLowerCase()
    if (code === "dbs10" || code === "welcome5") {
      setAppliedCoupon(code)
      setCouponCode("")
    } else {
      setPromoError("Invalid coupon code")
    }
  }

  const removeCoupon = () => setAppliedCoupon(null)

  /* EMPTY STATE – keep it luxe & simple */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="border-b border-border bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center space-y-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40">DBS STUDIO</p>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight">Your Bag is Empty</h1>
            <p className="text-sm md:text-base text-white/70 max-w-md mx-auto">
              Start building your look with curated pieces from the latest DBS drops.
            </p>
            <div className="pt-4">
              <Link href="/shop">
                <Button className="h-11 px-8 rounded-full bg-white text-black hover:bg-white/90 text-xs md:text-sm font-medium tracking-[0.16em] uppercase">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* LUX CART HERO */}
      <section className="border-b border-border bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40">DBS STUDIO</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
              Your Bag
            </h1>
            <p className="text-sm md:text-base text-white/70">
              {items.length} item{items.length > 1 ? "s" : ""} selected • Crafted for everyday luxury.
            </p>
          </div>
          <div className="text-xs md:text-sm text-white/70 space-y-1 md:text-right">
            <p>Free shipping on orders over ₦50,000</p>
            <p>1–3 day delivery within Nigeria</p>
            <p>Secure checkout & easy returns</p>
          </div>
        </div>
      </section>

      {/* CART CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 lg:gap-12">
          {/* CART ITEMS – turned into luxe cards */}
          <div className="space-y-4 md:space-y-6">
            {items.map((item) => {
              const key = item.imageKey || ""
              const src = SB_URL
                ? sbRender(key, 360, 70)
                : `https://source.unsplash.com/360x360/?${encodeURIComponent(item.name)}`

              return (
                <article
                  key={`${item.id}-${item.color ?? ""}-${item.size ?? ""}`}
                  className="flex gap-4 md:gap-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-4 md:p-5 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-all"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (SB_URL && key) (e.currentTarget as HTMLImageElement).src = sbObject(key)
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        <h3 className="font-medium text-base md:text-lg line-clamp-2">{item.name}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
                        {item.color ? item.color : "Selected"}{" "}
                        {item.size ? `• Size ${item.size}` : ""}
                      </p>
                      <p className="text-sm md:text-base font-semibold text-primary">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty(item.id, item.quantity - 1, { color: item.color, size: item.size })}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm md:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.quantity + 1, { color: item.color, size: item.size })}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & remove */}
                  <div className="flex flex-col items-end justify-between gap-3">
                    <p className="text-sm md:text-lg font-semibold text-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id, { color: item.color, size: item.size })}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1.5"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              )
            })}

            {/* Continue Shopping */}
            <div className="pt-2">
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full border-foreground/40 text-foreground hover:bg-foreground/5 bg-transparent text-xs md:text-sm tracking-[0.18em] uppercase"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* ORDER SUMMARY – glassy, premium card */}
          <aside className="space-y-6">
            {/* Promo */}
            <div className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-[0.18em]">
                Promo Code
              </h3>

              {appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-secondary/10 border border-secondary/70 p-3 rounded-xl">
                    <span className="font-semibold text-secondary uppercase text-xs md:text-sm">
                      {appliedCoupon}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">10% discount applied</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value)
                        setPromoError("")
                      }}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs md:text-sm"
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="h-10 px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                  <p className="text-[11px] text-muted-foreground">Try: DBS10 or WELCOME5</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-[0.18em]">
                  Order Summary
                </h3>
                <span className="text-xs text-muted-foreground">
                  {items.length} item{items.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3 pb-4 border-b border-border/60">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Discount</span>
                    <span className="text-secondary font-medium">
                      -₦{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7.5%)</span>
                  <span className="text-foreground font-medium">₦{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-[0.18em]">
                  Total
                </span>
                <span className="text-xl font-semibold text-primary">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              {shipping === 0 && subtotal > 50000 && (
                <p className="text-[11px] text-secondary bg-secondary/10 border border-secondary/40 p-2 rounded-full text-center mt-2">
                  🎉 Free shipping unlocked on this order
                </p>
              )}
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout">
              <Button className="w-full h-12 rounded-full bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs md:text-sm tracking-[0.18em] uppercase">
                Proceed to Checkout
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="space-y-3 pt-2 text-xs md:text-sm">
              <div className="flex gap-3">
                <span className="text-primary shrink-0">✓</span>
                <span className="text-muted-foreground">Secure payment processing</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary shrink-0">✓</span>
                <span className="text-muted-foreground">1–3 day delivery within Nigeria</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary shrink-0">✓</span>
                <span className="text-muted-foreground">30-day return policy</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}
