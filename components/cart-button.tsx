"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

type Props = {
  onClick: () => void;
};

export function CartButton({ onClick }: Props) {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-black text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      <span className="font-bold text-sm">
        Ver pedido · ${total.toLocaleString("es-AR")}
      </span>
    </button>
  );
}
