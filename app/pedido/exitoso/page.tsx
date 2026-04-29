"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PedidoExitoso() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-primary" />
        </div>
        <h1 className="text-3xl font-black text-foreground">¡Pago confirmado!</h1>
        <p className="text-muted-foreground">
          Tu pedido fue pagado y enviado al local. Te van a avisar por WhatsApp cuando esté listo.
        </p>
        {paymentId && (
          <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-4 py-2">
            ID de pago: {paymentId}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          ⏱ Tiempo estimado: hasta 30 minutos
        </p>
        <Link
          href="/"
          className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Volver al menú
        </Link>
      </div>
    </main>
  );
}
