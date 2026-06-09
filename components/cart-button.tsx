"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useEffect, useRef, useState } from "react";

type Props = {
  onClick: () => void;
};

export function CartButton({ onClick }: Props) {
  const { itemCount, total } = useCart();
  const [bounce, setBounce] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  if (!mounted || itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 ${bounce ? "animate-bounce" : ""}`}
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        <span className={`absolute -top-2 -right-2 bg-black text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center transition-transform ${bounce ? "scale-125" : "scale-100"}`}>
          {itemCount}
        </span>
      </div>
      <span className="font-bold text-sm">
        Ver pedido · ${total.toLocaleString("es-AR")}
      </span>
    </button>
  );
}
