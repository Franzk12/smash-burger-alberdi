"use client";

import { Plus } from "lucide-react";
import { BurgerIcon, FriesIcon, CheeseIcon } from "@/components/food-icons";
import { useCart } from "@/context/cart-context";
import { useProducts, ProductsProvider, type Product } from "@/lib/products-context";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary rounded-lg py-2 text-sm font-semibold transition-all duration-200"
    >
      <Plus className="w-4 h-4" />
      Agregar
    </button>
  );
}

import { ProductModal } from "./product-modal";

function MenuContent() {
  const { addItem } = useCart();
  const { products, loading } = useProducts();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    fetchStatus();
  }, []);

  const burgers = products.filter(p => p.category === "burger");
  const milanesas = products.filter(p => p.category === "milanesa");
  const papas = products.filter(p => p.category === "papa");
  const extras = products.filter(p => p.category === "extra");

  return (
    <section id="menu" className="bg-primary py-8">
      <div className="bg-background pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center pt-12 pb-16">
            <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic">
              Nuestra <span className="text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">Carta</span>
            </h2>
            <div className="w-24 h-2 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          {!isOpen && (
            <div className="max-w-2xl mx-auto mb-16 p-8 bg-red-500/10 border-2 border-red-500/20 rounded-3xl flex flex-col items-center text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-wider">Local Cerrado Temporalmente</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Estamos descansando o con muchos pedidos. No se aceptan pedidos online en este momento, pero podés seguir viendo nuestro menú.</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium animate-pulse">Cargando el sabor...</p>
            </div>
          ) : (
            <>
              {/* Burgers */}
              {burgers.length > 0 && (
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-4">
                    <BurgerIcon className="w-10 h-10 text-primary" />
                    <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tight">Burgers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {burgers.map((burger) => (
                      <div key={burger.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary transition-all duration-500 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden relative">
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Popular</span>
                        </div>
                        {burger.image_url && (
                          <div className="-mx-6 -mt-6 mb-6 h-56 overflow-hidden bg-muted border-b border-border/50 relative">
                            <img src={burger.image_url} alt={burger.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none uppercase">{burger.name}</h4>
                          <span className="text-primary font-black text-2xl whitespace-nowrap drop-shadow-sm">${burger.price.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-3 leading-relaxed flex-1 font-medium">{burger.description}</p>
                        {isOpen ? (
                          <div className="mt-6">
                            <AddButton onClick={() => setSelectedProduct(burger)} />
                          </div>
                        ) : (
                          <div className="mt-6 w-full py-3 text-center text-xs font-black text-muted-foreground bg-white/5 rounded-xl border border-white/5 uppercase tracking-widest">
                            Cerrado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milanesas */}
              {milanesas.length > 0 && (
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-4">
                    <BurgerIcon className="w-10 h-10 text-primary" />
                    <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tight">Milas y Lomitos</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {milanesas.map((item) => (
                      <div key={item.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary transition-all duration-500 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
                        {item.image_url && (
                           <div className="-mx-5 -mt-5 mb-5 h-44 overflow-hidden bg-muted border-b border-border/50">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase leading-tight">{item.name}</h4>
                          <span className="text-primary font-black whitespace-nowrap text-lg">${item.price.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex-1" />
                        {isOpen ? (
                          <div className="mt-5">
                            <AddButton onClick={() => setSelectedProduct(item)} />
                          </div>
                        ) : (
                          <div className="mt-5 w-full py-2.5 text-center text-xs font-black text-muted-foreground bg-white/5 rounded-xl border border-white/5 uppercase tracking-widest">
                            Cerrado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Papas */}
              {papas.length > 0 && (
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-4">
                    <FriesIcon className="w-10 h-10 text-primary" />
                    <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tight">Papas</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {papas.map((papa) => (
                      <div key={papa.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary transition-all duration-500 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
                        {papa.image_url && (
                          <div className="-mx-5 -mt-5 mb-5 h-44 overflow-hidden bg-muted border-b border-border/50">
                            <img src={papa.image_url} alt={papa.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase leading-tight">{papa.name}</h4>
                          <span className="text-primary font-black whitespace-nowrap text-lg">${papa.price.toLocaleString("es-AR")}</span>
                        </div>
                        {papa.description && <p className="text-muted-foreground text-xs mt-2 flex-1 font-medium leading-relaxed">{papa.description}</p>}
                        <div className="flex-1" />
                        {isOpen ? (
                          <div className="mt-5">
                            <AddButton onClick={() => setSelectedProduct(papa)} />
                          </div>
                        ) : (
                          <div className="mt-5 w-full py-2.5 text-center text-xs font-black text-muted-foreground bg-white/5 rounded-xl border border-white/5 uppercase tracking-widest">
                            Cerrado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {extras.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-4">
                    <CheeseIcon className="w-10 h-10 text-primary" />
                    <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tight">Extras</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {extras.map((extra) => (
                      <div key={extra.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary transition-all duration-500 group flex flex-col overflow-hidden relative shadow-sm">
                        {extra.image_url && (
                          <div className="-mx-5 -mt-5 mb-4 h-28 overflow-hidden bg-muted border-b border-border/50">
                            <img src={extra.image_url} alt={extra.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        )}
                        <p className="font-black text-foreground text-sm group-hover:text-primary transition-colors uppercase">{extra.name}</p>
                        <p className="text-primary font-black mt-1 text-lg">${extra.price.toLocaleString("es-AR")}</p>
                        {isOpen ? (
                          <div className="mt-4">
                            <AddButton onClick={() => addItem({ id: extra.id, name: extra.name, price: extra.price, category: "extra" })} />
                          </div>
                        ) : (
                          <div className="mt-4 w-full py-2 text-center text-xs font-black text-muted-foreground bg-white/5 rounded-xl border border-white/5 uppercase tracking-widest">
                            Cerrado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-24 -mt-1 rotate-180" fill="none">
        <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" className="fill-background" />
      </svg>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          extras={extras}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

export function Menu() {
  return (
    <ProductsProvider>
      <MenuContent />
    </ProductsProvider>
  )
}

