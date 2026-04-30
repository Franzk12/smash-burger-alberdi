"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Order, OrderStatus } from "./types"

const generateDemoOrders = (): Order[] => {
  const now = new Date()
  return [
    {
      id: "ORD-001",
      customerName: "Juan Pérez",
      items: [
        { name: "Big Smash", quantity: 2, price: 4500 },
        { name: "Papas Smash", quantity: 1, price: 2000 },
      ],
      total: 11000,
      orderType: "delivery",
      address: "Av. Alberdi 1234, Piso 2",
      paymentMethod: "transferencia",
      status: "pendiente",
      createdAt: new Date(now.getTime() - 5 * 60000),
      phone: "3865123456",
    },
    {
      id: "ORD-002",
      customerName: "María González",
      items: [
        { name: "Cheese Burger", quantity: 1, price: 4000 },
        { name: "Crispy Onion", quantity: 1, price: 5000 },
        { name: "Aros de Cebolla", quantity: 1, price: 1500 },
      ],
      total: 10500,
      orderType: "retiro",
      paymentMethod: "efectivo",
      status: "preparando",
      createdAt: new Date(now.getTime() - 15 * 60000),
      phone: "3865654321",
    },
    {
      id: "ORD-003",
      customerName: "Carlos Rodríguez",
      items: [
        { name: "OKC Smash", quantity: 3, price: 5500 },
        { name: "Salchipapa", quantity: 2, price: 3000 },
        { name: "Bacon", quantity: 3, price: 800 },
      ],
      total: 24900,
      orderType: "delivery",
      address: "Calle San Martín 567",
      paymentMethod: "mercadopago",
      status: "pendiente",
      createdAt: new Date(now.getTime() - 2 * 60000),
      phone: "3865789012",
      notes: "Sin cebolla en las hamburguesas",
    },
  ]
}

type OrdersContextType = {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addOrder: (order: Order) => void
  pendingCount: number
  preparingCount: number
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setOrders(generateDemoOrders())
  }, [])

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const pendingCount = orders.filter((o) => o.status === "pendiente").length
  const preparingCount = orders.filter((o) => o.status === "preparando").length

  return (
    <OrdersContext.Provider
      value={{ orders, updateOrderStatus, addOrder, pendingCount, preparingCount }}
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