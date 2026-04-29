"use client";

import { useState } from "react";
import { X, MapPin, Store, Banknote, CreditCard, CheckCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";

const WHATSAPP_NUMBER = "5493865228354";
const DELIVERY_FEE_OUTSIDE = 2000;

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type Step = "modalidad" | "datos" | "pago" | "confirmado";

export function CheckoutModal({ onClose, onSuccess }: Props) {
  const { items, total } = useCart();

  const [step, setStep] = useState<Step>("modalidad");
  const [modalidad, setModalidad] = useState<"retiro" | "delivery" | "">("");
  const [zona, setZona] = useState<"alberdi" | "fuera" | "">("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pago, setPago] = useState<"efectivo" | "mercadopago" | "">("");

  const deliveryFee = zona === "fuera" ? DELIVERY_FEE_OUTSIDE : 0;
  const totalFinal = total + deliveryFee;

  function buildWhatsAppMessage() {
    const lineas = items.map(
      (i) => `• ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toLocaleString("es-AR")}`
    );

    const modalidadTexto =
      modalidad === "retiro"
        ? "🏪 *Retiro en local*"
        : `🛵 *Delivery* — ${direccion} (${zona === "alberdi" ? "zona Alberdi, envío gratis" : "fuera de zona, +$2000"})`;

    const pagoTexto =
      pago === "efectivo" ? "💵 Efectivo al recibir" : "📱 MercadoPago";

    const msg = [
      `🍔 *NUEVO PEDIDO — SMASH BURGER*`,
      ``,
      `👤 *Cliente:* ${nombre}`,
      ``,
      `*Productos:*`,
      ...lineas,
      ``,
      modalidadTexto,
      `💳 *Pago:* ${pagoTexto}`,
      ``,
      `*Subtotal:* $${total.toLocaleString("es-AR")}`,
      deliveryFee > 0 ? `*Envío:* $${deliveryFee.toLocaleString("es-AR")}` : "",
      `*TOTAL: $${totalFinal.toLocaleString("es-AR")}*`,
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    return encodeURIComponent(msg);
  }

  function handleConfirmar() {
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setStep("confirmado");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-lg">
            {step === "confirmado" ? "¡Pedido enviado!" : "Confirmar pedido"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">

          {/* PASO 1: Modalidad */}
          {step === "modalidad" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">¿Cómo querés recibir tu pedido?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModalidad("retiro")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    modalidad === "retiro"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Store className={`w-8 h-8 ${modalidad === "retiro" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm text-foreground">Retiro</span>
                  <span className="text-xs text-muted-foreground">en el local</span>
                </button>
                <button
                  onClick={() => setModalidad("delivery")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    modalidad === "delivery"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <MapPin className={`w-8 h-8 ${modalidad === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm text-foreground">Delivery</span>
                  <span className="text-xs text-muted-foreground">a domicilio</span>
                </button>
              </div>

              {modalidad === "delivery" && (
                <div className="space-y-2 pt-1">
                  <p className="text-sm text-muted-foreground">¿Tu dirección está en Alberdi?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setZona("alberdi")}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        zona === "alberdi" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      Sí, zona Alberdi
                      <span className="block text-xs font-normal">Envío gratis</span>
                    </button>
                    <button
                      onClick={() => setZona("fuera")}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        zona === "fuera" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      No, otra zona
                      <span className="block text-xs font-normal">+$2.000 envío</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                disabled={!modalidad || (modalidad === "delivery" && !zona)}
                onClick={() => setStep("datos")}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors mt-2"
              >
                Continuar
              </button>
            </div>
          )}

          {/* PASO 2: Datos */}
          {step === "datos" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">Tus datos para el pedido</p>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tu nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              {modalidad === "delivery" && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Dirección de entrega *</label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej: San Martín 450, Alberdi"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setStep("modalidad")}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg text-sm hover:border-primary/50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  disabled={!nombre || (modalidad === "delivery" && !direccion)}
                  onClick={() => setStep("pago")}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Pago */}
          {step === "pago" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">¿Cómo querés pagar?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPago("efectivo")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    pago === "efectivo" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Banknote className={`w-8 h-8 ${pago === "efectivo" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm text-foreground">Efectivo</span>
                  <span className="text-xs text-muted-foreground">Al recibir</span>
                </button>
                <button
                  onClick={() => setPago("mercadopago")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    pago === "mercadopago" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <CreditCard className={`w-8 h-8 ${pago === "mercadopago" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm text-foreground">MercadoPago</span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </button>
              </div>

              {/* Resumen */}
              <div className="bg-secondary rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-AR")}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío (fuera de zona)</span>
                    <span>${deliveryFee.toLocaleString("es-AR")}</span>
                  </div>
                )}
                {deliveryFee === 0 && modalidad === "delivery" && (
                  <div className="flex justify-between text-green-400">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-2">
                  <span>Total</span>
                  <span className="text-primary">${totalFinal.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("datos")}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg text-sm hover:border-primary/50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  disabled={!pago}
                  onClick={handleConfirmar}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* CONFIRMADO */}
          {step === "confirmado" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle className="w-16 h-16 text-primary" />
              <h3 className="text-xl font-bold text-foreground">¡Pedido enviado!</h3>
              <p className="text-muted-foreground text-sm">
                Tu pedido fue enviado por WhatsApp. El local te va a confirmar en minutos y te avisa cuando está listo.
              </p>
              <p className="text-xs text-muted-foreground">
                Tiempo estimado: hasta 30 minutos
              </p>
              <button
                onClick={onSuccess}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors mt-2"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
