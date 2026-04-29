"use client";

import { Button } from "@/components/ui/button";
import { BurgerIcon, FriesIcon, OnionIcon } from "@/components/food-icons";

export function Hero() {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative food icons */}
      <div className="absolute top-20 left-8 md:left-16 opacity-20">
        <BurgerIcon className="w-16 h-16 md:w-24 md:h-24 text-primary" />
      </div>
      <div className="absolute top-32 right-12 md:right-24 opacity-15">
        <FriesIcon className="w-12 h-12 md:w-20 md:h-20 text-primary" />
      </div>
      <div className="absolute bottom-40 left-16 md:left-32 opacity-15">
        <OnionIcon className="w-14 h-14 md:w-18 md:h-18 text-primary" />
      </div>
      <div className="absolute bottom-32 right-8 md:right-20 opacity-20">
        <BurgerIcon className="w-20 h-20 md:w-28 md:h-28 text-primary rotate-12" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="space-y-6">
          {/* Brand Name */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-none">
            <span className="block">Smash</span>
            <span className="block text-primary">BURGER</span>
          </h1>
          
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Alberdi
            </span>
          </div>
          
          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            Auténticas smash burgers estilo NYC. Sabor premium, estilo urbano.
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={scrollToMenu}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
            >
              Ver Menú
            </Button>
          </div>
        </div>
      </div>

      {/* Diagonal Wave Separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-24 md:h-32"
          fill="none"
        >
          <path
            d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
            className="fill-primary"
          />
        </svg>
      </div>
    </section>
  );
}
