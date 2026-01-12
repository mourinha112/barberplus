import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

// Verifica se Supabase está configurado
export const isSupabaseConfigured = !!(supabaseUrl && supabaseServiceKey)

// Cliente admin (server-side) - tem acesso total
export const supabaseAdmin = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null as any

// Função para criar cliente com token do usuário
export const createSupabaseClient = (accessToken?: string) => {
  if (accessToken) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })
  }
  return supabaseAdmin
}

// Helper para extrair token do header
export const getTokenFromHeader = (event: any): string | undefined => {
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return undefined
}

// Helper para paginação
export const getPagination = (page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { from, to, limit }
}

