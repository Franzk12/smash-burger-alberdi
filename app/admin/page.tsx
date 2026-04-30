"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { OrdersProvider } from "@/lib/orders-context"
import { ProductsProvider } from "@/lib/products-context"
import { LoginForm } from "@/components/admin/login-form"
import { AdminPanel } from "@/components/admin/admin-panel"

function AdminContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <OrdersProvider>
      <ProductsProvider isAdmin={true}>
        <AdminPanel />
      </ProductsProvider>
    </OrdersProvider>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  )
}