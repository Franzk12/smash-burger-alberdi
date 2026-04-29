"use client";

import { useState } from "react";
import { Hero } from "@/components/hero";
import { Menu } from "@/components/menu";
import { Footer } from "@/components/footer";
import { CartButton } from "@/components/cart-button";
import { CartDrawer } from "@/components/cart-drawer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero />
      <Menu />
      <Footer />
      <CartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}