// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null

export const dynamic = "force-dynamic"

// ───────────────── GET /api/admin/orders ─────────────────
export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || "all"

  let query = supabase
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
    .order("created_at", { ascending: false })

  if (status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Supabase orders fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 },
    )
  }

  // IMPORTANT: return raw rows so your <OrdersPage /> sees snake_case fields
  return NextResponse.json({ orders: data ?? [] }, { status: 200 })
}

// ───────────────── POST /api/admin/orders ────────────────
// Called from Checkout after Paystack onSuccess
export async function POST(req: NextRequest) {
  if (!supabase) {
    console.error("❌ Supabase not configured on server")
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch (err) {
    console.error("❌ Invalid JSON body:", err)
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  console.log("📦 Incoming order payload:", body)

  const {
    paystackReference,
    email,
    customerName,
    shippingAddress,
    totalAmount,
    items,
  } = body

  if (!email || !customerName || !shippingAddress || !totalAmount || !Array.isArray(items)) {
    console.error("❌ Missing required fields in body:", body)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  const orderNumber = `DBS-${Date.now()}`
  const now = new Date().toISOString()

  // ── Insert into orders table ───────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      // we don’t currently receive first_name/last_name separately from the client
      first_name: null,
      last_name: null,
      customer_name: customerName,
      email,
      total_amount: totalAmount,
      status: "pending",
      items_count: items.length,
      shipping_address: shippingAddress,
      created_at: now,
      updated_at: now,
      // add paystack_reference: paystackReference if you later add that column
    })
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

  if (orderError || !order) {
    console.error("❌ Supabase insert order error:", orderError)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: orderError?.message,
        hint: orderError?.hint,
      },
      { status: 500 },
    )
  }

  // ── Insert into order_items table ──────────────────────
  const itemsPayload = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    sku: item.sku ?? null,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    color: item.color ?? null,
    size: item.size ?? null,
    subtotal: item.unitPrice * item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload)

  if (itemsError) {
    console.error("❌ Supabase insert order_items error:", itemsError)
    // We still return the order so you see it in admin even if items fail
  }

  // Return raw DB shape (snake_case) so OrdersPage types line up
  return NextResponse.json(
    { order },
    { status: 201 },
  )
}
