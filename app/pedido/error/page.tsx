"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PedidoError() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-destructive" />
        </div>
        <h1 className="text-3xl font-black text-foreground">Algo salió mal</h1>
        <p className="text-muted-foreground">
          El pago no se pudo procesar. Podés intentarlo de nuevo o elegir pagar en efectivo.
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
