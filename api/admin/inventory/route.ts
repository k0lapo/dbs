// app/api/admin/inventory/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

// GET /api/admin/inventory  → list all inventory items
export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured on server" },
      { status: 500 },
    )
  }

  const { data, error } = await supabase
    .from("inventory")
    .select("id, product_name, sku, size, color, quantity, min_stock, created_at")

  if (error) {
    console.error("❌ Supabase inventory GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 },
    )
  }

  // map to camelCase for your frontend
  const items = (data || []).map((row) => ({
    id: row.id,
    productName: row.product_name,
    sku: row.sku,
    size: row.size,
    color: row.color,
    quantity: row.quantity,
    minStock: row.min_stock,
    createdAt: row.created_at,
  }))

  return NextResponse.json({ items })
}
