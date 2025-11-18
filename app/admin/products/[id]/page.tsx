"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
// OPTIONAL: if you're using auth-helpers
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// type SupabaseClient = ReturnType<typeof createClientComponentClient>

interface Product {
  id: string
  name: string
  price: string
  category: string
  stock: number
  sku: string
  colors: string
  sizes: string
  description: string
}

// 🔹 Local fallback data (until Supabase is hooked)
const PRODUCTS_DATA: Product[] = [
  {
    id: "1",
    name: "DBS Sublimated Tracksuits",
    price: "₦170,000",
    category: "Tracksuits",
    stock: 15,
    sku: "DBS-001",
    colors: "Black, White, Green, Orange",
    sizes: "XS, S, M, L, XL, XXL",
    description: "Premium sublimated tracksuits with DBS branding",
  },
  {
    id: "2",
    name: "DBS Nylon Tracksuits",
    price: "₦170,000",
    category: "Tracksuits",
    stock: 8,
    sku: "DBS-002",
    colors: "Black, Navy, Red",
    sizes: "S, M, L, XL",
    description: "High-quality nylon tracksuits",
  },
  {
    id: "3",
    name: "DBS Christ De Savior T-shirt",
    price: "₦100,000",
    category: "Tops",
    stock: 25,
    sku: "DBS-003",
    colors: "White, Black, Navy",
    sizes: "XS, S, M, L, XL",
    description: "Iconic Christ De Savior design t-shirt",
  },
  {
    id: "4",
    name: "DBS raglan CropTop for ladies",
    price: "₦50,000",
    category: "Tops",
    stock: 12,
    sku: "DBS-004",
    colors: "Black, White, Pink",
    sizes: "XS, S, M, L",
    description: "Stylish raglan crop top for ladies",
  },
  {
    id: "5",
    name: "Soweto ladies CropTops",
    price: "₦50,000",
    category: "Tops",
    stock: 3,
    sku: "DBS-005",
    colors: "Black, White, Yellow",
    sizes: "XS, S, M, L",
    description: "Soweto-inspired crop tops",
  },
  {
    id: "6",
    name: "DripBySoweto Club members Jersey",
    price: "₦120,000",
    category: "Tops",
    stock: 6,
    sku: "DBS-006",
    colors: "White, Black",
    sizes: "S, M, L, XL",
    description: "Exclusive club members jersey",
  },
  {
    id: "7",
    name: "DBS Crzy Armless",
    price: "₦50,000",
    category: "Tops",
    stock: 20,
    sku: "DBS-007",
    colors: "Black, White, Gray",
    sizes: "XS, S, M, L, XL",
    description: "Casual armless top",
  },
  {
    id: "8",
    name: "DBS Christ D Savior Crop armless",
    price: "₦30,000",
    category: "Tops",
    stock: 10,
    sku: "DBS-008",
    colors: "White, Black",
    sizes: "XS, S, M, L",
    description: "Christ D Savior crop armless top",
  },
  {
    id: "9",
    name: "DBS Double layer Jean",
    price: "₦70,000",
    category: "Bottoms",
    stock: 9,
    sku: "DBS-009",
    colors: "Dark Blue, Black",
    sizes: "S, M, L, XL, XXL",
    description: "Premium double layer jeans",
  },
  {
    id: "10",
    name: "Soweto Arts Embroidery Pants",
    price: "₦100,000",
    category: "Bottoms",
    stock: 5,
    sku: "DBS-010",
    colors: "Beige, Khaki, Brown",
    sizes: "S, M, L, XL",
    description: "Embroidered pants with Soweto arts",
  },
  {
    id: "11",
    name: "DripBySoweto Nylon Short",
    price: "₦40,000",
    category: "Bottoms",
    stock: 18,
    sku: "DBS-011",
    colors: "Black, White, Navy",
    sizes: "XS, S, M, L, XL",
    description: "Lightweight nylon shorts",
  },
  {
    id: "12",
    name: "Soweto Arts Embroidery jorts",
    price: "₦70,000",
    category: "Bottoms",
    stock: 7,
    sku: "DBS-012",
    colors: "Blue, Black",
    sizes: "S, M, L, XL",
    description: "Jorts with embroidery details",
  },
  {
    id: "13",
    name: "DBS Embroidered Suede Hat",
    price: "₦100,000",
    category: "Accessories",
    stock: 14,
    sku: "DBS-013",
    colors: "Brown, Black, Tan",
    sizes: "One Size",
    description: "Premium suede hat with DBS embroidery",
  },
  {
    id: "14",
    name: "DBS embroidered Leather/Jean SnapBack",
    price: "₦80,000",
    category: "Accessories",
    stock: 11,
    sku: "DBS-014",
    colors: "Black, White, Brown",
    sizes: "One Size",
    description: "Stylish snapback cap",
  }
]

export default function EditProductPage() {
  // ✅ Strongly type params so TS is happy
  const params = useParams<{ id: string }>()
  const productId = params?.id

  // OPTIONAL: if using auth-helpers
  // const supabase = useMemo(() => createClientComponentClient(), [])

  const [formData, setFormData] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 🔹 Load product (for now from local data; you can swap to Supabase below)
  useEffect(() => {
    if (!productId) return

    // Local fallback
    const localProduct = PRODUCTS_DATA.find((p) => p.id === productId)

    if (localProduct) {
      setFormData({
        ...localProduct,
        price: localProduct.price.replace(/,/g, ""),
      })
      setIsLoading(false)
      return
    }

    // 🔄 Example Supabase fetch (uncomment + adjust when ready)
    /*
    ;(async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, stock, sku, colors, sizes, description")
        .eq("id", productId)
        .single()

      if (error || !data) {
        console.error("Error loading product:", error)
        setIsLoading(false)
        return
      }

      setFormData({
        id: data.id,
        name: data.name ?? "",
        price: String(data.price ?? ""),
        category: data.category ?? "Tracksuits",
        stock: Number(data.stock ?? 0),
        sku: data.sku ?? "",
        colors: data.colors ?? "",
        sizes: data.sizes ?? "",
        description: data.description ?? "",
      })
      setIsLoading(false)
    })()
    */
  }, [productId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "stock"
                ? Number(value)
                : value,
          }
        : prev,
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setMessage("")

    try {
      // 🔹 Local “mock” save
      // In reality you’d send this to /api/admin/products/[id] or Supabase directly

      // Example Supabase update (uncomment + tweak when ready):
      /*
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: Number(formData.price || 0),
          category: formData.category,
          stock: formData.stock,
          sku: formData.sku,
          colors: formData.colors,
          sizes: formData.sizes,
          description: formData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)

      if (error) {
        throw error
      }
      */

      setMessage("✓ Product updated successfully")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      console.error(error)
      setMessage(`Error: ${error?.message ?? "Failed to save"}`)
    } finally {
      setIsSaving(false)
    }
  }

  // 🌀 Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/products">
          <Button variant="ghost" className="text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading product…
        </div>
      </div>
    )
  }

  // ❌ Not found
  if (!formData) {
    return (
      <div className="space-y-6">
        <Link href="/admin/products">
          <Button variant="ghost" className="text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products">
            <Button variant="ghost" className="text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h2 className="text-3xl font-light text-foreground">Edit Product</h2>
          <p className="text-muted-foreground mt-1">{formData.name}</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.startsWith("✓")
              ? "bg-green-100/20 text-green-600 border border-green-200/30"
              : "bg-red-100/20 text-red-600 border border-red-200/30"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="border border-foreground/10 rounded-lg p-6 bg-muted space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="Product name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Price (NGN)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="25000"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="DBS-001"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground text-sm focus:outline-none focus:border-foreground"
            >
              <option value="Tracksuits">Tracksuits</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="0"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="Black, White, Green"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-light text-foreground mb-2">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
              placeholder="XS, S, M, L, XL"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-light text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
            placeholder="Product description"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white font-light"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Link href="/admin/products">
            <Button
              type="button"
              variant="outline"
              className="border-foreground text-foreground font-light bg-transparent"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
