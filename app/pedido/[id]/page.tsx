"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, ChefHat, Clock, Truck, Store, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type OrderStatus = "pendiente" | "preparando" | "completado";

type TrackingOrder = {
  id: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  order_type: "delivery" | "retiro";
  address?: string;
  items: { name: string; quantity: number; price: number }[];
};

const STEPS: { key: OrderStatus; label: string; icon: any; description: string }[] = [
  { key: "pendiente", label: "Recibido", icon: Clock, description: "Tu pedido llegó al local" },
  { key: "preparando", label: "En preparación", icon: ChefHat, description: "Estamos cocinando tu pedido" },
  { key: "completado", label: "Listo", icon: CheckCircle, description: "Tu pedido está listo" },
];

const STATUS_INDEX: Record<OrderStatus, number> = { pendiente: 0, preparando: 1, completado: 2 };

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/pedido/${id}`);
      if (!res.ok) { setNotFound(true); setLoading(false); return; }
      setOrder(await res.json());
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel(`pedido_${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "pedidos", filter: `id=eq.${id}` },
        (payload) => setOrder(prev => prev ? { ...prev, status: payload.new.status } : prev)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (notFound || !order) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-xl font-black text-muted-foreground">Pedido no encontrado</p>
      <Link href="/" className="text-primary text-sm font-bold hover:underline">Volver al menú</Link>
    </div>
  );

  const stepIndex = STATUS_INDEX[order.status];
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter">
            <span className="text-foreground">Smash</span><span className="text-primary">BURGER</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Seguimiento de pedido</p>
        </div>

        {/* Order ID + client */}
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Pedido</p>
          <p className="text-2xl font-black text-primary tracking-tighter">#{order.id}</p>
          <p className="text-foreground font-bold mt-1">{order.customer_name}</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            {order.order_type === "delivery"
              ? <><Truck className="w-3.5 h-3.5" /> Delivery — {order.address}</>
              : <><Store className="w-3.5 h-3.5" /> Retiro en local</>
            }
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                      done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"
                    )}>
                      <Icon className={cn("w-5 h-5", active && "animate-pulse")} />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn("w-0.5 h-10 transition-all duration-200", done && i < stepIndex ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                  <div className="pt-2 pb-8">
                    <p className={cn("font-bold text-sm", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                    {active && <p className="text-xs text-primary font-medium mt-0.5">{step.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu pedido</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-foreground font-medium"><span className="text-primary font-black mr-1">{item.quantity}×</span>{item.name}</span>
              <span className="text-muted-foreground">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
            </div>
          ))}
          <div className="flex justify-between font-black pt-2 border-t border-border text-sm">
            <span>Total</span>
            <span className="text-primary">${total.toLocaleString("es-AR")}</span>
          </div>
        </div>

        <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
          ← Volver al menú
        </Link>
      </div>
    </main>
  );
}
