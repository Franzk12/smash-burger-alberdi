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
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="relative inline-block animate-in fade-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse" />
            <img 
              src="/logo.png" 
              alt="Smash Burger Alberdi" 
              className="w-[280px] md:w-[450px] lg:w-[550px] h-auto relative z-10 drop-shadow-2xl"
            />
          </div>
          
          {/* Location Badge */}
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-md px-6 py-2 rounded-full border border-primary/20 shadow-xl">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
              <span className="text-foreground text-sm font-bold tracking-widest uppercase">
                Juan Bautista Alberdi
              </span>
            </div>
            
            {/* Tagline */}
            <p className="text-lg md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
              Sabor <span className="text-primary font-bold">Premium</span>, Estilo Urbano. <br className="hidden md:block" />
              Las mejores burgers artesanales de la ciudad.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={scrollToMenu}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xl px-12 py-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_20px_50px_rgba(234,_179,_8,_0.3)] group"
            >
              ¡HACER MI PEDIDO!
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
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
