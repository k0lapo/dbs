// app/api/admin/inventory/[id]/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

// PATCH /api/admin/inventory/[id]  → update quantity / min_stock
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured on server" },
      { status: 500 },
    )
  }

  const { id } = params
  const body = await req.json()
  const { quantity, minStock } = body as {
    quantity?: number
    minStock?: number
  }

  if (quantity === undefined && minStock === undefined) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 },
    )
  }

  const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() }
  if (quantity !== undefined) updatePayload.quantity = quantity
  if (minStock !== undefined) updatePayload.min_stock = minStock

  const { data, error } = await supabase
    .from("inventory")
    .update(updatePayload)
    .eq("id", id)
    .select("id, product_name, sku, size, color, quantity, min_stock, created_at")
    .single()

  if (error || !data) {
    console.error("❌ Supabase inventory PATCH error:", error)
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 },
    )
  }

  const item = {
    id: data.id,
    productName: data.product_name,
    sku: data.sku,
    size: data.size,
    color: data.color,
    quantity: data.quantity,
    minStock: data.min_stock,
    createdAt: data.created_at,
  }

  return NextResponse.json({ item })
}
