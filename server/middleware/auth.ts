import { supabaseAdmin } from '~/server/utils/supabase'

// Middleware de autenticação
export default defineEventHandler(async (event) => {
  // Rotas que não precisam de autenticação
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/marketplace',
    '/api/barbershops',
    '/api/link-bio'
  ]

  const path = event.path || ''
  
  // Ignorar rotas públicas e métodos que não são de API
  if (!path.startsWith('/api/') || publicRoutes.some(route => path.startsWith(route))) {
    return
  }

  // Verificar se é rota de painel (requer auth)
  if (path.startsWith('/api/painel/')) {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Não autorizado'
      })
    }

    const token = authHeader.substring(7)
    
    try {
      const jwt = await import('jsonwebtoken')
      const secret = process.env.JWT_SECRET || 'fallback-secret'
      const decoded: any = jwt.default.verify(token, secret)
      
      // Adicionar usuário ao contexto
      event.context.auth = {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role
      }
    } catch {
      throw createError({
        statusCode: 401,
        message: 'Token inválido'
      })
    }
  }
})

