"use client"

import { useState, useEffect } from "react"
import { Play, Square, RefreshCw, Smartphone, LogOut, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type BotStatus = {
  status: "APAGADO" | "INICIANDO" | "QR_READY" | "CONECTADO" | "DESCONECTADO"
  qr: string | null
}

export function BotAdmin() {
  const [botState, setBotState] = useState<BotStatus>({ status: "APAGADO", qr: null })
  const [loading, setLoading] = useState(false)

  const fetchStatus = async () => {
    try {
      const password = typeof window !== 'undefined' ? sessionStorage.getItem("smash_pass") : ""
      const res = await fetch("/api/bot", {
        headers: { "x-panel-password": password || "" }
      })
      if (res.ok) {
        const data = await res.json()
        setBotState(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Poll every 3 seconds
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (action: "start" | "stop" | "logout") => {
    if (action === "logout" && !confirm("¿Seguro que quieres desvincular este WhatsApp? Tendrás que volver a escanear un código QR.")) return;
    
    setLoading(true)
    try {
      const password = typeof window !== 'undefined' ? sessionStorage.getItem("smash_pass") : ""
      await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-panel-password": password || ""
        },
        body: JSON.stringify({ action })
      })
      await fetchStatus()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    "APAGADO": "bg-red-500/10 text-red-500 border-red-500/20",
    "INICIANDO": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "QR_READY": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "CONECTADO": "bg-green-500/10 text-green-500 border-green-500/20",
    "DESCONECTADO": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  }

  const isRunning = botState.status !== "APAGADO"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Bot de WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Controla el asistente automático de respuestas.</p>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2", statusColors[botState.status])}>
          {botState.status === "INICIANDO" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          {botState.status}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel de Control */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Estado del Motor</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              El bot de WhatsApp responde automáticamente a tus clientes, envía el menú, los precios y les facilita el enlace de pedidos.
              Debe estar <strong className="text-foreground">Encendido</strong> para funcionar.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {!isRunning ? (
              <button
                onClick={() => handleAction("start")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> Encender Bot
              </button>
            ) : (
              <button
                onClick={() => handleAction("stop")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                <Square className="w-4 h-4" /> Apagar Bot
              </button>
            )}
            
            {botState.status === "CONECTADO" && (
              <button
                onClick={() => handleAction("logout")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-transparent text-muted-foreground py-2 rounded-xl font-bold text-xs hover:text-white transition-all underline underline-offset-2 disabled:opacity-50 mt-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Desvincular Cuenta (Cerrar Sesión)
              </button>
            )}
          </div>
        </div>

        {/* Panel de Dispositivo / QR */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          {botState.status === "APAGADO" && (
            <div className="opacity-30 flex flex-col items-center">
              <Smartphone className="w-16 h-16 mb-4" />
              <p className="font-bold">Bot Apagado</p>
              <p className="text-xs mt-1">Enciende el bot para ver el estado de conexión.</p>
            </div>
          )}

          {botState.status === "INICIANDO" && (
            <div className="flex flex-col items-center text-primary">
              <RefreshCw className="w-12 h-12 mb-4 animate-spin" />
              <p className="font-bold">Iniciando sistema...</p>
            </div>
          )}

          {botState.status === "CONECTADO" && (
            <div className="flex flex-col items-center text-green-500">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                <Smartphone className="w-10 h-10" />
              </div>
              <p className="font-black text-xl">Vinculado Correctamente</p>
              <p className="text-sm text-green-500/70 mt-2">El bot está leyendo y respondiendo mensajes.</p>
            </div>
          )}

          {botState.status === "QR_READY" && botState.qr && (
            <div className="flex flex-col items-center w-full animate-in zoom-in duration-300">
              <div className="bg-white p-4 rounded-xl mb-4 shadow-xl">
                {/* Generador de QR nativo usando API publica para facilidad */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(botState.qr)}`} 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="font-bold text-foreground">Escanea el Código QR</p>
              <ol className="text-xs text-muted-foreground mt-2 text-left space-y-1 list-decimal list-inside">
                <li>Abre WhatsApp en tu celular</li>
                <li>Toca <strong>Dispositivos vinculados</strong></li>
                <li>Toca <strong>Vincular dispositivo</strong></li>
                <li>Apunta la cámara a esta pantalla</li>
              </ol>
            </div>
          )}

          {botState.status === "DESCONECTADO" && (
            <div className="flex flex-col items-center text-orange-500">
              <Smartphone className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold">Desconectado del Teléfono</p>
              <p className="text-xs mt-1 text-orange-500/70">Revisando conexión o intentando reconectar...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
