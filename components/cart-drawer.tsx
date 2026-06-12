"use client";

import { X, Minus, Plus, Trash2, ShoppingCart, AlertCircle, Clock, StickyNote } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutModal } from "./checkout-modal";
import { useState, useEffect, useRef, useId } from "react";
import { useStoreStatus } from "@/lib/store-status-context";
import { useModalA11y } from "@/lib/use-modal-a11y";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const isOpen = useStoreStatus();
  const [waitMinutes, setWaitMinutes] = useState<number | null>(null);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/tiempo-espera")
      .then(r => r.json())
      .then(d => setWaitMinutes(d.minutos))
      .catch(() => {});
  }, [open]);

  // Escape, scroll-lock, foco inicial y focus trap (ver lib/use-modal-a11y).
  useModalA11y(dialogRef, onClose, { enabled: open, initialFocusRef: closeButtonRef });

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl transform-gpu animate-in slide-in-from-right duration-300 motion-reduce:animate-none focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 id={titleId} className="text-lg font-bold text-foreground">Tu pedido</h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 animate-in fade-in zoom-in duration-200 motion-reduce:animate-none">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 opacity-20" />
              </div>
              <p className="text-center font-medium">
                Tu carrito está vacío.<br/>
                <span className="text-sm font-normal text-muted-foreground/60 italic">¡Elegí algo rico del menú!</span>
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="flex items-center gap-4 bg-secondary/50 border border-border/30 rounded-2xl p-4 hover:border-primary/30 transition-colors duration-300 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-primary text-sm font-black mt-0.5">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </p>
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.customizations.map(c => (
                        <span key={c.name} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                          + {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-[10px] italic text-muted-foreground/80 leading-tight mt-2 bg-black/5 p-1.5 rounded-lg border border-border/20 flex items-start gap-1.5">
                      <StickyNote className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{item.notes}</span>
                    </p>
                  )}
                </div>

                {/* Controles cantidad */}
                <div className="flex flex-col items-center gap-2 bg-background/50 rounded-full p-1 border border-border/50">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    aria-label={`Sumar uno a ${item.name}`}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none motion-reduce:hover:scale-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-black text-sm" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    aria-label={item.quantity === 1 ? `Quitar ${item.name}` : `Restar uno a ${item.name}`}
                    className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:text-destructive hover:border-destructive transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con total y botón */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-border bg-card/80 backdrop-blur-md space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="text-muted-foreground font-bold">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-black text-lg uppercase tracking-tighter">Total</span>
                <span className="text-primary font-black text-2xl drop-shadow-sm">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-y border-border/50 py-2">
              <p className="text-[10px] text-muted-foreground italic">
                * Envío se calcula según tu ubicación.
              </p>
              {waitMinutes !== null && (
                <span className="text-[10px] font-black text-primary flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{waitMinutes} min
                </span>
              )}
            </div>

            {isOpen ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Confirmar pedido
                <span className="animate-bounce-x motion-reduce:animate-none" aria-hidden="true">→</span>
              </button>
            ) : (
              <div role="alert" className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-wider">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  Local Cerrado
                </div>
                <p className="text-[11px] text-muted-foreground text-center font-medium">No estamos aceptando pedidos en este momento. ¡Volvé pronto!</p>
              </div>
            )}
            
            <button
              onClick={() => { clearCart(); onClose(); }}
              className="w-full text-muted-foreground/60 text-xs font-bold uppercase tracking-widest hover:text-destructive transition-colors py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-lg"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>

      {/* Modal de checkout */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            clearCart();
            onClose();
          }}
        />
      )}
    </>
  );
}
