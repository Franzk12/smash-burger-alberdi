"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, AlertCircle, ShieldCheck, Utensils } from "lucide-react"

export function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = await login(password)
    if (!success) {
      setError(true)
      setPassword("")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5C800' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tight">
              <span className="text-foreground">Smash</span>
              <span className="text-primary">BURGER</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Sistema de Gestión</p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gestión de Pedidos</h3>
                <p className="text-muted-foreground text-sm">Controlá todos los pedidos en tiempo real desde un solo lugar.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Acceso Seguro</h3>
                <p className="text-muted-foreground text-sm">Solo personal autorizado puede acceder al panel de control.</p>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-foreground">Smash</span>
              <span className="text-primary">BURGER</span>
            </h1>
            <p className="text-muted-foreground mt-1">Sistema de Gestión</p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              Acceso al Panel
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Ingresá la contraseña para continuar
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                  className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-red-500 text-sm">Contraseña incorrecta. Intentá de nuevo.</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  "Ingresar al Panel"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-muted-foreground text-xs">
                Acceso restringido. Solo personal autorizado.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-xs mt-6">
            Smash Burger Alberdi &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}