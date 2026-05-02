export type OrderItem = {
  name: string
  quantity: number
  price: number
  customizations?: { name: string; price: number }[]
  notes?: string
}

export type OrderType = 'retiro' | 'delivery'

export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago' | 'mercadopago_pendiente'

export type OrderStatus = 'pendiente' | 'preparando' | 'completado'

export type Order = {
  id: string
  customerName: string
  items: OrderItem[]
  total: number
  orderType: OrderType
  address?: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: Date
  phone?: string
  notes?: string
}

export type OrdersContextType = {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addOrder: (order: Order) => void
  pendingCount: number
  preparingCount: number
  completedCount: number
  totalSales: number
  loading: boolean
  refresh: () => void
  isOpen: boolean
  toggleStoreStatus: () => Promise<void>
}