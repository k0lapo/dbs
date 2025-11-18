"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
import { usePaystackPayment } from "react-paystack"
import { useCart } from "@/components/cart-provider"

export default function CheckoutPage() {
  const { items, subtotal } = useCart()

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderRef, setOrderRef] = useState<string | null>(null)

  // ─── Derive order numbers from REAL CART ──────────────────────────────
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = subtotal > 50000 ? 0 : items.length ? 2000 : 0
  const orderTotal = subtotal + shipping // tax can be added later if needed

  // If someone hits /checkout with an empty cart
  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some DBS pieces to your cart before checking out.
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Go to Shop
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.email
    ) {
      setStep("payment")
    }
  }

  // ─── PAYSTACK CONFIG (using REAL orderTotal) ──────────────────────────
  const paystackConfig = {
    reference: `${Date.now()}`, // unique per session
    email: formData.email || "guest@dripbysoweto.com",
    amount: orderTotal * 100, // Paystack expects kobo
    currency: "NGN",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    metadata: {
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state}`,
      items_count: itemsCount,
    },
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      alert("Please provide a valid email in the shipping step before paying.")
      return
    }

    setIsProcessing(true)

    try {
      initializePayment({
        onSuccess: async (reference: any) => {
          setIsProcessing(false)
          const ref =
            reference?.reference ||
            reference?.trxref ||
            reference?.trxref ||
            null

          setOrderRef(ref)

          // ── TALK TO SUPABASE BACKEND VIA API ROUTE ───────────────────
          try {
            await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paystackReference: reference.reference,
              email: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`.trim(),
              shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
              totalAmount: orderTotal,
              items: cartItems.map((item) => ({
                productId: String(item.id),
                name: item.name,
                sku: item.sku,              // if you have it in cart
                unitPrice: item.price,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
              })),
            }),
          })

          } catch (err) {
            console.error("Failed to save order to Supabase:", err)
          }

          setStep("confirmation")
        },
        onClose: () => {
          setIsProcessing(false)
        },
      })
    } catch (err) {
      setIsProcessing(false)
      console.error("Paystack initialization error:", err)
      alert("Unable to initialize payment. Please try again.")
    }
  }

  // ─── CONFIRMATION VIEW ────────────────────────────────────────────────
  if (step === "confirmation") {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your payment was received successfully.
            </p>

            <div className="bg-muted border border-border rounded-lg p-6 space-y-4 text-left mt-8">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                {/* You can later replace this with the real order_number from Supabase */}
                <p className="text-lg font-bold text-foreground">#DBS-{new Date().getTime()}</p>
              </div>
              {orderRef && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment Reference</p>
                  <p className="text-sm font-mono text-foreground break-all">{orderRef}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg font-bold text-foreground">November 3–5, 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-lg font-bold text-primary">₦{orderTotal.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              A confirmation email has been sent to {formData.email || "your email"}. You can track your
              order in your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-foreground text-foreground hover:bg-muted bg-transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // ─── MAIN CHECKOUT FLOW ───────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Checkout</h1>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    step !== "shipping"
                      ? "bg-secondary text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {step !== "shipping" ? "✓" : "1"}
                </div>
                <span className={step === "shipping" ? "text-foreground" : "text-muted-foreground"}>
                  Shipping
                </span>
              </div>
              <span className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    step === "payment"
                      ? "bg-primary text-primary-foreground"
                      : step === "confirmation"
                      ? "bg-secondary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step === "confirmation" ? "✓" : "2"}
                </div>
                <span className={step === "payment" ? "text-foreground" : "text-muted-foreground"}>
                  Payment
                </span>
              </div>
              <span className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    step === "confirmation"
                      ? "bg-secondary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <span className={step === "confirmation" ? "text-foreground" : "text-muted-foreground"}>
                  Confirmation
                </span>
              </div>
            </div>

            {/* Shipping Form */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your delivery details. We ship within Nigeria and selected regions.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Plateau">Plateau</option>
                      </select>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Postal Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment with Paystack */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Payment</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    You’ll be redirected to{" "}
                    <span className="font-semibold text-foreground">Paystack</span> to complete your payment in Naira.
                    Your card details are processed securely by Paystack — we never see or store them.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground bg-muted rounded-lg p-4 border border-border">
                    <p>• Payment methods: cards, bank transfer, USSD (via Paystack)</p>
                    <p>• Currency: NGN</p>
                    <p>• Billing email: {formData.email || "Provided at shipping"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep("shipping")}
                    variant="outline"
                    className="flex-1 border-foreground text-foreground hover:bg-muted"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing || !formData.email}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold disabled:opacity-50"
                  >
                    {isProcessing ? "Connecting to Paystack..." : "Pay with Paystack"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit sticky top-20 border border-border rounded-lg p-6 bg-muted space-y-6">
            <h3 className="font-bold text-lg text-foreground">Order Summary</h3>

            <div className="space-y-4 pb-4 border-b border-border">
              {items.map((item) => (
                <div key={`${item.id}-${item.color ?? ""}-${item.size ?? ""}`} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.name}
                    {item.size ? ` • ${item.size}` : ""}
                    {item.color ? ` • ${item.color}` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">Calculated at payment</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₦{orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t border-border">
              <p>✓ Paystack Secure Payment (PCI-DSS compliant)</p>
              <p>✓ 30-Day Money Back Guarantee</p>
              <p>✓ Fast & Secure Checkout</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
