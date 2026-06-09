-- ============================================================
-- SMASH BURGER ALBERDI — Schema Supabase
-- Corré esto en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── PRODUCTOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  description TEXT,
  category    TEXT NOT NULL CHECK (category IN ('burger', 'milanesa', 'papa', 'extra')),
  available   BOOLEAN NOT NULL DEFAULT TRUE,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PEDIDOS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id             TEXT PRIMARY KEY,              -- formato "ORD-XXXX"
  customer_name  TEXT NOT NULL,
  phone          TEXT,
  address        TEXT,
  order_type     TEXT NOT NULL CHECK (order_type IN ('retiro', 'delivery')),
  payment_method TEXT NOT NULL CHECK (payment_method IN (
    'efectivo', 'transferencia', 'mercadopago', 'mercadopago_pendiente'
  )),
  total          NUMERIC(10, 2) NOT NULL,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN (
    'pendiente', 'preparando', 'completado'
  )),
  referencia     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ITEMS DE PEDIDO ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS items_pedido (
  id        BIGSERIAL PRIMARY KEY,
  pedido_id TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  price     NUMERIC(10, 2) NOT NULL,
  quantity  INTEGER NOT NULL CHECK (quantity > 0),
  category  TEXT NOT NULL DEFAULT 'burger'
);

-- ── CONFIGURACIÓN DEL LOCAL ───────────────────────────────
CREATE TABLE IF NOT EXISTS store_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valor inicial: local abierto
INSERT INTO store_config (key, value)
VALUES ('store_status', 'open')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ÍNDICES (mejoran velocidad de consultas frecuentes)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pedidos_status      ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at  ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_payment     ON pedidos(payment_method);
CREATE INDEX IF NOT EXISTS idx_items_pedido_id     ON items_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_productos_category  ON productos(category);
CREATE INDEX IF NOT EXISTS idx_productos_available ON productos(available);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Todo pasa por el servidor con service_role, así que
-- bloqueamos acceso público directo a las tablas sensibles.
-- ============================================================

ALTER TABLE pedidos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;

-- Pedidos: solo el service_role puede leer/escribir
-- (el anon key no necesita acceso, todo va por API routes)
DROP POLICY IF EXISTS "pedidos_service_only" ON pedidos;
CREATE POLICY "pedidos_service_only" ON pedidos
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "items_service_only" ON items_pedido;
CREATE POLICY "items_service_only" ON items_pedido
  USING (auth.role() = 'service_role');

-- Productos: lectura pública (para el menú), escritura solo service_role
DROP POLICY IF EXISTS "productos_public_read" ON productos;
CREATE POLICY "productos_public_read" ON productos
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "productos_service_write" ON productos;
CREATE POLICY "productos_service_write" ON productos
  FOR ALL USING (auth.role() = 'service_role');

-- store_config: lectura pública (el bot la lee con anon key), escritura service_role
DROP POLICY IF EXISTS "store_config_public_read" ON store_config;
CREATE POLICY "store_config_public_read" ON store_config
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "store_config_service_write" ON store_config;
CREATE POLICY "store_config_service_write" ON store_config
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- REALTIME (necesario para las actualizaciones en vivo del panel)
-- Activar en: Supabase Dashboard → Database → Replication
-- O correr esto:
-- ============================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;
-- (Descomentar si los pedidos en tiempo real no funcionan)
