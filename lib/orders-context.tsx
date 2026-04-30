"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Order, OrderStatus } from "./types"
import { useAuth } from "./auth-context"

type OrdersContextType = {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addOrder: (order: Order) => void
  pendingCount: number
  preparingCount: number
  loading: boolean
  refresh: () => void
  [key: string]: any
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { password } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/pedidos", {
        headers: { "x-panel-password": password },
      })
      if (!res.ok) return
      const data = await res.json()

      // Convertir formato API → formato Order del panel
      const mapped: Order[] = data.pedidos.map((p: any) => ({
        id: p.id,
        customerName: p.nombre,
        items: p.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total: p.total,
        orderType: p.modalidad,
        address: p.direccion,
        paymentMethod: p.pago,
        status: p.estado === "en-preparacion" ? "preparando" : p.estado,
        createdAt: new Date(p.timestamp),
        notes: p.zona === "fuera" ? "Fuera de zona (+$2.000 envío)" : undefined,
      }))
      setOrders(mapped)
    } finally {
      setLoading(false)
    }
  }, [password])

  // Cargar pedidos al montar y auto-refresh cada 15s
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Actualizar localmente primero (optimistic update)
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    )
    // Sincronizar con la API
    const apiEstado = status === "preparando" ? "en-preparacion" : status
    await fetch("/api/pedidos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-panel-password": password,
      },
      body: JSON.stringify({ id: orderId, estado: apiEstado }),
    })
  }

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const pendingCount = orders.filter((o) => o.status === "pendiente").length
  const preparingCount = orders.filter((o) => o.status === "preparando").length

  return (
    <OrdersContext.Provider
      value={{ orders, updateOrderStatus, addOrder, pendingCount, preparingCount, loading, refresh: fetchOrders }}
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