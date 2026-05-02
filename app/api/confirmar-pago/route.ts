import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Falta el ID del pedido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('pedidos')
      .update({ payment_method: 'mercadopago' })
      .eq('id', orderId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error en confirmar-pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
