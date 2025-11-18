"use client"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import NewDropsSection from "@/components/new-drops-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <NewDropsSection />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}
