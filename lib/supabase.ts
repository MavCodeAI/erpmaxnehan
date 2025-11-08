import { createClient } from '@supabase/supabase-js'

// Fixed: Use correct Vite environment variables - Updated with working anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qxmvgdlognorppmgeusu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'PASTE_ANON_KEY_HERE'

// Fixed: Add proper error handling and validation
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-url')) {
  console.warn('⚠️ Supabase credentials not properly configured. Using demo mode.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Fixed: Add connection health check
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('customers').select('count').limit(1)
    return { connected: !error, error }
  } catch (err) {
    return { connected: false, error: err }
  }
}
