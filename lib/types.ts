export type OrderItem = {
  name: string
  quantity: number
  price: number
}

export type OrderType = 'retiro' | 'delivery'

export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago'

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