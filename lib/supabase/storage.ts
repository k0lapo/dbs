// lib/supabase/storage.ts
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Make sure these are set in .env.local:
// NEXT_PUBLIC_SUPABASE_URL=...
// NEXT_PUBLIC_SUPABASE_ANON_KEY=...

export function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing")
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Upload a product image to the `product-images` bucket and return the public URL.
 */
export async function uploadProductImage(file: File, productId: string) {
  const supabase = getSupabaseClient()

  const ext = file.name.split(".").pop() || "jpg"
  // you can change this path to whatever structure you want
  const filePath = `products/${productId}-${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from("product-images") // <- your bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (error) {
    console.error("Supabase upload error:", error)
    throw error
  }

  const { data: publicData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path)

  return publicData.publicUrl
}
