import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** false si faltan las variables en .env.local */
export const isSupabaseConfigured = Boolean(url && anonKey)

// Si faltan las variables se usan valores de relleno para que la app cargue
// y el login pueda mostrar un aviso claro en vez de una pantalla en blanco.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-key',
)
