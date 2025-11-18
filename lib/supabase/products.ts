import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const getSupabaseServer = async () => {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookieStore.getAll().forEach((cookie) => {
          cookieStore.delete(cookie.name)
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}

export const getAllProducts = async () => {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const getProductById = async (id: string) => {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export const updateProductImage = async (productId: string, imageUrl: string) => {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.from("products").update({ image_url: imageUrl }).eq("id", productId)

  if (error) throw error
}
