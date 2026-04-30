import { NextRequest, NextResponse } from "next/server";

// Storage en memoria (se resetea si se reinicia el servidor)
// Para producción real se usaría una base de datos
const pedidos: Pedido[] = [];

export type Pedido = {
  id: string;
  timestamp: number;
  nombre: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  modalidad: "retiro" | "delivery";
  direccion?: string;
  zona?: string;
  pago: "efectivo" | "mercadopago";
  estado: "pendiente" | "en-preparacion" | "listo" | "entregado";
};

// GET — obtener todos los pedidos (requiere password)
export async function GET(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ pedidos: pedidos.sort((a, b) => b.timestamp - a.timestamp) });
}

// POST — crear nuevo pedido
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pedido: Pedido = {
      id: `P${Date.now()}`,
      timestamp: Date.now(),
      nombre: body.nombre,
      items: body.items,
      total: body.total,
      modalidad: body.modalidad,
      direccion: body.direccion,
      zona: body.zona,
      pago: body.pago,
      estado: "pendiente",
    };
    pedidos.push(pedido);
    return NextResponse.json({ ok: true, id: pedido.id });
  } catch {
    return NextResponse.json({ error: "Error al guardar pedido" }, { status: 500 });
  }
}

// PATCH — actualizar estado de un pedido
export async function PATCH(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id, estado } = await req.json();
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  pedido.estado = estado;
  return NextResponse.json({ ok: true });
}