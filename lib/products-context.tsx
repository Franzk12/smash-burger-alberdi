"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type Product = {
  id: string
  name: string
  price: number
  description: string
  category: "burger" | "milanesa" | "papa" | "extra"
  available: boolean
  image_url?: string
}

type ProductsContextType = {
  products: Product[]
  loading: boolean
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  refresh: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children, isAdmin = false }: { children: ReactNode, isAdmin?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const url = isAdmin ? "/api/productos?admin=true" : "/api/productos"
      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()
      if (data.productos) {
        setProducts(data.productos)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )

    try {
      const password = typeof window !== 'undefined' ? sessionStorage.getItem("smash_pass") : ""
      const res = await fetch("/api/productos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-panel-password": password || "",
        },
        body: JSON.stringify({ id, ...updates }),
      })
      
      if (!res.ok) {
        // Revert on failure by refetching
        fetchProducts()
      }
    } catch (error) {
      console.error("Error updating product:", error)
      fetchProducts()
    }
  }

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const password = typeof window !== 'undefined' ? sessionStorage.getItem("smash_pass") : ""
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-panel-password": password || "",
        },
        body: JSON.stringify(product),
      })
      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const deleteProduct = async (id: string) => {
    // Optimistic delete
    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      const password = typeof window !== 'undefined' ? sessionStorage.getItem("smash_pass") : ""
      const res = await fetch("/api/productos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-panel-password": password || "",
        },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      fetchProducts()
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        updateProduct,
        addProduct,
        deleteProduct,
        refresh: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
