"use client";

import { Plus } from "lucide-react";
import { BurgerIcon, FriesIcon, CheeseIcon } from "@/components/food-icons";
import { useCart } from "@/context/cart-context";

const burgers = [
  { id: "big-smash", name: "Big Smash", price: 9500, ingredients: "Medallón de carne · Pepinillo · Cebolla Brunoise · Lechuga · Queso Cheddar · Salsa Smash" },
  { id: "americana", name: "Americana", price: 9500, ingredients: "Medallón de carne · Bacon · Queso Cheddar · Cebolla Caramelizada · Salsa Smash" },
  { id: "cheese-burger", name: "Cheesse Burger", price: 9500, ingredients: "Medallón de carne · Bacon · Queso Cheddar · Cebolla Brunoise · Salsa Smash" },
  { id: "cuarto-libra", name: "Cuarto de Libra", price: 9000, ingredients: "Medallón de carne · Queso Cheddar · Ketchup · Mostaza · Cebolla Brunoise" },
  { id: "cangre-burger", name: "CangreBurger", price: 9500, ingredients: "Medallón de carne · Cebolla · Lechuga · Tomate · Queso Cheddar · Salsa Smash" },
  { id: "especial", name: "Especial", price: 9000, ingredients: "Medallón de carne · Jamón y Queso Tybo · Lechuga · Tomate · Huevo · Mayonesa" },
  { id: "crispy-onion", name: "Crispy Onion", price: 9000, ingredients: "Medallón de carne · Queso Cheddar · Cebolla Crispy · Salsa Barbacoa" },
  { id: "okc-smash", name: "OKC Smash", price: 9000, ingredients: "Medallón de carne · Queso Cheddar · Cebolla Salteada en aceite de Bacon" },
  { id: "golden-onion", name: "Golden Onion", price: 10000, ingredients: "Medallón de carne · Aros de Cebolla · Queso Cheddar · Bacon · Mostaza · Ketchup" },
  { id: "blue", name: "Blue", price: 11000, ingredients: "Medallón de carne · Cheddar · Cebolla Caramelizada · Queso Azul con Nuez · Tomates Confitados y Ahumados" },
];

const milanesas = [
  { id: "milanesa-comun", name: "Milanesa Común", price: 11000 },
  { id: "milanesa-especial", name: "Milanesa Especial", price: 11500 },
  { id: "lomito-comun", name: "Lomito Común", price: 12000 },
  { id: "lomito-especial", name: "Lomito Especial", price: 12500 },
];

const papas = [
  { id: "papas-smash", name: "Papas Smash", price: 8500, description: "Queso Cheddar · Bacon · Verdeo" },
  { id: "salchipapa", name: "Salchipapa", price: 7000, description: "Papas · Salchicha · Queso Cheddar · Verdeo" },
  { id: "papas-gratinadas", name: "Papas Gratinadas", price: 7500, description: "" },
  { id: "porcion-papas", name: "Porción de Papas", price: 5500, description: "" },
];

const extras = [
  { id: "pepinillos", name: "Pepinillos", price: 600 },
  { id: "aros-cebolla", name: "Aros de Cebolla", price: 800 },
  { id: "huevo", name: "Huevo", price: 600 },
  { id: "jamon", name: "Jamón", price: 600 },
  { id: "bacon", name: "Bacon", price: 700 },
  { id: "medallon-extra", name: "Medallón Extra con Queso", price: 2500 },
  { id: "bano-cheddar", name: "Baño de Cheddar y Bacon", price: 2000 },
];

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

export function Menu() {
  const { addItem } = useCart();

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

          {/* Burgers */}
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
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-1">{burger.ingredients}</p>
                  <AddButton onClick={() => addItem({ id: burger.id, name: burger.name, price: burger.price, category: "burger" })} />
                </div>
              ))}
            </div>
          </div>

          {/* Milanesas */}
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

          {/* Papas */}
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

          {/* Extras */}
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
        </div>
      </div>

      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-24 -mt-1 rotate-180" fill="none">
        <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" className="fill-background" />
      </svg>
    </section>
  );
}
