"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  password: string
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    const savedPass = sessionStorage.getItem("smash_pass")
    if (savedPass) {
      setPassword(savedPass)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (pass: string): Promise<boolean> => {
    // Valida contra la API real
    const res = await fetch("/api/pedidos", {
      headers: { "x-panel-password": pass },
    })
    if (res.ok) {
      setIsAuthenticated(true)
      setPassword(pass)
      sessionStorage.setItem("smash_pass", pass)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setPassword("")
    sessionStorage.removeItem("smash_pass")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, password, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}