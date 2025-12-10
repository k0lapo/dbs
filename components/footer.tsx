"use client"

import Link from "next/link"
import { Instagram, X, Facebook, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background/95 border-t border-border/60 backdrop-blur-xl mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-18">
        {/* TOP AREA — Mobile centered / Desktop grid */}
        <div
          className="
            grid grid-cols-2 md:grid-cols-4 
            gap-8 md:gap-12 mb-10 
            text-center md:text-left
          "
        >
          {/* BRAND + LOGO with breathing hover */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start space-y-4">
            <div className="relative inline-flex items-center justify-center group">
              {/* Soft glow halo */}
              <div className="
                absolute -inset-3 
                rounded-full 
                bg-foreground/10 
                blur-xl 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity 
                duration-500 
                ease-out
              " />
              {/* Logo itself */}
              <img
                src="/dbslogo.png"
                alt="DripBySoweto Logo"
                className="
                  relative
                  h-8 md:h-10 
                  object-contain
                  transition-transform 
                  duration-500 
                  ease-out
                  group-hover:scale-105
                  group-hover:-translate-y-0.5
                  group-hover:drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]
                "
              />
            </div>

            {/* SHORT TEXT – RESPONSIVE */}
            <p className="text-[11px] text-muted-foreground leading-relaxed font-light max-w-xs md:hidden">
              Premium African luxury streetwear.
            </p>

            <p className="hidden md:block text-[11px] text-muted-foreground leading-relaxed font-light max-w-xs">
              Premium luxury streetwear, proudly African. Built for cities, stories, and main-character moments.
            </p>
          </div>

          {/* SHOP */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/70">
              Shop
            </h4>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-foreground transition-colors font-light">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-foreground transition-colors font-light">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/70">
              Company
            </h4>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors font-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors font-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors font-light">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL / EMAIL */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/70">
              Follow
            </h4>

            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="https://instagram.com/dbsbysoweto_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:border-foreground hover:bg-muted/40 transition-colors"
              >
                <Instagram className="w-4 h-4 text-foreground/80" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:border-foreground hover:bg-muted/40 transition-colors"
              >
                <X className="w-4 h-4 text-foreground/80" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:border-foreground hover:bg-muted/40 transition-colors"
              >
                <Facebook className="w-4 h-4 text-foreground/80" />
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground font-light max-w-[200px]">
              Wholesale & collabs:{" "}
              <span className="underline underline-offset-4">
                dbsbysowetong09@gmail.com
              </span>
            </p>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div
          className="
            border-t border-border/60 pt-6 
            flex flex-col sm:flex-row 
            justify-between items-center gap-3 
            text-[11px] text-muted-foreground font-light 
            text-center
          "
        >
          <p>&copy; 2025 DripBySoweto. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/2348168224485?text=Hello%20DripBySoweto%2C%20I%20want%20to%20place%20an%20order."
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 right-4 sm:bottom-8 sm:right-8
          w-12 h-12 rounded-full
          bg-foreground text-background
          flex items-center justify-center
          shadow-[0_10px_35px_rgba(0,0,0,0.35)]
          border border-border/70
          hover:translate-y-0.5 
          transition-all duration-200
          z-40
        "
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  )
}
