"use client";

import { useState } from "react";
import { X, MapPin, Store, Banknote, CreditCard, CheckCircle, RefreshCw } from "lucide-react";
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
  const [referencia, setReferencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState<"efectivo" | "mercadopago" | "transferencia" | "">("");

  const deliveryFee = zona === "fuera" ? DELIVERY_FEE_OUTSIDE : 0;
  const totalFinal = total + deliveryFee;

  const ALIAS_CBU = "Smashburgeralb";
  const TITULAR = "Smash Burger Alberdi";

  function buildWhatsAppMessage() {
    const lineas = items.map((i) => {
      let itemText = `• ${i.quantity}x ${i.name}`;
      if (i.customizations && i.customizations.length > 0) {
        itemText += `\n  - Agregados: ${i.customizations.map(c => c.name).join(", ")}`;
      }
      if (i.notes) {
        itemText += `\n  - Notas: ${i.notes}`;
      }
      itemText += ` — $${(i.price * i.quantity).toLocaleString("es-AR")}`;
      return itemText;
    });

    const msg = [
      `🍔 *NUEVO PEDIDO - SMASH BURGER*`,
      `--------------------------------`,
      `👤 *Cliente:* ${nombre}`,
      `📞 *Teléfono:* ${telefono}`,
      `📍 *Modalidad:* ${modalidad === "delivery" ? "🚀 Envío a Domicilio" : "🏠 Retiro en Local"}`,
      modalidad === "delivery" ? `🏠 *Dirección:* ${direccion}` : "",
      modalidad === "delivery" && referencia ? `📝 *Ref/Lote:* ${referencia}` : "",
      `--------------------------------`,
      `📦 *Detalle:*`,
      ...lineas,
      `--------------------------------`,
      deliveryFee > 0 ? `*Envío:* $${deliveryFee.toLocaleString("es-AR")}` : "",
      `*TOTAL: $${totalFinal.toLocaleString("es-AR")}*`,
      `💰 *Pago:* ${pago === "efectivo" ? "Efectivo" : pago === "transferencia" ? "Transferencia" : "Mercado Pago"}`,
      pago === "transferencia" ? `\n⚠️ *Enviaré el comprobante a este chat.*` : ""
    ]
      .filter((l) => l !== "")
      .join("\n");

    return encodeURIComponent(msg);
  }

  const [loadingMP, setLoadingMP] = useState(false);
  const [errorMP, setErrorMP] = useState("");

  async function guardarPedido(pagoTipo: string) {
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          items,
          total: totalFinal,
          modalidad,
          direccion,
          referencia,
          zona,
          pago: pagoTipo,
        }),
      });
      return await res.json();
    } catch {
      // Si falla el guardado, el pedido igual se procesa
    }
  }

  async function handleConfirmar() {
    if (pago === "mercadopago") {
      setLoadingMP(true);
      setErrorMP("");
      try {
        const pedidoData = await guardarPedido("mercadopago_pendiente");
        const pedidoId = (pedidoData as any)?.id;

        if (!pedidoId) {
          throw new Error("No se pudo generar el pedido");
        }

        const res = await fetch("/api/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => {
              let name = i.name;
              if (i.customizations && i.customizations.length > 0) {
                name += ` (+ ${i.customizations.map(c => c.name).join(", ")})`;
              }
              if (i.notes) {
                name += ` [Nota: ${i.notes}]`;
              }
              return { name, price: i.price, quantity: i.quantity };
            }),
            nombre,
            telefono,
            modalidad,
            direccion,
            zona,
            orderId: pedidoId,
          }),
        });
        const data = await res.json();
        
        if (data.init_point) {
          window.location.href = data.init_point;
        } else if (data.sandbox_init_point) {
          window.location.href = data.sandbox_init_point;
        } else {
          setErrorMP("No se pudo conectar con MercadoPago. Intentá con efectivo o transferencia.");
        }
      } catch (err) {
        console.error(err);
        setErrorMP("Error de conexión. Intentá de nuevo.");
      } finally {
        setLoadingMP(false);
      }
    } else {
      await guardarPedido(pago);
      const msg = buildWhatsAppMessage();
      const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`;
      window.open(url, "_blank");
      setStep("confirmado");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              {step === "confirmado" ? "¡Pedido enviado!" : "Confirmar pedido"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === "modalidad" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-medium">¿Cómo preferís recibir tu pedido?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setModalidad("retiro")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${
                    modalidad === "retiro" ? "border-primary bg-primary/10" : "bg-white/5 border-white/10 hover:border-primary/30"
                  }`}
                >
                  <Store className={`w-8 h-8 transition-transform group-hover:scale-110 ${modalidad === "retiro" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-bold">Retiro</span>
                </button>
                <button
                  onClick={() => setModalidad("delivery")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${
                    modalidad === "delivery" ? "border-primary bg-primary/10" : "bg-white/5 border-white/10 hover:border-primary/30"
                  }`}
                >
                  <MapPin className={`w-8 h-8 transition-transform group-hover:scale-110 ${modalidad === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-bold">Delivery</span>
                </button>
              </div>

              {modalidad === "delivery" && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Zona de envío</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setZona("alberdi")}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        zona === "alberdi" ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      Barrio Alberdi
                      <span className="block text-[10px] opacity-70">Envío Gratis</span>
                    </button>
                    <button
                      onClick={() => setZona("fuera")}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        zona === "fuera" ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      Fuera de zona
                      <span className="block text-[10px] opacity-70">+$2.000 envío</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                disabled={!modalidad || (modalidad === "delivery" && !zona)}
                onClick={() => setStep("datos")}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black disabled:opacity-40 hover:bg-primary/90 transition-all mt-4"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === "datos" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Nombre / Familia</label>
                <input
                  autoFocus
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: Familia Castillo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="3865123456"
                />
              </div>
              {modalidad === "delivery" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Dirección</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Calle y altura"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Lote / Referencia (Opcional)</label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Lote 5 / Portón blanco"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep("modalidad")}
                  className="flex-1 bg-white/5 text-muted-foreground py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Atrás
                </button>
                <button
                  disabled={!nombre || !telefono || (modalidad === "delivery" && !direccion)}
                  onClick={() => setStep("pago")}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-black disabled:opacity-40 hover:bg-primary/90 transition-all"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === "pago" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-medium">¿Cómo querés pagar?</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPago("efectivo")}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    pago === "efectivo" ? "border-primary bg-primary/10" : "bg-white/5 border-white/10 hover:border-primary/30"
                  }`}
                >
                  <Banknote className={`w-6 h-6 ${pago === "efectivo" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-bold">Efectivo</p>
                    <p className="text-[10px] text-muted-foreground">Pagás al recibir</p>
                  </div>
                </button>
                <button
                  onClick={() => setPago("transferencia")}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    pago === "transferencia" ? "border-primary bg-primary/10" : "bg-white/5 border-white/10 hover:border-primary/30"
                  }`}
                >
                  <RefreshCw className={`w-6 h-6 ${pago === "transferencia" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-bold">Transferencia</p>
                    <p className="text-[10px] text-muted-foreground">Te pasamos el Alias</p>
                  </div>
                </button>
                <button
                  onClick={() => setPago("mercadopago")}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    pago === "mercadopago" ? "border-primary bg-primary/10" : "bg-white/5 border-white/10 hover:border-primary/30"
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${pago === "mercadopago" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-bold">MercadoPago</p>
                    <p className="text-[10px] text-muted-foreground">Tarjeta / Débito (100% seguro)</p>
                  </div>
                </button>
              </div>

              {pago === "transferencia" && (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Datos para transferir</p>
                  <p className="text-sm font-bold text-foreground">{TITULAR}</p>
                  <p className="text-xl font-black text-primary tracking-tight my-1">{ALIAS_CBU}</p>
                  <p className="text-[10px] text-muted-foreground italic">Copiá el Alias y hacé el pago en tu App.</p>
                </div>
              )}

              {errorMP && <p className="text-red-500 text-[10px] font-bold text-center animate-bounce">{errorMP}</p>}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep("datos")}
                  className="flex-1 bg-white/5 text-muted-foreground py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Atrás
                </button>
                <button
                  disabled={!pago || loadingMP}
                  onClick={handleConfirmar}
                  className="flex-[2] bg-primary text-primary-foreground py-4 rounded-xl font-black disabled:opacity-40 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {loadingMP ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {pago === "mercadopago" ? "Pagar ahora" : "Confirmar pedido"}
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "confirmado" && (
            <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <CheckCircle className="w-24 h-24 text-primary relative" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-foreground">¡Listo!</h3>
                <p className="text-muted-foreground">Tu pedido fue enviado al WhatsApp del local.</p>
              </div>
              <button
                onClick={() => { onSuccess(); onClose(); }}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Volver al menú
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
