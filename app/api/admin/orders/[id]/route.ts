// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

// ───────────────── GET /api/admin/orders/[id] ─────────────────
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    )
  }

  const { id } = params

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        first_name,
        last_name,
        customer_name,
        email,
        total_amount,
        status,
        items_count,
        shipping_address,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .single()

  if (orderError || !order) {
    console.error("❌ fetch order error:", orderError)
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*") // select all columns to avoid name mismatches
    .eq("order_id", id)

  if (itemsError) {
    console.error("❌ fetch order_items error:", itemsError)
    return NextResponse.json(
      { error: "Failed to load order items", details: itemsError.message },
      { status: 500 },
    )
  }

  // Return raw DB shapes; your page.tsx expects snake_case fields:
  // selectedOrder: order_number, email, total_amount, items_count, shipping_address, created_at
  // selectedItems: product_name, unit_price, quantity, color, size, subtotal, etc.
  return NextResponse.json({
    order,
    items: items ?? [],
  })
}

// ───────────────── PATCH /api/admin/orders/[id] ─────────────────
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
  const { status } = body as { status?: string }

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 })
  }

  if (!["pending", "processing", "shipped", "delivered"].includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      `
        id,
        order_number,
        first_name,
        last_name,
        customer_name,
        email,
        total_amount,
        status,
        items_count,
        shipping_address,
        created_at,
        updated_at
      `,
    )
    .single()

  if (error) {
    console.error("❌ Supabase PATCH order error:", error)
    return NextResponse.json(
      { error: "Failed to update order status", details: error.message },
      { status: 500 },
    )
  }

  // Again: raw row (snake_case) so OrdersPage types are happy
  return NextResponse.json({ order: data })
}
