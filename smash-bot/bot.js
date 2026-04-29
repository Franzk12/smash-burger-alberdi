import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const HORARIO = "a partir de las 20:30 hs";
const WEB_URL = "https://smash-burger-alberdi.vercel.app";
const NUMERO_LOCAL = "3865228354";

// ─── MENÚ COMPLETO ────────────────────────────────────────────────────────────
const menu = {
  burgers: [
    { nombre: "big smash",       precio: 9500,  ingredientes: "Medallón de carne, Pepinillo, Cebolla Brunoise, Lechuga, Queso Cheddar, Salsa Smash" },
    { nombre: "americana",       precio: 9500,  ingredientes: "Medallón de carne, Bacon, Queso Cheddar, Cebolla Caramelizada, Salsa Smash" },
    { nombre: "cheesse burger",  precio: 9500,  ingredientes: "Medallón de carne, Bacon, Queso Cheddar, Cebolla Brunoise, Salsa Smash" },
    { nombre: "cuarto de libra", precio: 9000,  ingredientes: "Medallón de carne, Queso Cheddar, Ketchup, Mostaza, Cebolla Brunoise" },
    { nombre: "cangreburger",    precio: 9500,  ingredientes: "Medallón de carne, Cebolla, Lechuga, Tomate, Queso Cheddar, Salsa Smash" },
    { nombre: "especial",        precio: 9000,  ingredientes: "Medallón de carne, Jamón y Queso Tybo, Lechuga, Tomate, Huevo, Mayonesa" },
    { nombre: "crispy onion",    precio: 9000,  ingredientes: "Medallón de carne, Queso Cheddar, Cebolla Crispy, Salsa Barbacoa" },
    { nombre: "okc smash",       precio: 9000,  ingredientes: "Medallón de carne, Queso Cheddar, Cebolla Salteada en aceite de Bacon" },
    { nombre: "golden onion",    precio: 10000, ingredientes: "Medallón de carne, Aros de Cebolla, Queso Cheddar, Bacon, Mostaza, Ketchup" },
    { nombre: "blue",            precio: 11000, ingredientes: "Medallón de carne, Cheddar, Cebolla Caramelizada, Queso Azul con Nuez, Tomates Confitados y Ahumados" },
  ],
  milanesas: [
    { nombre: "milanesa comun",    precio: 11000 },
    { nombre: "milanesa especial", precio: 11500 },
    { nombre: "lomito comun",      precio: 12000 },
    { nombre: "lomito especial",   precio: 12500 },
  ],
  papas: [
    { nombre: "papas smash",      precio: 8500, ingredientes: "Queso Cheddar, Bacon, Verdeo" },
    { nombre: "salchipapa",       precio: 7000, ingredientes: "Papas, Salchicha, Queso Cheddar, Verdeo" },
    { nombre: "papas gratinadas", precio: 7500 },
    { nombre: "porcion de papas", precio: 5500 },
  ],
  extras: [
    { nombre: "pepinillos",              precio: 600  },
    { nombre: "aros de cebolla",         precio: 800  },
    { nombre: "huevo",                   precio: 600  },
    { nombre: "jamon",                   precio: 600  },
    { nombre: "bacon",                   precio: 700  },
    { nombre: "medallon extra con queso",precio: 2500 },
    { nombre: "bano de cheddar y bacon", precio: 2000 },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatPrice = (p) => `$${p.toLocaleString("es-AR")}`;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findProduct(text) {
  const t = normalize(text);
  const all = [...menu.burgers, ...menu.milanesas, ...menu.papas, ...menu.extras];
  return all.find((p) => t.includes(normalize(p.nombre)));
}

// ─── LÓGICA DE RESPUESTAS ─────────────────────────────────────────────────────
function getResponse(text) {
  const t = normalize(text);

  // Saludo
  if (/^(hola|buen[ao]s?|buenas|hey|ahi|ahi estan|que tal|como andan)/.test(t)) {
    return `¡Hola! 👋 Bienvenido a *Smash Burger Alberdi* 🍔\n\nAtendemos *${HORARIO}*.\n\nPodés:\n• Ver el menú completo y hacer tu pedido online: ${WEB_URL}\n• Escribirme el nombre de cualquier burger para saber el precio e ingredientes\n• Preguntar lo que necesites 😊`;
  }

  // Horario
  if (/horario|qu[ée] hora|hasta cu[áa]ndo|est[áa]n abiertos|abren|cierran|atienden/.test(t)) {
    return `🕗 Atendemos *${HORARIO}* todos los días.\n\n¿Querés ver el menú? ${WEB_URL}`;
  }

  // Delivery / envío
  if (/delivery|env[ií]o|llegan|a domicilio|reparten|mandan/.test(t)) {
    return `🛵 *Sí, hacemos delivery!*\n\n• Zona Alberdi → *envío gratis*\n• Fuera de Alberdi → +$2.000\n\nTiempo estimado: hasta 30 minutos ⏱\n\nHacé tu pedido acá: ${WEB_URL}`;
  }

  // Pedido / cómo pedir
  if (/c[oó]mo pido|quiero pedir|hacer un pedido|pedido|pedir/.test(t)) {
    return `🍔 Para hacer tu pedido entrá acá:\n👉 ${WEB_URL}\n\nElegís lo que querés, ponés tu dirección y nos llega directo. Fácil y rápido! ✅`;
  }

  // Precio genérico / menú completo
  if (/men[uú]|carta|qu[eé] tienen|qu[eé] hay|todo|precios/.test(t)) {
    const burgers = menu.burgers.map((b) => `  • ${b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1)} — ${formatPrice(b.precio)}`).join("\n");
    const papas = menu.papas.map((p) => `  • ${p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1)} — ${formatPrice(p.precio)}`).join("\n");
    return `📋 *Menú Smash Burger Alberdi*\n\n🍔 *Burgers:*\n${burgers}\n\n🍟 *Papas:*\n${papas}\n\nVer menú completo y pedir online: ${WEB_URL}`;
  }

  // Precio / ingredientes de un producto específico
  const producto = findProduct(t);
  if (producto) {
    let respuesta = `🍔 *${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}*\n💰 Precio: *${formatPrice(producto.precio)}*`;
    if (producto.ingredientes) {
      respuesta += `\n\n🥬 Ingredientes:\n${producto.ingredientes}`;
    }
    respuesta += `\n\n¿Lo agregamos a tu pedido? 👉 ${WEB_URL}`;
    return respuesta;
  }

  // Medios de pago
  if (/pago|pagar|mercadopago|efectivo|tarjeta/.test(t)) {
    return `💳 *Medios de pago:*\n\n• Efectivo (al recibir el pedido)\n• MercadoPago (online)\n\nHacé tu pedido acá: ${WEB_URL}`;
  }

  // Gracias
  if (/gracias|grax|grac/.test(t)) {
    return `¡De nada! 😊 Cualquier cosa que necesites, acá estamos. *¡Buen provecho!* 🍔🔥`;
  }

  // Default
  return `Hola! 👋 Soy el bot de *Smash Burger Alberdi*.\n\nPodés preguntarme por:\n• 🍔 Precios e ingredientes de cualquier burger\n• 🕗 Horario de atención\n• 🛵 Información de delivery\n• 📋 Menú completo\n\nO hacé tu pedido directo acá: ${WEB_URL}\n\nSi necesitás hablar con alguien, escribinos al ${NUMERO_LOCAL} 😊`;
}

// ─── CONEXIÓN WHATSAPP ────────────────────────────────────────────────────────
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.clear();
      console.log("═══════════════════════════════════════");
      console.log("   SMASH BURGER BOT — Escanear QR");
      console.log("═══════════════════════════════════════");
      console.log("Abrí WhatsApp → Dispositivos vinculados → Vincular dispositivo\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("\n✅ Bot conectado y listo para responder!\n");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Conexión cerrada. Reconectando...", shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Cooldown: evita responder más de 1 vez cada 3 segundos al mismo número
  const cooldown = new Map();

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      // Ignorar mensajes propios, grupos y estados
      if (msg.key.fromMe) continue;
      if (msg.key.remoteJid.includes("@g.us")) continue;
      if (msg.key.remoteJid === "status@broadcast") continue;

      // Ignorar mensajes reenviados (evita loops)
      if (msg.message?.extendedTextMessage?.contextInfo?.isForwarded) continue;
      if (msg.message?.forwardingScore > 0) continue;

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

      if (!text) continue;

      // Cooldown de 3 segundos por número
      const jid = msg.key.remoteJid;
      const ahora = Date.now();
      if (cooldown.has(jid) && ahora - cooldown.get(jid) < 3000) {
        console.log(`⏳ Cooldown activo para ${jid}, ignorando mensaje`);
        continue;
      }
      cooldown.set(jid, ahora);

      console.log(`📩 [${new Date().toLocaleTimeString("es-AR")}] ${jid}: ${text}`);

      const respuesta = getResponse(text);

      await sock.sendMessage(jid, { text: respuesta });
      console.log(`✅ Respondido\n`);
    }
  });
}

connectToWhatsApp();