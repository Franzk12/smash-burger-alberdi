"use client";

import { Plus } from "lucide-react";
import { BurgerIcon, FriesIcon, CheeseIcon } from "@/components/food-icons";
import { useCart } from "@/context/cart-context";
import { useProducts, ProductsProvider } from "@/lib/products-context";

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

function MenuContent() {
  const { addItem } = useCart();
  const { products, loading } = useProducts();

  const burgers = products.filter(p => p.category === "burger");
  const milanesas = products.filter(p => p.category === "milanesa");
  const papas = products.filter(p => p.category === "papa");
  const extras = products.filter(p => p.category === "extra");

  return (
    <section id="menu" className="bg-primary py-8">
      <div className="bg-background pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center pt-8 pb-12">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
              Nuestro <span className="text-primary">Menú</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Smash burgers artesanales hechas al momento
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Cargando menú...</div>
          ) : (
            <>
              {/* Burgers */}
              {burgers.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <BurgerIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">Burgers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {burgers.map((burger) => (
                      <div key={burger.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{burger.name}</h4>
                          <span className="text-primary font-black text-lg whitespace-nowrap">${burger.price.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-1">{burger.description}</p>
                        <AddButton onClick={() => addItem({ id: burger.id, name: burger.name, price: burger.price, category: "burger" })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milanesas */}
              {milanesas.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <BurgerIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">Milanesas y Lomitos</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {milanesas.map((item) => (
                      <div key={item.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h4>
                          <span className="text-primary font-black whitespace-nowrap">${item.price.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex-1" />
                        <AddButton onClick={() => addItem({ id: item.id, name: item.name, price: item.price, category: "milanesa" })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Papas */}
              {papas.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <FriesIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">Papas</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {papas.map((papa) => (
                      <div key={papa.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{papa.name}</h4>
                          <span className="text-primary font-black whitespace-nowrap">${papa.price.toLocaleString("es-AR")}</span>
                        </div>
                        {papa.description && <p className="text-muted-foreground text-sm mt-2 flex-1">{papa.description}</p>}
                        <div className="flex-1" />
                        <AddButton onClick={() => addItem({ id: papa.id, name: papa.name, price: papa.price, category: "papa" })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {extras.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <CheeseIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">Extras</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {extras.map((extra) => (
                      <div key={extra.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 group flex flex-col">
                        <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{extra.name}</p>
                        <p className="text-primary font-black mt-1">${extra.price.toLocaleString("es-AR")}</p>
                        <AddButton onClick={() => addItem({ id: extra.id, name: extra.name, price: extra.price, category: "extra" })} />
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

