"use client"

import { useEffect, useState } from "react"

interface InventoryItem {
  id: string
  productName: string
  sku: string
  size: string
  color: string
  quantity: number
  minStock: number
  createdAt?: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch inventory from API on mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/admin/inventory", {
          cache: "no-store",
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Failed to fetch inventory")
        }

        const data = await res.json()
        setInventory(data.items || [])
      } catch (err) {
        console.error(err)
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong loading inventory",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  const handleUpdateStock = async (id: string) => {
    if (!editQuantity) return
    const newQty = Number.parseInt(editQuantity, 10)
    if (Number.isNaN(newQty)) {
      alert("Please enter a valid number")
      return
    }

    const previous = [...inventory]
    // Optimistic update
    setInventory((curr) =>
      curr.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    )

    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to update stock")
      }

      const data = await res.json()
      const updated = data.item as InventoryItem

      setInventory((curr) =>
        curr.map((item) => (item.id === id ? updated : item)),
      )
    } catch (err) {
      console.error(err)
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update stock. Reverting change.",
      )
      // revert on error
      setInventory(previous)
    } finally {
      setEditingId(null)
      setEditQuantity("")
    }
  }

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minStock,
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-foreground">
          Inventory Management
        </h2>
      </div>

      {/* Status messages */}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading inventory…</p>
      )}
      {error && (
        <p className="text-sm text-red-500">
          Error loading inventory: {error}
        </p>
      )}

      {/* Alert for low stock */}
      {lowStockItems.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded p-4">
          <p className="text-sm text-red-600 font-light">
            ⚠️ {lowStockItems.length} item(s) low in stock
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto border border-foreground/10 rounded">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground/10 bg-muted">
            <tr>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Product
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                SKU
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Size
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Color
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Quantity
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Min Stock
              </th>
              <th className="px-6 py-4 text-left font-light text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No inventory records yet.
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-foreground/10 hover:bg-muted/50 ${
                    item.quantity <= item.minStock ? "bg-red-50/30" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-foreground">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-foreground">{item.sku}</td>
                  <td className="px-6 py-4 text-foreground">{item.size}</td>
                  <td className="px-6 py-4 text-foreground">{item.color}</td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) =>
                            setEditQuantity(e.target.value)
                          }
                          className="w-16 px-2 py-1 border border-foreground/20 rounded bg-background text-foreground text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateStock(item.id)}
                          className="text-primary hover:underline text-xs font-light"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditQuantity("")
                          }}
                          className="text-muted-foreground hover:underline text-xs font-light"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded text-xs font-light ${
                          item.quantity <= item.minStock
                            ? "bg-red-100/20 text-red-600"
                            : "bg-green-100/20 text-green-600"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {item.minStock}
                  </td>
                  <td className="px-6 py-4">
                    {editingId !== item.id && (
                      <button
                        onClick={() => {
                          setEditingId(item.id)
                          setEditQuantity(item.quantity.toString())
                        }}
                        className="text-primary hover:underline text-xs font-light"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
