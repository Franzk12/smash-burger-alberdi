import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET — obtener todos los pedidos (requiere password)
export async function GET(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('pedidos')
      .select('*, items:items_pedido(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Adaptar campos de DB a formato esperado por el frontend
    const pedidos = data.map((p: any) => ({
      id: p.id,
      customerName: p.customer_name,
      phone: p.phone,
      items: p.items,
      total: Number(p.total),
      orderType: p.order_type,
      address: p.address,
      paymentMethod: p.payment_method,
      status: p.status,
      createdAt: new Date(p.created_at),
      notes: p.notes,
      referencia: p.referencia
    }));

    return NextResponse.json({ pedidos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — crear nuevo pedido
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // --- VALIDACIÓN DE SEGURIDAD ---
    // 1. Verificar que el total no sea cero o negativo
    if (!body.total || body.total <= 0) {
      return NextResponse.json({ error: "El total del pedido no es válido" }, { status: 400 });
    }

    // 2. Verificar precios reales contra la Base de Datos
    const { data: dbProducts } = await supabaseAdmin
      .from('productos')
      .select('name, price');

    if (dbProducts) {
      let totalCalculado = 0;
      for (const item of body.items) {
        const prodReal = dbProducts.find(p => p.name === item.name);
        if (prodReal) {
          // Sumamos el precio real del producto * cantidad
          totalCalculado += prodReal.price * item.quantity;
          
          // Nota: Si hay adicionales/personalizaciones que suman precio, 
          // deberíamos validarlos también. Por ahora validamos el base.
        }
      }

      // El envío también suma si es fuera de zona
      if (body.zona === "fuera") {
        totalCalculado += 2000;
      }

      // Si hay una diferencia sospechosa (ej: más de $10 pesos por redondeos), rechazamos
      if (Math.abs(totalCalculado - body.total) > 10) {
        console.error("ALERTA DE SEGURIDAD: Intento de manipulación de precios detectado", {
          enviado: body.total,
          calculado: totalCalculado
        });
        return NextResponse.json({ 
          error: "Diferencia de precios detectada. Por favor, refresca el menú e intenta de nuevo." 
        }, { status: 400 });
      }
    }
    // --- FIN VALIDACIÓN ---

    const pedidoId = `ORD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // 1. Guardar el pedido
    const { error: pedidoError } = await supabaseAdmin
      .from('pedidos')
      .insert({
        id: pedidoId,
        customer_name: body.nombre,
        phone: body.telefono,
        address: body.direccion,
        order_type: body.modalidad,
        payment_method: body.pago,
        total: body.total,
        notes: body.notas || body.notes || "",
        status: 'pendiente'
      });

    if (pedidoError) {
      console.error("Error al insertar pedido:", pedidoError);
      throw pedidoError;
    }

    // 2. Guardar los items
    const itemsToInsert = body.items.map((item: any) => {
      let finalName = item.name;
      if (item.customizations && item.customizations.length > 0) {
        finalName += ` (+ ${item.customizations.map((c: any) => c.name).join(", ")})`;
      }
      if (item.notes) {
        finalName += ` [Nota: ${item.notes}]`;
      }

      return {
        pedido_id: pedidoId,
        name: finalName,
        price: item.price,
        quantity: item.quantity,
        category: item.category || "burger"
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from('items_pedido')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error al insertar items:", itemsError);
      throw itemsError;
    }

    return NextResponse.json({ ok: true, id: pedidoId });
  } catch (error: any) {
    console.error("Error en POST /api/pedidos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — actualizar estado de un pedido
export async function PATCH(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, estado } = await req.json();
    
    const { error } = await supabaseAdmin
      .from('pedidos')
      .update({ status: estado })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
