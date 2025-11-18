// app/checkout/page.tsx

import NextDynamic from "next/dynamic"

// ✅ This is the special Next.js export that controls rendering.
// Its name *must* be exactly `dynamic`.
export const dynamic = "force-dynamic"

const CheckoutClient = NextDynamic(() => import("./CheckoutClient"), {
  ssr: false, // ⛔ disable server-side rendering for this component
})

export default function CheckoutPage() {
  return <CheckoutClient />
}
