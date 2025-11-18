"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  imageKey?: string // e.g. "products/ascension-front.jpg"
}

type CartContextType = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (id: number, opts?: { color?: string; size?: string }) => void
  setQty: (id: number, quantity: number, opts?: { color?: string; size?: string }) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

// localStorage keys
const LS_KEY = "dbs_cart_v1"

function readLS(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLS(items: CartItem[]) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // hydrate from LS once
  useEffect(() => {
    setItems(readLS())
  }, [])

  // persist to LS
  useEffect(() => {
    writeLS(items)
  }, [items])

  const addItem: CartContextType["addItem"] = (incoming) => {
    setItems((prev) => {
      // merge by id + color + size
      const idx = prev.findIndex(
        (i) => i.id === incoming.id && i.color === incoming.color && i.size === incoming.size
      )
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + incoming.quantity }
        return copy
      }
      return [...prev, incoming]
    })
  }

  const removeItem: CartContextType["removeItem"] = (id, opts) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.color === opts?.color && i.size === opts?.size))
    )
  }

  const setQty: CartContextType["setQty"] = (id, quantity, opts) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.color === opts?.color && i.size === opts?.size ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, removeItem, setQty, clear }),
    [items, count, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}
