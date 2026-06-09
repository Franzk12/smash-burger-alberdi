import { NextRequest, NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://smash-burger-alberdi.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { items, nombre, modalidad, direccion, zona, orderId } = await req.json();

    const mpItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    // Agregar costo de envío si aplica
    if (modalidad === "delivery" && zona === "fuera") {
      mpItems.push({
        title: "Costo de envío (fuera de zona)",
        quantity: 1,
        unit_price: 2000,
        currency_id: "ARS",
      });
    }

    const preference = {
      items: mpItems,
      external_reference: orderId, // AQUÍ VINCULAMOS EL PEDIDO
      payer: {
        name: nombre,
      },
      back_urls: {
        success: `${BASE_URL}/pedido/exitoso`,
        failure: `${BASE_URL}/pedido/error`,
        pending: `${BASE_URL}/pedido/pendiente`,
      },
      auto_return: "approved",
      statement_descriptor: "SMASH BURGER ALBERDI",
      metadata: {
        nombre,
        modalidad,
        direccion: direccion || "Retiro en local",
        zona: zona || "local",
        orderId,
      },
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error detallado de Mercado Pago:", data);
      return NextResponse.json({ 
        error: "Error al crear preferencia", 
        message: data.message || "Error desconocido",
        cause: data.cause || [],
        full_detail: data
      }, { status: 500 });
    }

    return NextResponse.json({ 
      init_point: data.init_point,        // producción
      sandbox_init_point: data.sandbox_init_point, // pruebas
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}