"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

const allProducts = [
  { id: 1,  name: "DBS Sublimated Tracksuits",          price: "₦170,000", category: "tracksuits",  image: "track" },
  { id: 2,  name: "DBS Nylon Tracksuits",               price: "₦170,000", category: "tracksuits",  image: "sets" },
  { id: 3,  name: "DBS Christ De Savior T-shirt",       price: "₦100,000", category: "tops",        image: "dbs shirt white" },
  { id: 4,  name: "DBS raglan CropTop for ladies",      price: "₦50,000", category: "tops",        image: "raglan" },
  { id: 5,  name: "Soweto ladies CropTops",             price: "₦50,000", category: "tops",        image: "crop tank" },
  { id: 6,  name: "DripBySoweto Club members Jersey",   price: "₦120,000", category: "tops",        image: "jersey" },
  { id: 7,  name: "DBS Crzy Armless",                   price: "₦50,000", category: "tops",        image: "JS1" },
  { id: 8,  name: "DBS Christ D Savior Crop armless",   price: "₦30,000", category: "tops",        image: "tank" },
  { id: 9,  name: "DBS Double layer Jean",              price: "70,000", category: "bottoms",     image: "ascension front" },
  { id: 10, name: "DBS Ascension Shirt",                price: "₦100,000", category: "tops",        image: "ascension back" },
  { id: 11, name: "DripBySoweto Nylon Short",           price: "₨40,000".replace("₨","₦"), category: "bottoms",     image: "shorts" },
  { id: 12, name: "Soweto Arts Embroidery jorts",       price: "70,000", category: "bottoms",     image: "jean jorts" },
  { id: 13, name: "DBS Embroidered Suede Hat",          price: "₦100,000", category: "accessories", image: "suede" },
  { id: 14, name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", image: "jean snapback" },
  { id: 15, name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  image: "2piece hoodie" },
]


const categories = [
  { value: "all", label: "All Products" },
  { value: "tracksuits", label: "Tracksuits" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "accessories", label: "Accessories" },
]

const mobileSections = [
  { value: "tracksuits", label: "Shop Tracksuits" },
  { value: "tops", label: "Shop Tops" },
  { value: "bottoms", label: "Shop Bottoms" },
  { value: "accessories", label: "Shop Accessories" },
]

// shared image fallback
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.currentTarget as HTMLImageElement
  if (target.src.endsWith(".jpg")) {
    target.src = `/images/${target.alt}.jpeg`
  } else if (target.src.endsWith(".jpeg")) {
    target.src = `/images/${target.alt}.png`
  } else {
    target.src = "/placeholder.jpg"
  }
}

export default function NewDropsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory)

  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-balance tracking-tight">
            Featured Collections
          </h2>
        </div>

        {/* -------- MOBILE LAYOUT (stacked, split by category) -------- */}
        <div className="md:hidden space-y-10">
          {mobileSections.map((section) => {
            const products = allProducts.filter((p) => p.category === section.value).slice(0, 4)
            if (products.length === 0) return null

            return (
              <div key={section.value} className="space-y-4">
                {/* Section header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light text-foreground">{section.label}</h3>
                  <Link href="/shop" className="text-xs font-medium text-foreground/70 underline-offset-4 hover:underline">
                    View all
                  </Link>
                </div>

                {/* 2 per row on mobile */}
                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="group">
                      <div className="space-y-2">
                        <div className="relative aspect-3/4 bg-muted overflow-hidden">
                          <img
                            src={`/${product.image}.jpg`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={handleImgError}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[0.75rem] font-light text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[0.8rem] font-light text-foreground/80">{product.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Mobile "View all products" CTA — upgraded for better UX */}
          <div className="flex justify-center pt-8">
            <Link href="/shop" className="w-full px-6">
              <Button
                variant="outline"
                className="
                  w-full h-14 
                  border-2 border-foreground 
                  text-foreground 
                  hover:bg-foreground hover:text-background 
                  transition-all 
                  font-medium tracking-wide
                  rounded-none
                "
              >
                VIEW FULL COLLECTION
              </Button>
            </Link>
          </div>

        </div>

        {/* -------- DESKTOP / TABLET LAYOUT (filters + big grid) -------- */}
        <div className="hidden md:block">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-sm font-light transition-all ${
                  selectedCategory === cat.value
                    ? "bg-foreground text-background"
                    : "border border-foreground text-foreground hover:bg-foreground/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid – 2 on small, 3 on md, 5 on lg */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="space-y-3 md:space-y-4">
                  <div className="relative aspect-3/4 bg-muted overflow-hidden">
                    <img
                      src={`/${product.image}.jpg`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImgError}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm md:text-base font-light text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base font-light text-foreground">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All */}
          <div className="flex justify-center mt-12">
            <Link href="/shop">
              <Button
                variant="outline"
                className="border-foreground text-foreground hover:bg-foreground/5 bg-transparent font-light"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
