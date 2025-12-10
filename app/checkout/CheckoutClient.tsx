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

// ─── Helpers for business-day delivery window ───────────────────────────

function addBusinessDays(base: Date, days: number): Date {
  const result = new Date(base)
  let added = 0

  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay() // 0 = Sun, 6 = Sat
    if (day !== 0 && day !== 6) {
      added++
    }
  }

  return result
}

function formatDeliveryWindow(paymentDate: Date): string {
  const start = addBusinessDays(paymentDate, 3)
  const end = addBusinessDays(paymentDate, 5)

  const startMonth = start.toLocaleString("en-NG", { month: "long" })
  const endMonth = end.toLocaleString("en-NG", { month: "long" })

  const startDay = start.getDate()
  const endDay = end.getDate()
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  const sameMonthAndYear = startMonth === endMonth && startYear === endYear

  if (sameMonthAndYear) {
    return `${startMonth} ${startDay}–${endDay}, ${startYear}`
  }

  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`
}

// ─── Country / State config ─────────────────────────────────────────────

type CountryConfig = {
  code: string
  name: string
  region: "nigeria" | "international"
  states: string[]
}

const COUNTRIES: CountryConfig[] = [
  {
    code: "NG",
    name: "Nigeria",
    region: "nigeria",
    states: [
      "Abia",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "FCT",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    region: "international",
    states: ["Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Volta"],
  },
  {
    code: "GB",
    name: "United Kingdom",
    region: "international",
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  {
    code: "US",
    name: "United States",
    region: "international",
    // ✅ Full US states list
    states: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "District of Columbia",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    region: "international",
    states: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  },
  {
    code: "ZA",
    name: "South Africa",
    region: "international",
    states: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"],
  },
]

// Dynamic labels so address feels native per country
type AddressLabels = {
  stateLabel: string
  zipLabel: string
  cityLabel: string
}

function getAddressLabels(countryCode: string): AddressLabels {
  switch (countryCode) {
    case "US":
      return {
        stateLabel: "State",
        zipLabel: "ZIP Code",
        cityLabel: "City",
      }
    case "GB":
      return {
        stateLabel: "County / Region",
        zipLabel: "Postcode",
        cityLabel: "Town / City",
      }
    case "CA":
      return {
        stateLabel: "Province",
        zipLabel: "Postal Code",
        cityLabel: "City",
      }
    case "GH":
    case "ZA":
      return {
        stateLabel: "Region / Province",
        zipLabel: "Postal Code",
        cityLabel: "City / Town",
      }
    case "NG":
    default:
      return {
        stateLabel: "State",
        zipLabel: "Postal Code",
        cityLabel: "City",
      }
  }
}

// Shipping logic based on region / state
function computeShipping(countryCode: string, state: string): { amount: number; label: string; note?: string } {
  const country = COUNTRIES.find((c) => c.code === countryCode)

  if (!country) {
    return {
      amount: 0,
      label: "Select country for shipping estimate",
    }
  }

  if (country.region === "international") {
    return {
      amount: 0,
      label: "To be confirmed by courier",
      note: "International shipping will be arranged via courier after checkout.",
    }
  }

  if (!state) {
    return {
      amount: 0,
      label: "Select state for shipping estimate",
    }
  }

  if (state === "Lagos") {
    const amount = 8000 // within Lagos, under 10k
    return {
      amount,
      label: `₦${amount.toLocaleString()} (within Lagos)`,
    }
  }

  const southWestStates = ["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"]
  const isSouthWest = southWestStates.includes(state)
  const amount = isSouthWest ? 9000 : 10000 // never above 10k

  return {
    amount,
    label: `₦${amount.toLocaleString()} (within Nigeria)`,
  }
}

// ─── Paystack key ───────────────────────────────────────────────────────

const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_test_key_here"

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
    country: "NG",
    state: "",
    zipCode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const [deliveryWindow, setDeliveryWindow] = useState<string | null>(null)

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const selectedCountry = COUNTRIES.find((c) => c.code === formData.country) || COUNTRIES[0]
  const availableStates = selectedCountry.states
  const addressLabels = getAddressLabels(formData.country)

  const shippingInfo = computeShipping(formData.country, formData.state)
  const shippingAmount = shippingInfo.amount
  const orderTotal = subtotal + shippingAmount

  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen bg-background pt-16 md:pt-20">
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

    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: "",
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.country &&
      (selectedCountry.region === "nigeria" ? formData.state : true) &&
      formData.email
    ) {
      setStep("payment")
    } else {
      alert("Please fill out all required shipping fields.")
    }
  }

  const paystackConfig = {
    reference: `${Date.now()}`,
    email: formData.email || "guest@dripbysoweto.com",
    amount: Math.round(orderTotal * 100),
    currency: "NGN",
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state ? formData.state + ", " : ""}${selectedCountry.name}`,
      items_count: itemsCount,
      shipping_amount: shippingAmount,
      shipping_label: shippingInfo.label,
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

          const ref = reference?.reference || reference?.trxref || null
          setOrderRef(ref)
          setDeliveryWindow(formatDeliveryWindow(new Date()))

          try {
            const res = await fetch("/api/admin/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paystackReference: ref,
                email: formData.email,
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.state ? formData.state + ", " : ""}${selectedCountry.name}`,
                totalAmount: orderTotal,
                shippingAmount,
                shippingLabel: shippingInfo.label,
                items: items.map((item) => ({
                  productId: String(item.id),
                  name: item.name,
                  sku: (item as any).sku || null,
                  unitPrice: item.price,
                  quantity: item.quantity,
                  color: (item as any).color || null,
                  size: (item as any).size || null,
                })),
              }),
            })

            if (!res.ok) {
              const errorBody = await res.json().catch(() => null)
              console.error("❌ Failed to save order:", res.status, errorBody)
            } else {
              const json = await res.json()
              console.log("✅ Order saved:", json)
            }
          } catch (err) {
            console.error("Failed to save order to backend:", err)
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
      <main className="min-h-screen bg-background pt-16 md:pt-20">
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
                <p className="text-lg font-bold text-foreground">
                  {deliveryWindow ?? "3–5 working days"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-lg font-bold text-primary">₦{orderTotal.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              A confirmation email has been sent to {formData.email || "your email"}.
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
    <main className="min-h-screen bg-background pt-16 md:pt-20">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Checkout</h1>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your delivery details. We ship within Nigeria and worldwide via trusted couriers.
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

                    {/* Country / State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required={selectedCountry.region === "nigeria" || availableStates.length > 0}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="">
                          {availableStates.length
                            ? `Select ${addressLabels.stateLabel}`
                            : "Region / State (optional)"}
                        </option>
                        {availableStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
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
                        placeholder={addressLabels.cityLabel}
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder={addressLabels.zipLabel}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="text-xs text-muted-foreground flex items-center">
                        Shipping: {shippingInfo.label}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-[0.15em] uppercase"
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment with Paystack */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Payment</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    You’ll be redirected to{" "}
                    <span className="font-semibold text-foreground">Paystack</span> to complete your payment
                    in Naira. Your card details are processed securely by Paystack — we never see or store them.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground bg-muted rounded-lg p-4 border border-border">
                    <p>• Payment methods: cards, bank transfer, USSD (via Paystack)</p>
                    <p>• Currency: NGN</p>
                    <p>• Billing email: {formData.email || "Provided at shipping"}</p>
                    {shippingInfo.note && <p>• Shipping: {shippingInfo.note}</p>}
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
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? "Connecting to Paystack..." : "Pay with Paystack"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit sticky top-24 border border-border rounded-lg p-6 bg-muted/60 space-y-6">
            <h3 className="font-semibold text-lg text-foreground">Order Summary</h3>

            <div className="space-y-4 pb-4 border-b border-border">
              {items.map((item) => (
                <div
                  key={`${item.id}-${(item as any).color ?? ""}-${(item as any).size ?? ""}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-foreground">
                    {item.name}
                    {(item as any).size ? ` • ${(item as any).size}` : ""}
                    {(item as any).color ? ` • ${(item as any).color}` : ""} × {item.quantity}
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
                  {shippingAmount > 0 ? `₦${shippingAmount.toLocaleString()}` : shippingInfo.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">Included in price</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">₦{orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t border-border">
              <p>✓ Paystack Secure Payment (PCI-DSS compliant)</p>
              <p>✓ 30-day return policy on unworn items</p>
              <p>✓ 3–5 working days delivery in Nigeria after dispatch</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
