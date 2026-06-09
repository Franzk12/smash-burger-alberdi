import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const botDir = path.join(process.cwd(), "smash-bot");
const statusFile = path.join(botDir, "status.json");

function getStatus() {
  if (fs.existsSync(statusFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(statusFile, "utf-8"));
      // Si el bot crasheó y el status file se quedó, chequeamos si el PID está vivo (solo Windows/Linux).
      // En un entorno de producción real esto requiere más robustez, pero para entorno local está bien.
      try {
        process.kill(data.pid, 0); // Esto lanza error si el PID no existe
        return data;
      } catch (e) {
        // El proceso no existe, limpiamos el status file
        fs.unlinkSync(statusFile);
      }
    } catch (e) {
      // JSON inválido u otro error
    }
  }
  return { status: "APAGADO", qr: null, pid: null };
}

export async function GET(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json(getStatus());
}

export async function POST(req: NextRequest) {
  const pass = req.headers.get("x-panel-password");
  if (pass !== process.env.PANEL_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { action } = await req.json();
  const currentStatus = getStatus();

  if (action === "start") {
    if (currentStatus.status !== "APAGADO") {
      return NextResponse.json({ ok: false, error: "El bot ya está corriendo" });
    }

    // Iniciamos el bot. En Windows es mejor usar npm start a traves de shell.
    const child = spawn("npm", ["start"], {
      cwd: botDir,
      shell: true,
      detached: true,
      stdio: "ignore"
    });
    child.unref(); // Permite que el servidor Next.js viva independientemente del bot

    return NextResponse.json({ ok: true, message: "Bot iniciando..." });
  }

  if (action === "stop") {
    if (currentStatus.status !== "APAGADO" && currentStatus.pid) {
      try {
        process.kill(currentStatus.pid, "SIGTERM");
      } catch (e) {
        // Puede fallar si el proceso es de un árbol diferente en Windows,
        // En Windows matar procesos creados con shell: true puede requerir taskkill.
        try {
          spawn("taskkill", ["/pid", currentStatus.pid.toString(), "/f", "/t"]);
        } catch(err) {}
      }
      if (fs.existsSync(statusFile)) fs.unlinkSync(statusFile);
    }
    return NextResponse.json({ ok: true, message: "Bot apagado." });
  }

  if (action === "logout") {
    // Para desvincular el WhatsApp, borramos la carpeta auth_info
    if (currentStatus.status !== "APAGADO" && currentStatus.pid) {
      try {
        spawn("taskkill", ["/pid", currentStatus.pid.toString(), "/f", "/t"]);
      } catch(err) {}
    }
    if (fs.existsSync(statusFile)) fs.unlinkSync(statusFile);
    
    const authDir = path.join(botDir, "auth_info");
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    return NextResponse.json({ ok: true, message: "Sesión cerrada y bot apagado." });
  }

  return NextResponse.json({ ok: false, error: "Acción inválida" }, { status: 400 });
}
