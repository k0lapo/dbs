"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
  Package,
  ShoppingBag,
  Wallet2,
  TriangleAlert,
  ArrowRight,
} from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  lowStockItems: number
}

interface RecentOrder {
  id: string
  order_number: string | null
  total_amount: number
  status: string | null
  created_at: string
}

interface LowStockItem {
  id: string
  product_name: string
  sku: string
  size: string
  color: string
  quantity: number
  min_stock: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockList, setLowStockList] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setErrorMsg("")
      try {
        const supabase = getSupabaseClient()

        // 1) Products count
        const { count: totalProducts, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) throw productsError

        // 2) Orders: count + total revenue + recent orders
        const {
          data: ordersData,
          count: totalOrders,
          error: ordersError,
        } = await supabase
          .from("orders")
          .select("id, order_number, total_amount, status, created_at", {
            count: "exact",
          })
          .order("created_at", { ascending: false })
          .limit(5)

        if (ordersError) throw ordersError

        const totalRevenue =
          ordersData?.reduce(
            (sum, order) => sum + Number(order.total_amount || 0),
            0,
          ) || 0

        setRecentOrders(ordersData || [])

        // 3) Inventory: low stock items
        // Assumes: inventory table with quantity + min_stock
        const { data: inventoryData, error: inventoryError } = await supabase
          .from("inventory")
          .select("id, product_name, sku, size, color, quantity, min_stock")

        if (inventoryError) throw inventoryError

        const lowStock = (inventoryData || []).filter(
          (item) => item.quantity <= item.min_stock,
        )

        setLowStockList(lowStock)
        setStats({
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue,
          lowStockItems: lowStock.length,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: <Package className="w-6 h-6" />,
      hint: "Active items in catalog",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingBag className="w-6 h-6" />,
      hint: "All time",
    },
    {
      label: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: <Wallet2 className="w-6 h-6" />,
      hint: "Sum of all orders",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockItems.toLocaleString(),
      icon: <TriangleAlert className="w-6 h-6" />,
      hint: "Needs restock",
    },
  ]

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-light text-foreground">
            Admin Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Performance snapshot for DripBySoweto Studio.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders">
            <Button
              variant="outline"
              className="border-foreground/20 text-foreground bg-transparent hover:bg-muted"
            >
              View Orders
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* ERROR STATE */}
      {errorMsg && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-3">
          <span>Failed to load some dashboard data: {errorMsg}</span>
          <span className="text-xs text-destructive/80">
            Check your Supabase tables & API keys.
          </span>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-muted/60 to-background p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-primary/10 text-primary p-2">
                {card.icon}
              </div>
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {card.label}
              </span>
            </div>
            {loading ? (
              <div className="h-8 w-24 rounded bg-muted animate-pulse" />
            ) : (
              <p className="text-2xl md:text-3xl font-light text-foreground">
                {card.value}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>

            {/* subtle glow */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
          Quick actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products">
            <div className="group cursor-pointer rounded-2xl border border-border bg-muted/40 px-5 py-4 hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Add new product
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Create or update catalog items, prices & details.
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="group cursor-pointer rounded-2xl border border-border bg-muted/40 px-5 py-4 hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Manage orders
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Track order status, update fulfillment & shipping.
              </p>
            </div>
          </Link>

          <Link href="/admin/inventory">
            <div className="group cursor-pointer rounded-2xl border border-border bg-muted/40 px-5 py-4 hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Inventory & stock
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Adjust sizes, colors & quantities in real-time.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS + LOW STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">
              Recent orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders yet. Once customers start checking out, they’ll appear
              here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {order.order_number || `Order ${order.id.slice(0, 6)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("en-NG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      ₦{Number(order.total_amount || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {order.status || "pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">
              Low stock alert
            </h3>
            <Link
              href="/admin/inventory"
              className="text-xs text-primary hover:underline"
            >
              Manage inventory
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : lowStockList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All good. No items are currently below their minimum stock level.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.sku} • {item.size} • {item.color}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-xs text-destructive font-semibold">
                      {item.quantity} in stock
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Min: {item.min_stock}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockList.length > 5 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  + {lowStockList.length - 5} more low stock variants
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
