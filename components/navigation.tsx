"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { count } = useCart()
  const [currency, setCurrency] = useState<"NGN" | "USD" | "CAD" | "GBP">("NGN")

const currencyOptions = [
  { code: "NGN", label: "NGN (₦)" },
  { code: "USD", label: "USD ($)" },
  { code: "CAD", label: "CAD ($)" },
  { code: "GBP", label: "GBP (£)" },
]


  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left: Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="text-lg text-foreground hover:text-muted-foreground transition-colors font-light">
              Home
            </Link>
            <Link
              href="/shop"
              className="text-lg text-foreground hover:text-muted-foreground transition-colors font-light"
            >
              Shop
            </Link>
          </div>

          {/* Center: Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
          >
            <img
              src="/dbslogo.png"
              alt="DripBySoweto Logo"
              className="h-8 w-auto md:h-10 object-contain"
            />
          </Link>


          {/* Right: Icons */}
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex text-foreground hover:text-muted-foreground transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Currency Selector */}
            
            <div className="hidden sm:flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "NGN" | "USD" | "CAD" | "GBP")}
                className="bg-transparent text-sm text-foreground hover:text-muted-foreground border border-border/60 rounded-full px-3 py-1 pr-7 appearance-none cursor-pointer relative"
              >
                {currencyOptions.map((cur) => (
                  <option
                    key={cur.code}
                    value={cur.code}
                    className="text-foreground bg-background"
                  >
                    {cur.label}
                  </option>
                ))}
              </select>
            </div>


            {/* Cart */}
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-muted-foreground transition-colors" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold text-center leading-none">
                    {count}
                  </span>
                )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="hidden sm:block pb-4 border-t border-border">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-0 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none text-sm border-none"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-border pt-4">
            <Link
              href="/"
              className="block text-sm text-foreground hover:text-muted-foreground transition-colors font-light"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block text-sm text-foreground hover:text-muted-foreground transition-colors font-light"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-sm text-foreground hover:text-muted-foreground transition-colors font-light"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-sm text-foreground hover:text-muted-foreground transition-colors font-light"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
