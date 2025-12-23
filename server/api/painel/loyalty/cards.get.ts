import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { barbershopId, completed, page = 1, limit = 50 } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Buscar programa
    const { data: program } = await supabaseAdmin
      .from('loyalty_programs')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .single()

    if (!program) {
      return {
        success: true,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('loyalty_cards')
      .select(`
        *,
        client:clients(id, name, phone, avatar_url)
      `, { count: 'exact' })
      .eq('program_id', program.id)

    if (completed !== undefined) {
      queryBuilder = queryBuilder.eq('is_completed', completed === 'true')
    }

    queryBuilder = queryBuilder
      .order('stamps_collected', { ascending: false })
      .range(from, to)

    const { data: cards, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar cartões'
      })
    }

    return {
      success: true,
      data: cards || [],
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

