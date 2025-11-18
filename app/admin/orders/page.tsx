"use client"

import { useEffect, useState } from "react"

interface Order {
  id: string
  order_number: string | null
  customer_name: string | null
  email: string | null
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered"
  items_count: number | null
  shipping_address?: string | null
  created_at: string
}

interface OrderItem {
  id: string
  product_id?: string | null
  product_name: string
  sku?: string | null
  unit_price: number
  quantity: number
  color?: string | null
  size?: string | null
  subtotal: number
}

const STATUSES = ["all", "pending", "processing", "shipped", "delivered"] as const

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<(typeof STATUSES)[number]>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Details modal state
  const [showDetails, setShowDetails] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/admin/orders?status=${selectedStatus}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Failed to fetch orders")
        }

        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100/20 text-yellow-600"
      case "processing":
        return "bg-blue-100/20 text-blue-600"
      case "shipped":
        return "bg-purple-100/20 text-purple-600"
      case "delivered":
        return "bg-green-100/20 text-green-600"
      default:
        return "bg-gray-100/20 text-gray-600"
    }
  }

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "processing" | "shipped" | "delivered",
  ) => {
    const previous = [...orders]
    setOrders((curr) =>
      curr.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    )

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to update status")
      }

      const data = await res.json()
      const updated = data.order as Order
      setOrders((curr) => curr.map((o) => (o.id === id ? updated : o)))
    } catch (err) {
      console.error(err)
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update order status. Reverting change.",
      )
      setOrders(previous)
    }
  }

  const openOrderDetails = async (id: string) => {
    try {
      setDetailsLoading(true)
      setShowDetails(true)

      const res = await fetch(`/api/admin/orders/${id}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to load order")
      }

      const data = await res.json()
      setSelectedOrder(data.order)
      setSelectedItems(data.items || [])
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Failed to load order details")
      setShowDetails(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-foreground">Orders</h2>
        </div>

        {/* Filter by Status */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-sm font-light transition-all capitalize rounded ${
                selectedStatus === status
                  ? "bg-foreground text-background"
                  : "border border-foreground text-foreground hover:bg-foreground/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        )}
        {error && (
          <p className="text-sm text-red-500">
            Error loading orders: {error}
          </p>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto border border-foreground/10 rounded">
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/10 bg-muted">
              <tr>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Order #
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Items
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Total
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-light text-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No orders found for this filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-foreground/10 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-foreground font-light">
                      {order.order_number || "—"}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {order.customer_name || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-foreground text-xs">
                      {order.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {order.items_count ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      ₦{Number(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-light capitalize border-none cursor-pointer ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrderDetails(order.id)}
                        className="text-primary hover:underline text-xs font-light"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background max-w-lg w-full mx-4 rounded-lg shadow-xl border border-foreground/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Order Details
                </h3>
                {selectedOrder && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedOrder.order_number} •{" "}
                    {new Date(
                      selectedOrder.created_at,
                    ).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {detailsLoading && (
                <p className="text-sm text-muted-foreground">
                  Loading…
                </p>
              )}

              {selectedOrder && !detailsLoading && (
                <>
                  {/* Customer / shipping */}
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground font-medium">
                      {selectedOrder.customer_name || "Guest"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedOrder.email || "No email"}
                    </p>
                    {selectedOrder.shipping_address && (
                      <p className="text-muted-foreground">
                        {selectedOrder.shipping_address}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="border border-border rounded-lg p-3 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Items
                    </p>
                    <div className="space-y-3">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start text-xs"
                        >
                          <div className="space-y-1">
                            <p className="text-foreground font-medium">
                              {item.product_name}
                            </p>
                            <p className="text-muted-foreground">
                              Qty: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                              {item.color && ` • Color: ${item.color}`}
                            </p>
                            {item.sku && (
                              <p className="text-muted-foreground">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-foreground font-semibold">
                              ₦{item.subtotal.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">
                              ₦{item.unit_price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      ))}

                      {selectedItems.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No items found for this order.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-border pt-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span>{selectedOrder.items_count ?? "—"}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">
                        ₦{Number(
                          selectedOrder.total_amount || 0,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-muted-foreground">
                        Status
                      </span>
                      <span className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
