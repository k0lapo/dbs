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

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Left: Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/shop"
              className="text-xs tracking-[0.3em] uppercase text-foreground/80 hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-xs tracking-[0.3em] uppercase text-foreground/60 hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>

          {/* Center: Logo – always centered */}
          <Link
            href="/"
            className="
              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              flex items-center justify-center
            "
          >
            <img
              src="/dbslogo.png"
              alt="DripBySoweto Logo"
              className="h-7 md:h-9 lg:h-10 object-contain"
            />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop search toggle */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="hidden sm:flex text-foreground/80 hover:text-foreground transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Desktop currency selector */}
            <div className="hidden sm:flex items-center">
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as "NGN" | "USD" | "CAD" | "GBP")
                }
                className="bg-transparent text-[14px] md:text-xs tracking-[0.2em] uppercase text-foreground/80 border border-border/60 rounded-full px-3 py-1 pr-7 appearance-none cursor-pointer"
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
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground/90 group-hover:text-foreground transition-colors" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold leading-none">
                  {count}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-foreground/90 hover:text-foreground transition-colors"
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop search bar under nav */}
        {isSearchOpen && (
          <div className="hidden sm:block pb-3 border-t border-border/60">
            <div className="flex items-center gap-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search DBS Studio"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-16 z-40 
          origin-top transform transition-all duration-300 
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}
        `}
      >
        <div className="bg-background/98 backdrop-blur-2xl border-t border-border/60">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-8 space-y-6">
            {/* Mobile search inside menu */}
            <div className="border border-border/70 rounded-full px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search collection"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Mobile currency selector */}
            <div className="flex">
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as "NGN" | "USD" | "CAD" | "GBP")
                }
                className="w-full bg-transparent text-[14px] tracking-[0.24em] uppercase text-foreground/80 border border-border/70 rounded-full px-3 py-2 appearance-none cursor-pointer"
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

            {/* Main links */}
            <div className="space-y-2">
              <MobileLink href="/" index="02" onClick={closeMenu}>
                Home
              </MobileLink>
              
              <MobileLink href="/shop" index="01" onClick={closeMenu}>
                Shop
              </MobileLink>
              
              <MobileLink href="/about" index="03" onClick={closeMenu}>
                About
              </MobileLink>
              <MobileLink href="/contact" index="04" onClick={closeMenu}>
                Contact
              </MobileLink>
            </div>

            {/* Divider + brand info */}
            <div className="pt-4 border-t border-border/60 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
              <p className="uppercase tracking-[0.3em] text-foreground/80">
                DBS Studio
              </p>
              <p>Premium streetwear. Limited drops. Designed to live outside the algorithm.</p>
              <p className="text-foreground/80">
                Support:{" "}
                <span className="underline underline-offset-4">
                  dbsbysowetong09@gmail.com
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

/**
 * MobileLink – keeps mobile menu items consistent + luxe
 */
function MobileLink({
  href,
  children,
  index,
  onClick,
}: {
  href: string
  children: React.ReactNode
  index: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-3 py-3 bg-muted/30 hover:bg-muted/60 transition-colors"
    >
      <span className="text-xs tracking-[0.28em] uppercase text-foreground">
        {children}
      </span>
      <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
        {index}
      </span>
    </Link>
  )
}
