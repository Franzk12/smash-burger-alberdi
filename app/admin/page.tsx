"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { OrdersProvider } from "@/lib/orders-context"
import { LoginForm } from "@/components/admin/login-form"
import { AdminPanel } from "@/components/admin/admin-panel"

function AdminContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <OrdersProvider>
      <AdminPanel />
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