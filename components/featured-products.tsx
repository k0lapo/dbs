"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FeaturedProducts() {
  const categories = [
    { name: "Sets", image: "latina" },
    { name: "Sportwears", image: "indoor" },
  ]

  // Newsletter state
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatus("idle")

    // very simple email check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }

    setStatus("loading")

    try {
      // 🔗 Hook this to your real backend later
      // Example:
      // const res = await fetch("/api/newsletter", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // })
      // if (!res.ok) throw new Error("Request failed")

      // For now, fake a successful request
      await new Promise((resolve) => setTimeout(resolve, 1200))

      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch (err) {
      setStatus("error")
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="bg-background py-0">
      {/* Category Carousels */}
      {categories.map((category, idx) => (
        <div key={category.name} className={`${idx === 0 ? "md:bg-muted" : "md:bg-background"}`}>
          <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className={`relative h-64 md:h-96 ${idx === 1 ? "md:order-2" : ""}`}>
                <img
                  src={`/${category.image}.jpg`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div
                className={`flex items-center justify-center py-8 md:py-0 md:h-96 px-6 sm:px-8 md:px-12 ${
                  idx === 0 ? "md:bg-muted" : "bg-background"
                } ${idx === 1 ? "md:order-1" : ""}`}
              >
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-light text-foreground">
                    {category.name}
                  </h3>
                  <Link href="/shop">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background font-light px-8 h-10 text-sm">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Newsletter Section – upgraded to feel like a real luxury brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground">
              Newsletter
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Stay ahead of the next drop
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get early access to new collections, private sales, and studio stories. No spam —
              just carefully curated updates from DripBySoweto.
            </p>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <div className="text-xs md:text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 inline-flex items-center justify-center gap-2 mx-auto">
              <span className="text-xs">●</span>
              <span>You’re in. Check your inbox for a welcome note.</span>
            </div>
          )}

          {status === "error" && (
            <div className="text-xs md:text-sm text-red-600 bg-red-50 border border-red-200 rounded-full px-4 py-2 inline-flex items-center justify-center gap-2 mx-auto">
              <span className="text-xs">!</span>
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubscribe}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto items-stretch sm:items-center">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === "error") {
                      setStatus("idle")
                      setError("")
                    }
                  }}
                  placeholder="Enter your email"
                  className="
                    peer w-full px-0 py-2 
                    border-b border-foreground/40 
                    bg-transparent text-foreground 
                    placeholder:text-muted-foreground/70 
                    focus:outline-none focus:border-foreground
                    text-sm transition-colors
                  "
                />
                <span className="pointer-events-none absolute -bottom-[2px] left-0 h-[1px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-200 peer-focus:scale-x-100" />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="
                  bg-foreground hover:bg-foreground/90 
                  text-background font-light 
                  px-8 h-10 text-sm whitespace-nowrap
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {status === "loading" ? "Joining..." : "Join the list"}
              </Button>
            </div>

            {status === "idle" && error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}

            <p className="text-[11px] text-muted-foreground/80 mt-2">
              By subscribing, you agree to receive emails from DripBySoweto. You can unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
