"use client";

import { X, Plus, Minus, Check } from "lucide-react";
import { useState, useRef, useId } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/products-context";
import { useModalA11y } from "@/lib/use-modal-a11y";

type Props = {
  product: Product;
  extras: Product[];
  onClose: () => void;
};

export function ProductModal({ product, extras, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [notes, setNotes] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape, scroll-lock, foco inicial y focus trap (ver lib/use-modal-a11y).
  useModalA11y(dialogRef, onClose, { initialFocusRef: closeButtonRef });

  const toggleExtra = (extra: Product) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) {
        return prev.filter((e) => e.name !== extra.name);
      }
      return [...prev, { name: extra.name, price: extra.price }];
    });
  };

  const totalPrice = (product.price + selectedExtras.reduce((sum, e) => sum + e.price, 0)) * quantity;

  const handleAdd = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price + selectedExtras.reduce((sum, e) => sum + e.price, 0),
      category: product.category as any,
      customizations: selectedExtras,
      notes: notes.trim(),
    };

    // Since our addItem handles quantity internally by adding 1, 
    // but here we might want to add multiple at once if we had a quantity selector in modal.
    // Actually, our context addItem adds only 1 at a time. 
    // Let's call it 'quantity' times.
    for (let i = 0; i < quantity; i++) {
      addItem(itemToAdd);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150 motion-reduce:animate-none"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transform-gpu animate-in zoom-in-95 fade-in duration-200 motion-reduce:animate-none focus:outline-none"
      >
        {/* Header con imagen */}
        <div className="relative h-48 sm:h-64 bg-muted">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
              <span className="text-4xl font-bold opacity-20">SMASH</span>
            </div>
          )}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <h3 id={titleId} className="text-2xl font-bold text-foreground">{product.name}</h3>
            <span className="text-xl font-black text-primary">${product.price.toLocaleString("es-AR")}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{product.description}</p>

          {/* Extras */}
          {extras.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                Agregados <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Opcional</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {extras.map((extra) => {
                  const isSelected = selectedExtras.find((e) => e.name === extra.name);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      aria-pressed={!!isSelected}
                      aria-label={`${extra.name}, +$${extra.price.toLocaleString("es-AR")}`}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary/50 border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className="text-sm font-medium">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">+${extra.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notas */}
          <div className="mb-6">
            <h4 className="font-bold text-foreground mb-3">¿Alguna aclaración?</h4>
            <textarea
              placeholder="Ej: Sin cebolla, extra aderezo, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[80px] resize-none"
            />
          </div>

          {/* Cantidad y Botón */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-secondary p-2 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Restar uno"
                className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Sumar uno"
                className="w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Agregar por ${totalPrice.toLocaleString("es-AR")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
