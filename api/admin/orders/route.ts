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

// ───────────── GET /api/admin/orders  (list orders) ─────────────
export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)
  const statusFilter = searchParams.get("status") || "all"

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
      created_at
    `,
    )
    .order("created_at", { ascending: false })

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Supabase orders fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 },
    )
  }

  const orders = (data || []).map((o) => ({
  id: o.id,
  orderNumber: o.order_number ?? null,
  firstName: o.first_name ?? "",
  lastName: o.last_name ?? "",
  customerName:
    o.customer_name ??
    ((`${o.first_name ?? ""} ${o.last_name ?? ""}`).trim() || "Guest"),
  email: o.email ?? "",
  itemsCount: o.items_count ?? 0,
  totalAmount: Number(o.total_amount ?? 0),
  status: o.status ?? "pending",
  shippingAddress: o.shipping_address ?? "",
  createdAt: o.created_at,
}))


  return NextResponse.json({ orders }, { status: 200 })
}

// ───────────── POST /api/admin/orders  (create order from checkout) ─────────────
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
    firstName,
    lastName,
    userId,
  } = body

  if (
    !email ||
    !customerName ||
    !shippingAddress ||
    typeof totalAmount !== "number" ||
    !Array.isArray(items)
  ) {
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
      user_id: userId ?? null,
      order_number: orderNumber,
      first_name: firstName ?? null,
      last_name: lastName ?? null,
      customer_name: customerName,
      email,
      total_amount: totalAmount,           // numeric
      status: "pending",                  // initial status
      items_count: items.length,
      shipping_address: shippingAddress,
      created_at: now,
      updated_at: now,
      // paystack_reference: paystackReference, // only if you add this column
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
      created_at
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
  }

  return NextResponse.json(
    {
      order: {
        id: order.id,
        orderNumber: order.order_number,
        firstName: order.first_name,
        lastName: order.last_name,
        customerName: order.customer_name,
        email: order.email,
        itemsCount: order.items_count,
        totalAmount: Number(order.total_amount),
        status: order.status,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
      },
    },
    { status: 201 },
  )
}
