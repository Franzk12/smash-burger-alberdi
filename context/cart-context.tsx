"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type CartItem = {
    cartId: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: "burger" | "papa" | "extra" | "milanesa";
    customizations?: { name: string; price: number }[];
    notes?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity" | "cartId">) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((newItem: Omit<CartItem, "quantity" | "cartId">) => {
        setItems((prev) => {
            const existing = prev.find((i) => 
                i.id === newItem.id && 
                JSON.stringify(i.customizations) === JSON.stringify(newItem.customizations) &&
                i.notes === newItem.notes
            );
            
            if (existing) {
                return prev.map((i) =>
                    i.cartId === existing.cartId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            
            const cartId = Math.random().toString(36).substr(2, 9);
            return [...prev, { ...newItem, quantity: 1, cartId }];
        });
    }, []);

    const removeItem = useCallback((cartId: string) => {
        setItems((prev) => prev.filter((i) => i.cartId !== cartId));
    }, []);

    const updateQuantity = useCallback((cartId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.cartId !== cartId));
        } else {
            setItems((prev) =>
                prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
            );
        }
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
    return ctx;
}