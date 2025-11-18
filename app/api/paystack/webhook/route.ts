import { NextResponse, NextRequest } from "next/server"
import crypto from "node:crypto" // prefer node:crypto with @types/node
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY

  if (!secret) {
    console.error("[PAYSTACK] Missing PAYSTACK_SECRET_KEY")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  // 1) Raw body for signature verification
  const rawBody = await req.text()

  // 2) Signature from Paystack
  const paystackSignature = req.headers.get("x-paystack-signature") || ""

  // 3) Compute HMAC
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex")

  if (hash !== paystackSignature) {
    console.warn("[PAYSTACK] Invalid signature")
    return new NextResponse("Invalid signature", { status: 401 })
  }

  // 4) Signature valid → parse JSON
  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch (err) {
    console.error("[PAYSTACK] Failed to parse event body", err)
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const eventType = event?.event
  const data = event?.data
  const reference: string | undefined = data?.reference
  const status: string | undefined = data?.status
  const amountKobo: number | undefined = data?.amount // usually in kobo
  const paidAt: string | undefined = data?.paid_at

  console.log("[PAYSTACK] Webhook:", eventType, reference, status)

  if (!reference) {
    console.error("[PAYSTACK] Missing reference in webhook data")
    return new NextResponse("Missing reference", { status: 400 })
  }

  try {
    // ========= EXAMPLE: on successful charge =========
    if (eventType === "charge.success" && status === "success") {
      // Convert amount from kobo to naira if you want (Paystack sends kobo)
      const amountNaira = amountKobo ? amountKobo / 100 : null

      // Update your order in Supabase
      // Assumes you have:
      // - orders table
      // - paystack_ref (text)
      // - status (text) e.g. PENDING, PAID, FAILED
      // - paid_at (timestamp)
      // - gateway (text)
      // - total_amount (numeric)  (optional)
      // - raw_event (jsonb)       (optional)
      const { data: updated, error } = await supabaseAdmin
        .from("orders")
        .update({
          status: "PAID",
          paid_at: paidAt ? new Date(paidAt).toISOString() : new Date().toISOString(),
          gateway: "PAYSTACK",
          total_amount: amountNaira ?? undefined,
          raw_event: event,
        })
        .eq("paystack_ref", reference) // 👈 adjust if your column name is different
        .select("*")

      if (error) {
        console.error("[PAYSTACK] Supabase update error:", error)
        return new NextResponse("DB error", { status: 500 })
      }

      if (!updated || updated.length === 0) {
        console.warn("[PAYSTACK] No order found for reference:", reference)
        // still return 200 so Paystack stops retrying,
        // but you may want to log this and investigate.
        return NextResponse.json({ received: true, orderFound: false })
      }

      console.log("[PAYSTACK] Order marked as PAID:", updated[0].id)
    }

    // ========= OPTIONAL: handle other event types =========
    // e.g. charge.failed, charge.dispute, refund, etc.
    //
    // if (eventType === "charge.failed") {
    //   await supabaseAdmin.from("orders")
    //     .update({ status: "FAILED", raw_event: event })
    //     .eq("paystack_ref", reference)
    // }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error("[PAYSTACK] Webhook handling error:", err)
    return new NextResponse("Webhook handler error", { status: 500 })
  }
}
