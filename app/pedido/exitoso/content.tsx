"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PedidoExitosoContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const externalReference = params.get("external_reference");

  useEffect(() => {
    if (externalReference) {
      fetch("/api/confirmar-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: externalReference }),
      }).catch(console.error);
    }
  }, [externalReference]);

  if (!paymentId) return null;

  return (
    <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-4 py-2">
      ID de pago: {paymentId}
    </p>
  );
}
