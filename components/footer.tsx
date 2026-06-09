"use client";

import { Button } from "@/components/ui/button";
import { BurgerIcon, FriesIcon, OnionIcon } from "@/components/food-icons";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const phone1 = "3865228354";
  const phone2 = "3865457009";
  const whatsappLink = `https://wa.me/54${phone1}`;
  const instagramLink = "https://instagram.com/smashburgeralberdi";

  return (
    <footer className="bg-background pt-16 pb-8">
      {/* Decorative icons */}
      <div className="container mx-auto px-4 relative">
        <div className="absolute -top-8 left-8 opacity-10">
          <BurgerIcon className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-4 right-12 opacity-10">
          <FriesIcon className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute top-20 right-1/4 opacity-10">
          <OnionIcon className="w-10 h-10 text-primary" />
        </div>

        <div className="text-center relative z-10">
          {/* Contact heading */}
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            ¿Con hambre?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Hacé tu pedido ahora
          </p>

          {/* Phone numbers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
            <a
              href={`tel:${phone1}`}
              className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
            >
              <PhoneIcon className="w-6 h-6" />
              <span className="text-2xl md:text-4xl font-black tracking-tight group-hover:underline">
                {phone1}
              </span>
            </a>
            <span className="hidden sm:block text-primary text-3xl font-light">
              -
            </span>
            <a
              href={`tel:${phone2}`}
              className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
            >
              <PhoneIcon className="w-6 h-6" />
              <span className="text-2xl md:text-4xl font-black tracking-tight group-hover:underline">
                {phone2}
              </span>
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-base px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-base px-8 py-6 rounded-full transition-all duration-300"
            >
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <InstagramIcon className="w-5 h-5" />
                @smashburgeralberdi
              </a>
            </Button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border mb-8" />

          {/* Brand footer */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-foreground">
                Smash
              </span>
              <span className="text-2xl font-black text-primary">BURGER</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Alberdi • Las mejores smash burgers
            </p>
            <p className="text-muted-foreground/60 text-xs">
              © {new Date().getFullYear()} Smash Burger Alberdi. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
