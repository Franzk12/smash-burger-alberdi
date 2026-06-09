import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("pedidos")
    .select("id")
    .in("status", ["pendiente", "preparando"]);

  const count = data?.length ?? 0;
  let minutos = 20;
  if (count >= 2 && count <= 3) minutos = 30;
  else if (count >= 4 && count <= 6) minutos = 45;
  else if (count > 6) minutos = 60;

  return NextResponse.json({ count, minutos });
}
