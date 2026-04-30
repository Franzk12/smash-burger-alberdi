"use client"

import { useState } from "react"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/lib/products-context"
import type { Order, OrderStatus } from "@/lib/types"
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, Truck,
  LogOut, RefreshCw, MapPin, Store, Banknote, CreditCard,
  AlertCircle, LayoutDashboard, ListFilter, History,
  DollarSign, MoreVertical, LayoutGrid, List, Utensils
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const ESTADOS: Record<OrderStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pendiente: {
    label: "Nuevo Pedido",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30"
  },
  preparando: {
    label: "En Preparación",
    icon: ChefHat,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30"
  },
  completado: {
    label: "Completado",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30"
  }
}

function tiempoDesde(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  return `${Math.floor(diff / 3600)}h`
}

function OrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrders()
  const estado = ESTADOS[order.status]
  const IconoEstado = estado.icon

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
    <div className={cn(
      "bg-[#111111] border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/50",
      estado.border
    )}>
      {/* Card Header */}
      <div className={cn("px-4 py-3 flex justify-between items-center border-b", estado.border, estado.bg)}>
        <span className="font-black text-xs tracking-wider opacity-80">#{order.id}</span>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/20", estado.color)}>
          {estado.label}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Cliente Info */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
              {order.customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-base leading-tight">{order.customerName}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> hace {tiempoDesde(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-primary font-black text-xl tracking-tighter">
              ${order.total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Modalidad y Dirección */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex items-start gap-2">
            {order.orderType === "delivery" ? (
              <>
                <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-foreground">Delivery</p>
                  <p className="text-muted-foreground">{order.address}</p>
                </div>
              </>
            ) : (
              <>
                <Store className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-foreground">Retiro en Local</p>
                  <p className="text-muted-foreground">Cliente viene a buscar</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                <b className="text-primary mr-1">{item.quantity}</b> {item.name}
              </span>
              <span className="opacity-60">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
            </div>
          ))}
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="mt-2 p-2.5 rounded-lg bg-yellow-400/5 border border-yellow-400/20 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-yellow-200/80 leading-relaxed italic">
              {order.notes}
            </p>
          </div>
        )}

        <div className="flex-1" />

        {/* Footer info: Pago y Acción */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-50">
              {order.paymentMethod === "efectivo" ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{order.paymentMethod}</span>
            </div>
            {order.phone && (
              <button
                onClick={notificarCliente}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Store className="w-3 h-3" /> Notificar WhatsApp
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            {order.status === "pendiente" && (
              <button
                onClick={() => updateOrderStatus(order.id, "preparando")}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <ChefHat className="w-3.5 h-3.5" />
                Preparar
              </button>
            )}
            {order.status === "preparando" && (
              <button
                onClick={() => updateOrderStatus(order.id, "completado")}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-black hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Completar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminPanel() {
  const { orders, pendingCount, preparingCount, completedCount, totalSales, loading, refresh } = useOrders()
  const { products, updateProduct } = useProducts()
  const { logout } = useAuth()
  const [filtro, setFiltro] = useState<OrderStatus | "todos">("todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"pedidos" | "menu">("pedidos")

  const pedidosFiltrados = filtro === "todos"
    ? orders.filter(o => o.status !== "completado")
    : orders.filter(o => o.status === filtro)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-black w-full">
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]">
          <SidebarHeader className="p-6">
            <h2 className="text-2xl font-black tracking-tighter">
              <span className="text-foreground">Smash</span>
              <span className="text-primary">BURGER</span>
            </h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-50">Sistema de Pedidos</p>
          </SidebarHeader>

          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarGroupLabel className="text-muted-foreground/50 font-bold tracking-widest text-[10px] uppercase">
                  Pedidos
                </SidebarGroupLabel>
                {[
                  { id: "todos",      label: "Activos",    icon: LayoutDashboard, count: pendingCount + preparingCount, color: "text-primary" },
                  { id: "pendiente",  label: "Nuevos",     icon: Clock,           count: pendingCount,                  color: "text-yellow-400" },
                  { id: "preparando", label: "Preparando", icon: ChefHat,         count: preparingCount,                color: "text-blue-400" },
                  { id: "completado", label: "Historial",  icon: History,         count: completedCount,                color: "text-green-400" },
                ].map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => { setActiveTab("pedidos"); setFiltro(item.id as any); }}
                      isActive={activeTab === "pedidos" && filtro === item.id}
                      className={cn(
                        "h-12 px-4 rounded-xl transition-all duration-300",
                        activeTab === "pedidos" && filtro === item.id ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 mr-3", activeTab === "pedidos" && filtro === item.id ? "text-primary-foreground" : item.color)} />
                      <span className="flex-1">{item.label}</span>
                      {item.count > 0 && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black",
                          activeTab === "pedidos" && filtro === item.id ? "bg-black/20 text-primary-foreground" : "bg-white/10 text-foreground"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarGroupLabel className="text-muted-foreground/50 font-bold tracking-widest text-[10px] uppercase mt-4">
                  Administración
                </SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab("menu")}
                    isActive={activeTab === "menu"}
                    className={cn(
                      "h-12 px-4 rounded-xl transition-all duration-300",
                      activeTab === "menu" ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
                    )}
                  >
                    <Utensils className={cn("w-5 h-5 mr-3", activeTab === "menu" ? "text-primary-foreground" : "text-muted-foreground")} />
                    <span className="flex-1">Gestionar Menú</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <button
              onClick={logout}
              className="w-full h-12 flex items-center px-4 gap-3 rounded-xl border border-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-[#050505] flex-1">
          {/* Main Header */}
          <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-foreground">{activeTab === "pedidos" ? "Panel de Control" : "Gestión de Menú"}</h1>
              <p className="text-xs text-muted-foreground font-medium">{activeTab === "pedidos" ? "Gestión de pedidos en tiempo real" : "Edita precios y disponibilidad"}</p>
            </div>

            {activeTab === "pedidos" && (
              <div className="flex items-center gap-4">
                <div className="bg-white/5 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={refresh}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-muted-foreground"
                >
                  <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </button>
              </div>
            )}

          </header>

          <div className="p-8 space-y-8">
            {activeTab === "pedidos" ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Nuevos",     value: pendingCount,   icon: Clock,      color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                    { label: "Preparando", value: preparingCount, icon: ChefHat,    color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
                    { label: "Completados",value: completedCount, icon: CheckCircle, color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20" },
                    { label: "Ventas",     value: `$${totalSales.toLocaleString("es-AR")}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                  ].map((stat, i) => (
                    <div key={i} className={cn("p-5 rounded-2xl border bg-[#0a0a0a] flex items-center gap-4 transition-all hover:scale-[1.02]", stat.border)}>
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                        <p className={cn("text-2xl font-black mt-0.5 tracking-tighter", stat.color)}>{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orange Alert Bar */}
                {pendingCount > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between text-orange-400">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <p className="font-bold text-sm">{pendingCount} {pendingCount === 1 ? 'pedido nuevo esperando' : 'pedidos nuevos esperando'}</p>
                    </div>
                    <Clock className="w-4 h-4 opacity-50" />
                  </div>
                )}

                {/* Orders Grid */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 opacity-20">
                    <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-black uppercase tracking-widest text-sm">Cargando Pedidos</p>
                  </div>
                ) : pedidosFiltrados.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="font-black uppercase tracking-widest text-sm text-center">
                      No hay pedidos {filtro !== "todos" ? `en "${filtro}"` : "activos"}
                    </p>
                  </div>
                ) : (
                  <div className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  )}>
                    {pedidosFiltrados.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-[#1a1a1a] border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-black tracking-widest">Producto</th>
                        <th className="px-6 py-4 font-black tracking-widest">Categoría</th>
                        <th className="px-6 py-4 font-black tracking-widest">Precio</th>
                        <th className="px-6 py-4 font-black tracking-widest">Estado</th>
                        <th className="px-6 py-4 font-black tracking-widest text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground">{product.name}</td>
                          <td className="px-6 py-4 text-muted-foreground capitalize">{product.category}</td>
                          <td className="px-6 py-4 text-primary font-black">
                            <input
                              type="number"
                              defaultValue={product.price}
                              onBlur={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                              className="bg-transparent border border-white/10 rounded px-2 py-1 w-24 focus:border-primary focus:outline-none text-right"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-full",
                              product.available ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}>
                              {product.available ? "Activo" : "Pausado"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => updateProduct(product.id, { available: !product.available })}
                              className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-2"
                            >
                              {product.available ? "Pausar" : "Activar"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
