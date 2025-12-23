import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Não autorizado'
      })
    }

    const token = authHeader.substring(7)
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

    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        id,
        created_at,
        barbershop:barbershops(
          id,
          name,
          slug,
          logo_url,
          cover_url,
          rating_average,
          rating_count,
          address_neighborhood,
          address_city
        )
      `)
      .eq('user_id', decoded.sub)
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar favoritos'
      })
    }

    return {
      success: true,
      data: favorites || []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

