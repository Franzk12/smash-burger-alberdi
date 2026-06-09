"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"

const StoreStatusContext = createContext(true)

export function StoreStatusProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase
        .from("store_config")
        .select("*")
        .eq("key", "store_status")
        .single()
      if (data) setIsOpen(data.value === "open")
    }

    fetchStatus()

    const channel = supabase
      .channel("store_status_public")
      .on("postgres_changes", { event: "*", table: "store_config", schema: "public" }, fetchStatus)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <StoreStatusContext.Provider value={isOpen}>
      {children}
    </StoreStatusContext.Provider>
  )
}

export function useStoreStatus() {
  return useContext(StoreStatusContext)
}
