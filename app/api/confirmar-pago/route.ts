import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId } = await req.json();

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "Faltan datos del pago" }, { status: 400 });
    }

    // Verificar el pago con la API de Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });

    if (!mpResponse.ok) {
      return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 502 });
    }

    const payment = await mpResponse.json();

    // Solo confirmar si el pago fue aprobado y corresponde al pedido
    if (payment.status !== "approved") {
      return NextResponse.json({ error: "Pago no aprobado", status: payment.status }, { status: 400 });
    }

    if (payment.external_reference !== orderId) {
      return NextResponse.json({ error: "El pago no corresponde a este pedido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("pedidos")
      .update({ payment_method: "mercadopago" })
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error en confirmar-pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
