import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MP envía distintos tipos de eventos (payment, merchant_order, etc.)
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: "Sin ID de pago" }, { status: 400 })
    }

    // Verificar el pago directamente con la API de MP
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    })

    if (!mpResponse.ok) {
      console.error(`Webhook MP: no se pudo verificar pago ${paymentId}`)
      return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 502 })
    }

    const payment = await mpResponse.json()

    // Solo procesar pagos aprobados
    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, skipped: true, paymentStatus: payment.status })
    }

    const orderId = payment.external_reference
    if (!orderId) {
      console.error(`Webhook MP: pago ${paymentId} sin external_reference`)
      return NextResponse.json({ error: "Sin referencia de pedido" }, { status: 400 })
    }

    // Traer el pedido para verificar que el monto cobrado coincida con lo esperado
    const { data: pedido, error: fetchError } = await supabaseAdmin
      .from("pedidos")
      .select("total")
      .eq("id", orderId)
      .single()

    if (fetchError || !pedido) {
      // Pedido aún no existe / no encontrado: devolvemos 404 para que MP reintente
      console.error(`Webhook MP: pedido ${orderId} no encontrado (pago ${paymentId})`)
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    // Verificar moneda y monto (defensa en profundidad). Tolerancia de $1 por redondeos.
    const totalEsperado = Number(pedido.total)
    const montoPagado = Number(payment.transaction_amount)
    if (payment.currency_id !== "ARS" || Math.abs(montoPagado - totalEsperado) > 1) {
      console.error(`🚨 Webhook MP: monto/moneda no coincide en pedido ${orderId}`, {
        esperado: totalEsperado,
        pagado: montoPagado,
        moneda: payment.currency_id,
        paymentId,
      })
      // No confirmamos. 200 para que MP no reintente (el monto no va a cambiar).
      return NextResponse.json({ ok: false, reason: "monto_no_coincide" })
    }

    // Actualizar solo si el pedido todavía está en estado pendiente de pago
    const { error } = await supabaseAdmin
      .from("pedidos")
      .update({ payment_method: "mercadopago" })
      .eq("id", orderId)
      .eq("payment_method", "mercadopago_pendiente")

    if (error) throw error

    console.log(`✅ Webhook MP: pedido ${orderId} confirmado (pago ${paymentId})`)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("Error en webhook MP:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
