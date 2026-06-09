import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("id, customer_name, status, created_at, order_type, address, items:items_pedido(name, quantity, price)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}
