"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { supabase } from "./supabase"
import type { Order, OrderStatus, OrdersContextType } from "./types"

type StoreConfig = {
  isOpen: boolean
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { password } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(true)

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .eq('key', 'store_status')
        .single()
      
      if (data) {
        setIsOpen(data.value === 'open')
      }
    } catch (e) {
      console.error("Error fetching config:", e)
    }
  }, [])

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
    fetchConfig()

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
  }, [fetchOrders, fetchConfig])

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

  const toggleStoreStatus = async () => {
    const newStatus = !isOpen ? 'open' : 'closed'
    setIsOpen(!isOpen) // Optimistic

    try {
      const { error } = await supabase
        .from('store_config')
        .upsert({ key: 'store_status', value: newStatus })
      
      if (error) throw error
    } catch (e) {
      console.error("Error updating store status:", e)
      setIsOpen(isOpen) // Revert
    }
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
        isOpen,
        toggleStoreStatus
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
