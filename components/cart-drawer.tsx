"use client";

import { X, Minus, Plus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutModal } from "./checkout-modal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase
        .from('store_config')
        .select('*')
        .eq('key', 'store_status')
        .single();
      if (data) {
        setIsOpen(data.value === 'open');
      }
    }
    if (open) fetchStatus();
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Tu pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 animate-in fade-in zoom-in duration-500">
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
                className="flex items-center gap-4 bg-secondary/50 backdrop-blur-sm border border-border/30 rounded-2xl p-4 hover:border-primary/30 transition-all duration-300 group"
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
                    <p className="text-[10px] italic text-muted-foreground/80 leading-tight mt-2 bg-black/5 p-1.5 rounded-lg border border-border/20">
                      📝 {item.notes}
                    </p>
                  )}
                </div>

                {/* Controles cantidad */}
                <div className="flex flex-col items-center gap-2 bg-background/50 rounded-full p-1 border border-border/50">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-black text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:text-destructive hover:border-destructive transition-all shadow-sm"
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
            
            <p className="text-[10px] text-muted-foreground text-center italic border-y border-border/50 py-2">
              * El costo de envío se calculará en el siguiente paso según tu ubicación.
            </p>

            {isOpen ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3"
              >
                Confirmar pedido
                <span className="animate-bounce-x">→</span>
              </button>
            ) : (
              <div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-wider">
                  <AlertCircle className="w-5 h-5" />
                  Local Cerrado
                </div>
                <p className="text-[11px] text-muted-foreground text-center font-medium">No estamos aceptando pedidos en este momento. ¡Volvé pronto!</p>
              </div>
            )}
            
            <button
              onClick={() => { clearCart(); onClose(); }}
              className="w-full text-muted-foreground/60 text-xs font-bold uppercase tracking-widest hover:text-destructive transition-colors py-2"
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
