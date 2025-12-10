"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useState } from "react"

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
  const shippingLabel = "Calculated at checkout"
  const tax = 0
  const total = subtotal - discount + tax

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

  /* EMPTY STATE */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="pt-32 pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-light">Your Bag is Empty</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Build your look with curated premium pieces.
          </p>
          <div className="mt-6">
            <Link href="/shop">
              <Button className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-foreground/80 text-xs md:text-sm uppercase tracking-[0.15em]">
                Explore Collection
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* CLEAN HEADER */}
      <section className="pt-28 pb-6 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
            Your Bag
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} item{items.length > 1 ? "s" : ""} — Review your selections before checkout.
          </p>
        </div>
      </section>

      {/* CART CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 lg:gap-12">

          {/* CART ITEMS */}
          <div className="space-y-5">
            {items.map((item) => {
              const key = item.imageKey || ""
              const src = sbRender(key, 360, 70)

              return (
                <article
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-full sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = sbObject(key))}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-medium text-base md:text-lg text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-muted-foreground tracking-wide">
                        {item.color} • {item.size}
                      </p>

                      <p className="text-base font-semibold text-primary">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty(item.id, item.quantity - 1, { color: item.color, size: item.size })}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-6 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => setQty(item.id, item.quantity + 1, { color: item.color, size: item.size })}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex flex-row sm:flex-col justify-between items-end gap-3">
                    <div className="text-base md:text-lg font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeItem(item.id, { color: item.color, size: item.size })}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              )
            })}

            {/* Continue Shopping */}
            <Link href="/shop">
              <Button
                variant="outline"
                className="w-full h-11 rounded-full border-foreground/40 text-foreground hover:bg-foreground/5 text-xs md:text-sm uppercase tracking-[0.15em]"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* SUMMARY */}
          <aside className="space-y-6 lg:sticky lg:top-28">

            {/* Promo Code */}
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                Promo Code
              </h3>

              {appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-secondary/10 border border-secondary/50 px-4 py-2 rounded-xl">
                    <span className="text-secondary font-semibold uppercase">{appliedCoupon}</span>
                    <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                  <p className="text-xs text-muted-foreground">10% discount applied.</p>
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
                      className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="h-10 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wide"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-6 space-y-5">
              <h3 className="text-sm font-medium uppercase tracking-[0.18em]">Order Summary</h3>

              <div className="space-y-3 border-b border-border/60 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Discount</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingLabel}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs md:text-sm uppercase tracking-[0.2em]">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>

          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}
