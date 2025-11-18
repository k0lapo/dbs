"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { uploadProductImage, getSupabaseClient } from "@/lib/supabase/storage"

interface Product {
  id: string
  name: string
  image_url: string | null
}

export default function ImageUploadPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Load products from Supabase
  const loadProducts = async () => {
    setLoading(true)
    setMessage("")
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url")
        .order("name")

      if (error) throw error

      setProducts(data || [])
      setMessage(`Loaded ${data?.length || 0} products`)
    } catch (error) {
      setMessage(
        `Error loading products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      )
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (
    productId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(productId)
    setMessage("")

    try {
      // Upload to Supabase Storage
      const imageUrl = await uploadProductImage(file, productId)

      // Save URL to products table
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("products")
        .update({ image_url: imageUrl })
        .eq("id", productId)

      if (error) throw error

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, image_url: imageUrl } : p,
        ),
      )

      setMessage("✓ Image uploaded for product successfully")
    } catch (error) {
      console.error(error)
      setMessage(
        `Error uploading image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      )
    } finally {
      setUploading(null)
      // reset input so user can re-upload same file if needed
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Product Images</h2>
        <p className="text-muted-foreground mt-2">
          Upload and manage product images in your Supabase Storage bucket.
        </p>
      </div>

      {/* Load Products Button */}
      <div className="flex gap-2">
        <Button
          onClick={loadProducts}
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Load Products
            </>
          )}
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.startsWith("Error")
              ? "bg-red-100/20 text-red-600 border border-red-200/40"
              : message.startsWith("✓")
              ? "bg-green-100/20 text-green-600 border border-green-200/40"
              : "bg-blue-100/20 text-blue-600 border border-blue-200/40"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-5 h-5" />
          ) : message.startsWith("✓") ? (
            <CheckCircle className="w-5 h-5" />
          ) : null}
          <span>{message}</span>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg p-4 space-y-4"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No image</p>
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {product.id}
                </p>
              </div>

              {/* Upload Button + hidden input */}
              <div>
                <input
                  id={`file-${product.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(product.id, e)}
                  disabled={uploading === product.id}
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById(`file-${product.id}`)?.click()
                  }
                  disabled={uploading === product.id}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {uploading === product.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Click <span className="font-medium">“Load Products”</span> to get
            started.
          </p>
        </div>
      )}
    </div>
  )
}
