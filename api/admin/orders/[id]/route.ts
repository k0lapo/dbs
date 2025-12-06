// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

// GET /api/admin/orders/[id] → order + items
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
    .select(
      `
        id,
        product_id,
        product_name,
        sku,
        unit_price,
        quantity,
        color,
        size,
        subtotal
      `,
    )
    .eq("order_id", id)

  if (itemsError) {
    console.error("❌ fetch order_items error:", itemsError)
    return NextResponse.json(
      { error: "Failed to load order items", details: itemsError.message },
      { status: 500 },
    )
  }

  // Normalize for frontend
  const normalizedOrder = {
    id: order.id,
    orderNumber: order.order_number,
    firstName: order.first_name,
    lastName: order.last_name,
    customerName: order.customer_name,
    email: order.email,
    totalAmount: Number(order.total_amount),
    status: order.status,
    itemsCount: order.items_count,
    shippingAddress: order.shipping_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }

  const normalizedItems = (items || []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    sku: item.sku,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    color: item.color,
    size: item.size,
    subtotal: Number(item.subtotal),
  }))

  return NextResponse.json({
    order: normalizedOrder,
    items: normalizedItems,
  })
}

// PATCH /api/admin/orders/[id] → update status
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

  const normalizedOrder = {
    id: data.id,
    orderNumber: data.order_number,
    firstName: data.first_name,
    lastName: data.last_name,
    customerName: data.customer_name,
    email: data.email,
    totalAmount: Number(data.total_amount),
    status: data.status,
    itemsCount: data.items_count,
    shippingAddress: data.shipping_address,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }

  return NextResponse.json({ order: normalizedOrder })
}
