import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Supabase renombró la anon key a publishable key — soportamos ambas
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const supabase = createClient(supabaseUrl, supabasePublicKey)

// Cliente administrativo (solo para uso en el SERVIDOR)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseAdmin = (typeof window === 'undefined' && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null as any
