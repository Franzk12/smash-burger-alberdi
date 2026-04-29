"use client";

import { useSearchParams } from "next/navigation";

export function PedidoExitosoContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");

  if (!paymentId) return null;

  return (
    <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-4 py-2">
      ID de pago: {paymentId}
    </p>
  );
}
