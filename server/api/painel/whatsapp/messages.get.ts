import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { barbershopId, status, page = 1, limit = 50 } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('whatsapp_messages')
      .select(`
        *,
        automation:whatsapp_automations(name, trigger_type),
        client:clients(name)
      `, { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data: messages, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar mensagens'
      })
    }

    return {
      success: true,
      data: messages || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

