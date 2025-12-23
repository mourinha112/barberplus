import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Token não fornecido'
      })
    }

    const token = authHeader.substring(7)
    
    // Verificar token
    const jwt = await import('jsonwebtoken')
    const secret = process.env.JWT_SECRET || 'fallback-secret'
    
    let decoded: any
    try {
      decoded = jwt.default.verify(token, secret)
    } catch {
      throw createError({
        statusCode: 401,
        message: 'Token inválido'
      })
    }

    // Buscar usuário atualizado
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single()

    if (error || !user) {
      throw createError({
        statusCode: 404,
        message: 'Usuário não encontrado'
      })
    }

    // Buscar barbearias do usuário (se for gestor/profissional)
    let barbershops: any[] = []
    if (user.role === 'manager' || user.role === 'admin') {
      const { data } = await supabaseAdmin
        .from('barbershops')
        .select('id, name, slug, logo_url')
        .eq('owner_id', user.id)
      
      barbershops = data || []
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified
      },
      barbershops
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

