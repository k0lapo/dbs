import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    )
  }

  const body = await req.json()

  const {
    paystackReference,
    email,
    customerName,
    shippingAddress,
    totalAmount,
    items,
  } = body as {
    paystackReference?: string
    email: string
    customerName: string
    shippingAddress: string
    totalAmount: number
    items: {
      productId?: string
      name: string
      sku?: string
      unitPrice: number
      quantity: number
      color?: string
      size?: string
    }[]
  }

  if (!email || !customerName || !totalAmount || !items || !items.length) {
    return NextResponse.json(
      { error: "Missing required order fields" },
      { status: 400 },
    )
  }

  // (Optional but recommended) verify Paystack reference here
  // using server-side secret key before accepting the order.

  // Create order_number like DBS-2025-000123
  const now = new Date()
  const year = now.getFullYear()
  const random = String(Math.floor(Math.random() * 999999)).padStart(6, "0")
  const orderNumber = `DBS-${year}-${random}`

  const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  // 1) Insert into orders
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: customerName,
      email,
      total_amount: totalAmount,
      status: "pending",
      items_count: itemsCount,
      shipping_address: shippingAddress,
    })
    .select("id, order_number, customer_name, email, total_amount, status, items_count, created_at")
    .single()

  if (orderError || !order) {
    console.error("❌ Supabase order insert error:", orderError)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    )
  }

  // 2) Insert order_items
  const orderItemsPayload = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId ?? null,
    product_name: item.name,
    sku: item.sku ?? null,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    color: item.color ?? null,
    size: item.size ?? null,
    subtotal: item.unitPrice * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload)

  if (itemsError) {
    console.error("❌ Supabase order_items insert error:", itemsError)
    // you may want to roll back the order or mark as 'error'
    return NextResponse.json(
      { error: "Order created but failed to save items" },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      order,
      orderItems: orderItemsPayload,
    },
    { status: 201 },
  )
}

