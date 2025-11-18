"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/inventory", label: "Inventory", icon: "📈" },
    { href: "/admin/orders", label: "Orders", icon: "🛒" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-foreground/10 bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-light text-foreground">DripBySoweto Admin</h1>
          <Link href="/">
            <Button variant="ghost" className="text-sm font-light">
              ← Back to Store
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 border-r border-foreground/10 bg-muted">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full text-left px-4 py-3 text-sm font-light transition-colors rounded ${
                      isActive ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/10"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
