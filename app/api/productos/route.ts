import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Obtener todos los productos activos (público) o todos (admin)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isAdmin = url.searchParams.get("admin") === "true";

  let query = supabase.from("productos").select("*").order("category").order("name");

  if (!isAdmin) {
    query = query.eq("available", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ productos: data });
}

// POST - Crear un nuevo producto (requiere password)
export async function POST(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("productos")
    .insert([
      {
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        available: body.available ?? true,
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, producto: data });
}

// PATCH - Actualizar un producto (requiere password)
export async function PATCH(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id, ...updates } = await req.json();

  const { data, error } = await supabase
    .from("productos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, producto: data });
}

// DELETE - Eliminar un producto (requiere password)
export async function DELETE(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await req.json();

  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
