"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { supabase } from "./supabase"
import type { Order, OrderStatus, OrdersContextType } from "./types"

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { password } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/pedidos", {
        headers: { "x-panel-password": password || "" },
      })
      if (!res.ok) return
      const data = await res.json()

      if (data.pedidos) {
        const formatted: Order[] = data.pedidos.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }))
        setOrders(formatted)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }, [password])

  useEffect(() => {
    fetchOrders()

    // Configurar Realtime con Supabase
    const channel = supabase
      .channel('pedidos_cambios')
      .on(
        'postgres_changes',
        { event: '*', table: 'pedidos', schema: 'public' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Actualizar localmente primero (optimistic update)
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    )
    
    await fetch("/api/pedidos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-panel-password": password || "",
      },
      body: JSON.stringify({ id: orderId, estado: status }),
    })
  }

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const pendingCount = orders.filter((o) => o.status === "pendiente").length
  const preparingCount = orders.filter((o) => o.status === "preparando").length
  const completedCount = orders.filter((o) => o.status === "completado").length
  const totalSales = orders
    .filter((o) => o.status === "completado")
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <OrdersContext.Provider
      value={{
        orders,
        updateOrderStatus,
        addOrder,
        pendingCount,
        preparingCount,
        completedCount,
        totalSales,
        loading,
        refresh: fetchOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
