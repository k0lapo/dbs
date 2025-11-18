// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export const dynamic = "force-dynamic"

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
      customer_name,
      email,
      total_amount,
      status,
      items_count,
      created_at
    `,
    )
    .order("created_at", { ascending: false })

  if (status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Supabase orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }

  const orders = (data || []).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.customer_name,
    email: o.email,
    total: Number(o.total_amount),
    status: o.status,
    items: o.items_count,
    date: o.created_at,
  }))

  return NextResponse.json({ orders }, { status: 200 })
}
