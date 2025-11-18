"use client"

import Link from "next/link"
import { Instagram, X, Facebook, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="font-light text-lg text-foreground">DripBySoweto</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Premium luxury streetwear, proudly African.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="font-light text-sm text-foreground">Shop</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
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

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-light text-sm text-foreground">Company</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
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

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-light text-sm text-foreground">Follow</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/dbsbysoweto_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://X.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-light">
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

      <a
        href="https://wa.me/2348000000000?text=Hello%20DripBySoweto%2C%20I%20have%20a%20question"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-40"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </footer>
  )
}
