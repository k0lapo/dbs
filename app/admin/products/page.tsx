"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: string
  category: string
  stock: number
  sku: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1",  name: "DBS Sublimated Tracksuits",          price: "₦170,000", category: "tracksuits",  stock: 15, sku: "DBS-001", image: "track" },
  { id: "2",  name: "DBS Nylon Tracksuits",               price: "₦170,000", category: "tracksuits",  stock: 8,  sku: "DBS-002", image: "sets" },

  { id: "3",  name: "DBS Christ De Savior T-shirt",       price: "₦100,000", category: "tops",        stock: 25, sku: "DBS-003", image: "dbs shirt white" },
  { id: "4",  name: "DBS raglan CropTop for ladies",      price: "₦50,000",  category: "tops",        stock: 12, sku: "DBS-004", image: "raglan" },
  { id: "5",  name: "Soweto ladies CropTops",             price: "₦50,000",  category: "tops",        stock: 3,  sku: "DBS-005", image: "crop tank" },
  { id: "6",  name: "DripBySoweto Club members Jersey",   price: "₦120,000", category: "tops",        stock: 6,  sku: "DBS-006", image: "jersey" },
  { id: "7",  name: "DBS Crzy Armless",                   price: "₦50,000",  category: "tops",        stock: 20, sku: "DBS-007", image: "JS1" },
  { id: "8",  name: "DBS Christ D Savior Crop armless",   price: "₦30,000",  category: "tops",        stock: 10, sku: "DBS-008", image: "tank" },

  { id: "9",  name: "DBS Double layer Jean",              price: "₦70,000",  category: "bottoms",     stock: 9,  sku: "DBS-009", image: "ascension front" },
  { id: "10", name: "DBS Ascension Shirt",                price: "₦100,000", category: "tops",        stock: 5,  sku: "DBS-010", image: "ascension back" },
  { id: "11", name: "DripBySoweto Nylon Short",           price: "₦40,000",  category: "bottoms",     stock: 18, sku: "DBS-011", image: "shorts" },
  { id: "12", name: "Soweto Arts Embroidery jorts",       price: "₦70,000",  category: "bottoms",     stock: 7,  sku: "DBS-012", image: "jean jorts" },

  { id: "13", name: "DBS Embroidered Suede Hat",          price: "₦100,000", category: "accessories", stock: 14, sku: "DBS-013", image: "suede" },
  { id: "14", name: "DBS embroidered Leather/Jean SnapBack", price: "₦80,000", category: "accessories", stock: 11, sku: "DBS-014", image: "jean snapback" },

  { id: "15", name: "DBS Two Piece Hoodie",               price: "₦120,000", category: "tracksuits",  stock: 10, sku: "DBS-015", image: "2piece hoodie" },

  ])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Tracksuits",
    sku: "",
    colors: "",
    sizes: "",
  })

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to Supabase
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: formData.price,
      category: formData.category,
      stock: 0,
      sku: formData.sku,
    }
    setProducts([...products, newProduct])
    setFormData({ name: "", price: "", category: "Tracksuits", sku: "", colors: "", sizes: "" })
    setIsAddingProduct(false)
  }

  const handleDeleteProduct = (id: string) => {
    // TODO: Connect to Supabase
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-foreground">Manage Products</h2>
        <Button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="bg-primary hover:bg-primary/90 text-white font-light"
        >
          {isAddingProduct ? "Cancel" : "+ Add Product"}
        </Button>
      </div>

      {/* Add Product Form */}
      {isAddingProduct && (
        <div className="border border-foreground/10 rounded p-6 bg-muted">
          <h3 className="text-lg font-light text-foreground mb-6">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-foreground mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                  placeholder="e.g., Premium Hoodie"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-foreground mb-2">Price (NGN)</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                  placeholder="e.g., 25,500"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground text-sm focus:outline-none focus:border-foreground"
                >
                  <option value="Tracksuits">Tracksuits</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-foreground mb-2">SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                  placeholder="e.g., DBS-001"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-foreground mb-2">Colors (comma-separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                  placeholder="e.g., Black, White, Green"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-foreground mb-2">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full px-4 py-2 border border-foreground/20 rounded bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground"
                  placeholder="e.g., XS, S, M, L, XL"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-light">
                Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingProduct(false)}
                className="border-foreground text-foreground font-light"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto border border-foreground/10 rounded">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground/10 bg-muted">
            <tr>
              <th className="px-6 py-4 text-left font-light text-foreground">Product Name</th>
              <th className="px-6 py-4 text-left font-light text-foreground">SKU</th>
              <th className="px-6 py-4 text-left font-light text-foreground">Category</th>
              <th className="px-6 py-4 text-left font-light text-foreground">Price</th>
              <th className="px-6 py-4 text-left font-light text-foreground">Stock</th>
              <th className="px-6 py-4 text-left font-light text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-foreground/10 hover:bg-muted/50">
                <td className="px-6 py-4 text-foreground">{product.name}</td>
                <td className="px-6 py-4 text-foreground">{product.sku}</td>
                <td className="px-6 py-4 text-foreground capitalize">{product.category}</td>
                <td className="px-6 py-4 text-foreground">{product.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded text-xs font-light ${
                      product.stock < 5
                        ? "bg-red-100/20 text-red-600"
                        : product.stock < 10
                          ? "bg-yellow-100/20 text-yellow-600"
                          : "bg-green-100/20 text-green-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Link href={`/admin/products/${product.id}`}>
                    <button className="text-primary hover:underline text-xs font-light">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:underline text-xs font-light"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
