"use client"

import { useState } from "react"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import type { Order, OrderStatus } from "@/lib/types"
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, Truck,
  LogOut, RefreshCw, MapPin, Store, Banknote, CreditCard,
  AlertCircle
} from "lucide-react"

const ESTADOS: {
  key: OrderStatus
  label: string
  icon: any
  color: string
  bg: string
}[] = [
  { key: "pendiente",   label: "Pendiente",      icon: Clock,       color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { key: "preparando",  label: "Preparando",     icon: ChefHat,     color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30" },
  { key: "completado",  label: "Completado",     icon: CheckCircle, color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30" },
]

function tiempoDesde(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  return `${Math.floor(diff / 3600)}h`
}

function OrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrders()
  const estadoInfo = ESTADOS.find(e => e.key === order.status) ?? ESTADOS[0]
  const EstadoIcon = estadoInfo.icon

  function notificarCliente() {
    if (!order.phone) return
    const numero = `549${order.phone.replace(/\D/g, "")}`
    const modalidadTexto = order.orderType === "delivery"
      ? `Tu pedido está en camino 🛵 Dirección: ${order.address}`
      : "Tu pedido está listo para retirar en el local 🏪"
    const msg = encodeURIComponent(
      `¡Hola ${order.customerName}! 👋\n\n` +
      `*Tu pedido de Smash Burger está listo* 🍔🔥\n\n` +
      `${modalidadTexto}\n\n` +
      `*Total:* $${order.total.toLocaleString("es-AR")}\n\n` +
      `¡Gracias por elegirnos! 😊`
    )
    window.open(`https://wa.me/${numero}?text=${msg}`, "_blank")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground text-lg">{order.customerName}</span>
            <span className="text-xs text-muted-foreground">#{order.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              hace {tiempoDesde(order.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              {order.orderType === "delivery"
                ? <><MapPin className="w-3 h-3" /> Delivery</>
                : <><Store className="w-3 h-3" /> Retiro</>
              }
            </span>
            <span className="flex items-center gap-1">
              {order.paymentMethod === "efectivo"
                ? <><Banknote className="w-3 h-3" /> Efectivo</>
                : <><CreditCard className="w-3 h-3" /> MercadoPago</>
              }
            </span>
          </div>
          {order.address && (
            <p className="text-sm text-muted-foreground mt-1">📍 {order.address}</p>
          )}
          {order.notes && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-yellow-400" />
              <p className="text-xs text-yellow-400">{order.notes}</p>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${estadoInfo.bg} ${estadoInfo.color}`}>
          <EstadoIcon className="w-3 h-3" />
          {estadoInfo.label}
        </div>
      </div>

      {/* Productos */}
      <div className="bg-secondary rounded-lg p-3 space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-foreground">
              <span className="text-primary font-bold">{item.quantity}x</span> {item.name}
            </span>
            <span className="text-muted-foreground">
              ${(item.price * item.quantity).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-1.5 flex justify-between font-bold text-sm">
          <span className="text-foreground">Total</span>
          <span className="text-primary">${order.total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      {/* Botones de estado */}
      <div className="flex gap-2 flex-wrap">
        {ESTADOS.filter(e => e.key !== order.status).map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => {
              updateOrderStatus(order.id, key)
              if (key === "completado" && order.phone) notificarCliente()
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:border-primary/50 transition-colors ${color}`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
        {order.phone && (
          <button
            onClick={notificarCliente}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            📱 Notificar cliente
          </button>
        )}
      </div>
    </div>
  )
}

export function AdminPanel() {
  const { orders, pendingCount, preparingCount, loading, refresh } = useOrders()
  const { logout } = useAuth()
  const [filtro, setFiltro] = useState<OrderStatus | "todos">("todos")

  const pedidosFiltrados = filtro === "todos"
    ? orders.filter(o => o.status !== "completado")
    : orders.filter(o => o.status === filtro)

  const completadoCount = orders.filter(o => o.status === "completado").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-black text-foreground text-lg leading-none">Panel de Pedidos</h1>
              <p className="text-xs text-muted-foreground">Smash Burger Alberdi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Contadores */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "pendiente",  label: "Pendientes",   count: pendingCount,   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", icon: Clock },
            { key: "preparando", label: "Preparando",   count: preparingCount, color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30",    icon: ChefHat },
            { key: "completado", label: "Completados",  count: completadoCount,color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30",  icon: CheckCircle },
          ].map(({ key, label, count, color, bg, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFiltro(filtro === key ? "todos" : key as OrderStatus)}
              className={`rounded-xl border p-4 text-left transition-all ${bg} ${filtro === key ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`text-2xl font-black ${color}`}>{count}</span>
              </div>
              <p className="text-muted-foreground text-xs">{label}</p>
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 opacity-40" />
            <p>Cargando pedidos...</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p>No hay pedidos {filtro !== "todos" ? `"${filtro}"` : "activos"}</p>
            <p className="text-xs mt-1">Se actualiza cada 15 segundos automáticamente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosFiltrados.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
