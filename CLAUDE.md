# CLAUDE.md

Guía para trabajar en este repo. Smash Burger Alberdi — web de pedidos online de una hamburguesería (menú, carrito, checkout con Mercado Pago, panel admin y seguimiento de pedidos).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config vía `@theme` en CSS, no `tailwind.config.js`) + `tw-animate-css`
- **shadcn/ui** (Radix primitives en `components/ui/`)
- **Supabase** (`@supabase/supabase-js`) como backend/DB — ver `lib/supabase.ts` y `supabase/`
- **Mercado Pago** para pagos (`app/api/create-preference`, webhooks)
- Iconos: **lucide-react** (no usar emojis como iconos)
- Estado: React Context (no Redux) — ver carpeta `context/` y `lib/`

## Comandos

```bash
npm run dev      # desarrollo (next dev)
npm run build    # build de producción
npm run start    # servir build
npm run lint     # eslint
npx tsc --noEmit # type-check (usar para validar cambios)
```

## Estructura

- `app/` — rutas (App Router)
  - `app/page.tsx` — landing/menú principal
  - `app/admin/` — panel de administración
  - `app/pedido/[id]/` — seguimiento de pedido; `exitoso/` y `error/` para retorno de pago
  - `app/api/` — endpoints: `create-preference`, `webhooks/mercadopago`, `confirmar-pago`, `pedido/[id]`, `pedidos`, `productos`, `tiempo-espera`, `bot`
- `components/` — UI: `menu.tsx`, `product-modal.tsx`, `cart-drawer.tsx`, `cart-button.tsx`, `checkout-modal.tsx`, `hero.tsx`, `footer.tsx`, `food-icons.tsx`, `admin/`, `ui/`
- `context/cart-context.tsx` — estado del carrito
- `lib/` — `products-context.tsx`, `orders-context.tsx`, `auth-context.tsx`, `store-status-context.tsx`, `supabase.ts`, `print-ticket.ts`, `rate-limit.ts`, `types.ts`
- `smash-bot/` — bot (proyecto aparte dentro del repo)

## Tema / branding (IMPORTANTE para cambios visuales)

La identidad es **fondo negro + amarillo dorado** `#F5C800`. Definida con variables CSS en `app/globals.css` (formato OKLCH):

- `--background: oklch(0.13 0 0)` (negro ~#1a1a1a)
- `--primary: oklch(0.82 0.18 95)` (amarillo dorado `#F5C800`)
- `--foreground: oklch(0.98 0 0)` (casi blanco)

**Respetar siempre esta paleta.** Usar tokens (`bg-primary`, `text-foreground`, `bg-card`, etc.), nunca colores hardcodeados. Si una recomendación externa propone otra paleta (p. ej. naranja/azul genérico), adaptarla a negro+dorado.

## Convenciones de UI / accesibilidad

Checklist al tocar componentes interactivos:
- `cursor-pointer` en todo lo clickeable; estados hover con transición 150–300ms
- Contraste de texto ≥ 4.5:1
- `focus-visible:ring` para navegación por teclado
- Respetar `prefers-reduced-motion` (`motion-reduce:animate-none` / `transition-none`)
- Iconos SVG (lucide), nunca emojis
- Responsive en 375 / 768 / 1024 / 1440px
- **Modales**: `role="dialog"` + `aria-modal` + `aria-labelledby`, cierre con Escape, click en backdrop, foco al abrir y bloqueo de scroll de fondo. Referencia ya implementada: `components/product-modal.tsx`.

## Reforma visual — en curso

Estamos puliendo la UI. Estado actual:
- ✅ Accesibilidad de modales unificada en un hook compartido `lib/use-modal-a11y.ts` (Escape, scroll-lock, foco inicial y **focus trap** con Tab/Shift+Tab). Aplicado en `product-modal.tsx`, `cart-drawer.tsx` y `checkout-modal.tsx`.
- ✅ `product-modal.tsx`: controles internos al checklist (agregados con `aria-pressed`, botones de cantidad con `aria-label`, `cursor-pointer` + `focus-visible:ring` en todo lo clickeable).
- ✅ Panel admin: modal "Nuevo/Editar Producto" (`menu-admin.tsx`) con accesibilidad completa + `max-h`/scroll para no desbordar en móvil; modal "Cierre de Caja" (`admin-panel.tsx`) migrado al hook compartido (gana focus trap).
- ⏳ Pendiente: revisar dropdowns/menús contextuales del admin (ej. `MoreVertical`) si los hubiera; luego seguir con consistencia visual del resto.

Se está evaluando la skill **ui-ux-pro-max** (`nextlevelbuilder/ui-ux-pro-max-skill`) como asesor de diseño. Da recomendaciones genéricas (paleta/tipografía/checklist) que hay que **adaptar al branding negro+dorado**; no edita código por sí sola. Requiere Python 3 (ya disponible localmente).

## Notas

- Variables de entorno en `.env.example` (Supabase, Mercado Pago). No commitear secrets.
- Idioma de la UI: español (es-AR). Formatear precios con `toLocaleString("es-AR")`.
