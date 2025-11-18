import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"

export const metadata: Metadata = {
  title: "DripBySoweto | Premium Luxury Streetwear",
  description:
    "Luxury streetwear blending bold creativity, premium quality, and authentic African street culture. Shop exclusive pieces that redefine urban fashion.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
