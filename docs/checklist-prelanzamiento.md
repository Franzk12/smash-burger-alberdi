# ✅ Checklist de pre-lanzamiento — Smash Burger Alberdi

> Tachá todo esto **antes** de salir en vivo el finde. Lo crítico está marcado con ⚠️.

## 1. Variables de entorno en Vercel
(Settings → Environment Variables → scope **Production**. Después de cambiar, **redeploy**.)

- [ ] ⚠️ `MP_ACCESS_TOKEN` empieza con **`APP_USR-`** (productivo). Si empieza con `TEST-`, los pagos reales no funcionan.
- [ ] ⚠️ `NEXT_PUBLIC_BASE_URL` = dominio real, **sin barra final** (ej: `https://smashburgeralberdi.com`). De acá salen el webhook, los retornos de pago y el link de seguimiento.
- [ ] ⚠️ `SUPABASE_SERVICE_ROLE_KEY` cargada. Si falta, el panel y los pedidos NO funcionan.
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (o `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] `PANEL_PASSWORD` = contraseña fuerte y privada.

## 2. Mercado Pago
- [ ] App en modo **Producción**.
- [ ] ⚠️ Webhook configurado → `https://TU-DOMINIO/api/webhooks/mercadopago`, evento **Pagos (payment)**.
- [ ] Prueba real: pagar **$100** de punta a punta y verificar que el pedido pase de "PAGO PENDIENTE MP" a confirmado en el panel.

## 3. Base de datos (Supabase de producción)
- [ ] Tablas creadas: `pedidos`, `items_pedido`, `productos` (+ estado del local / tiempo de espera). Revisar carpeta `supabase/`.
- [ ] Menú real cargado: nombres, precios, fotos, categoría, disponibilidad.

## 4. Datos del local (en `components/checkout-modal.tsx`)
- [ ] WhatsApp `5493865228354` es el número real del local.
- [ ] Alias `Smashburgeralb` / Titular `Smash Burger Alberdi` correctos.
- [ ] Costo de envío fuera de zona `$2.000` correcto.

## 5. Prueba funcional end-to-end (desde el celular)
- [ ] Pedido **Retiro** + efectivo → llega WhatsApp + aparece en panel.
- [ ] Pedido **Delivery** zona Alberdi (sin envío) y fuera de zona (+$2.000) → totales correctos.
- [ ] Pago **MercadoPago** se confirma; pago **transferencia** muestra el alias.
- [ ] Link de **seguimiento** funciona (`/pedido/ORD-XXXX`).
- [ ] Toggle **Abrir/Cerrar local** corta y habilita pedidos.

## 6. En el local
- [ ] Dispositivo en el mostrador con `/admin` logueado.
- [ ] ⚠️ Botón **"Activar Sonido"** tocado al abrir (sin eso no suena el aviso).
- [ ] Impresora lista (si van a imprimir comandas).
