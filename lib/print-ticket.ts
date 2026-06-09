import { Order } from "./types"

export function printOrderTicket(order: Order) {
  const printWindow = window.open("", "_blank", "width=400,height=600")
  if (!printWindow) return

  // Formato de fecha y hora
  const d = new Date(order.createdAt)
  const fecha = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  const hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

  const isDelivery = order.orderType === "delivery"
  const tipoEnvio = isDelivery ? "DELIVERY" : "RETIRO EN LOCAL"
  const ticketId = order.id ? order.id.slice(0, 6).toUpperCase() : "0001"

  // -- ITEMS PARA EL CLIENTE (Con Precio) --
  let itemsClienteHtml = ""
  order.items.forEach(item => {
    const totalItem = (item.price * item.quantity).toFixed(2)
    let itemExtras = ""
    if (item.customizations && item.customizations.length > 0) {
      itemExtras += `<div style="font-size:9px;margin-left:2mm;color:#444;">+ ${item.customizations.map(c => c.name).join(", ")}</div>`
    }
    if (item.notes) {
      itemExtras += `<div style="font-size:9px;margin-left:2mm;color:#444;font-style:italic;">Nota: ${item.notes}</div>`
    }

    itemsClienteHtml += `
      <div style="margin-bottom:2mm;">
        <div style="display:flex;justify-content:space-between;gap:2mm;">
          <span style="flex:1;text-transform:uppercase;">${item.name}</span>
          <span style="flex:0 0 10mm;text-align:right;">${item.quantity}</span>
          <span style="flex:0 0 15mm;text-align:right;">$${totalItem}</span>
        </div>
        ${itemExtras}
      </div>
    `
  })

  // -- ITEMS PARA LA COCINA (Sin Precio, Fuente Más Grande) --
  let itemsCocinaHtml = ""
  order.items.forEach(item => {
    let itemExtras = ""
    if (item.customizations && item.customizations.length > 0) {
      itemExtras += `<div style="font-size:12px;margin-top:1mm;color:#000;">AGREGADOS: ${item.customizations.map(c => c.name.toUpperCase()).join(", ")}</div>`
    }
    if (item.notes) {
      itemExtras += `<div style="font-size:12px;margin-top:1mm;color:#000;background:#eee;padding:0.5mm;">OC: ${item.notes.toUpperCase()}</div>`
    }

    itemsCocinaHtml += `
      <div style="margin-bottom:3mm;border-bottom:1px dashed #000;padding-bottom:2mm;">
        <div style="display:flex;justify-content:flex-start;align-items:flex-start;gap:2mm;font-size:15px;font-weight:900;">
          <span style="font-size:18px;">${item.quantity}X</span>
          <span style="text-transform:uppercase;">${item.name}</span>
        </div>
        ${itemExtras}
      </div>
    `
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ticket #${ticketId}</title>
      <style>
        @page { margin: 0; size: 80mm auto; }
        body {
          font-family: Arial, sans-serif;
          width: 80mm;
          margin: 0;
          padding: 0; /* padding resuelto en los divs de cada ticket */
          box-sizing: border-box;
          color: #000;
        }
        .ticket {
          padding: 3mm;
          page-break-after: always;
        }
        /* Ocultar botones de la interfaz al imprimir */
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>

      <!-- ==========================================
                    TICKET COCINA
      =========================================== -->
      <div class="ticket">
        <div style="text-align:center;font-size:18px;font-weight:900;border-top:2px solid #000;border-bottom:2px solid #000;padding:2mm 0;margin-bottom:3mm;background-color:#000;color:#fff;text-transform:uppercase;letter-spacing:2px;">
          COCINA
        </div>

        <div style="font-size:14px;font-weight:900;text-align:center;margin-bottom:1mm;">
          PEDIDO #${ticketId}
        </div>
        <div style="font-size:12px;font-weight:700;text-align:center;margin-bottom:3mm;">
          ${tipoEnvio} - ${hora}
        </div>

        ${order.notes ? `
          <div style="border:2px solid #000;padding:2mm;margin-bottom:4mm;font-size:13px;font-weight:700;text-align:center;">
            ATENCIÓN: ${order.notes.toUpperCase()}
          </div>
        ` : ""}

        <div style="border-top:2px solid #000;margin-bottom:2mm;"></div>
        
        <!-- ÍTEMS COCINA -->
        <div style="margin-bottom:4mm;">
          ${itemsCocinaHtml}
        </div>

        <div style="border-top:2px solid #000;margin-bottom:2mm;"></div>
        <div style="text-align:center;font-size:10px;font-weight:700;margin-bottom:10mm;">
          *** FIN PEDIDO COCINA ***
        </div>
      </div>


      <!-- ==========================================
                 TICKET CLIENTE / ENVOLTORIO
      =========================================== -->
      <div class="ticket">
        <!-- ENCABEZADO CON LOGO -->
        <div style="text-align:center;margin-bottom:5mm;border-bottom:2px solid #000;padding-bottom:3mm;">
          <img src="/logo-black.png" style="width: 45mm; height: auto; margin-bottom: 2mm;" alt="Smash Burger Logo" />
          <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:#000;margin-bottom:2mm;">
            ALBERDI
          </div>
          <div style="font-size:10px;color:#333;margin:1.5mm 0 0 0;line-height:1.3;">
            <div style="margin-bottom:0.5mm;">Alberdi, Tucumán</div>
            <div style="margin-bottom:0.5mm;">Tel: 3865-228354</div>
            <div>Ig: @smashburger.alberdi</div>
          </div>
        </div>

        <!-- DETALLES VENTA -->
        <div style="font-size:11px;color:#222;margin-bottom:3mm;text-align:center;line-height:1.5;">
          <div><strong>Pedido:</strong> #${ticketId}</div>
          <div><strong>Fecha:</strong> ${fecha} - ${hora}</div>
          <div><strong>Tipo:</strong> ${tipoEnvio}</div>
        </div>

        <div style="border-top:2px solid #000;border-bottom:1px solid #000;margin-bottom:3mm;padding:1.5mm 0;"></div>

        <!-- CLIENTE -->
        <div style="font-size:12px;color:#000;margin-bottom:3mm;line-height:1.5;">
          <div><strong>Cliente:</strong> ${order.customerName.toUpperCase()}</div>
          ${order.phone ? `<div><strong>Teléfono:</strong> ${order.phone}</div>` : ""}
          ${isDelivery ? `<div style="font-weight:900;font-size:14px;margin-top:2mm;"><strong>DIR:</strong> ${order.address?.toUpperCase()}</div>` : ""}
          ${order.notes ? `<div style="margin-top:2mm;font-style:italic;"><strong>Notas:</strong> ${order.notes}</div>` : ""}
        </div>

        <!-- ENCABEZADO TABLA -->
        <div style="font-size:10px;font-weight:700;margin-bottom:1mm;text-align:left;">
          <div style="display:flex;justify-content:space-between;gap:2mm;">
            <span style="flex:1;">ARTÍCULO</span>
            <span style="flex:0 0 10mm;text-align:right;">CANT.</span>
            <span style="flex:0 0 15mm;text-align:right;">SUBT.</span>
          </div>
        </div>
        <div style="border-top:1px dashed #999;margin-bottom:2mm;"></div>

        <!-- ÍTEMS -->
        <div style="margin-bottom:3mm;font-size:11px;line-height:1.4;">
          ${itemsClienteHtml}
        </div>
        <div style="border-bottom:2px solid #000;margin-bottom:3mm;"></div>

        <!-- MONTOS -->
        <div style="margin-bottom:3mm;font-size:12px;">
          <div style="display:flex;justify-content:space-between;gap:2mm;margin-bottom:2mm;">
            <span style="font-weight:700;">TOTAL:</span>
            <span style="font-weight:900;font-size:15px;">$${order.total.toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:2mm;font-size:11px;">
            <span>Medio de Pago:</span>
            <span style="text-transform:uppercase;font-weight:700;">${order.paymentMethod}</span>
          </div>
        </div>

        <div style="border-top:2px solid #000;border-bottom:2px solid #000;margin:3mm 0;padding:2mm 0;"></div>

        <!-- PIE DE PÁGINA -->
        <div style="text-align:center;font-size:10px;color:#333;line-height:1.6;margin-bottom:3mm;">
          <div style="color:#555;margin-bottom:2mm;">
            NO VÁLIDO COMO FACTURA<br/>
            ¡Gracias por elegirnos &lt;3!
          </div>
          <div style="font-size:12px;font-weight:900;color:#000;border-top:1px solid #000;padding-top:2mm;margin-top:2mm;">
            ¡BUEN PROVECHO!
          </div>
        </div>
      </div>

      <script>
        window.onload = () => {
          // Un pequeño delay para asegurar que los estilos de la impresora carguen bien
          setTimeout(() => {
            window.print();
            setTimeout(() => { window.close(); }, 500);
          }, 200);
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
