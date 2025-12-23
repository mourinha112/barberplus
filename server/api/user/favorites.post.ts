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

    const body = await readBody(event)
    const { barbershopId } = body

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Verificar se já existe
    const { data: existing } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', decoded.sub)
      .eq('barbershop_id', barbershopId)
      .single()

    if (existing) {
      // Remover dos favoritos
      await supabaseAdmin
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      return {
        success: true,
        action: 'removed',
        message: 'Removido dos favoritos'
      }
    }

    // Adicionar aos favoritos
    const { data: favorite, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: decoded.sub,
        barbershop_id: barbershopId
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao adicionar aos favoritos'
      })
    }

    return {
      success: true,
      action: 'added',
      data: favorite
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

