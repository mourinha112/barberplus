import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      barbershopId,
      type,
      startDate,
      endDate,
      category,
      page = 1,
      limit = 50
    } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        professional:professionals(name),
        client:clients(name)
      `, { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    if (type) {
      queryBuilder = queryBuilder.eq('type', type)
    }

    if (startDate) {
      queryBuilder = queryBuilder.gte('transaction_date', startDate)
    }

    if (endDate) {
      queryBuilder = queryBuilder.lte('transaction_date', endDate)
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    queryBuilder = queryBuilder
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data: transactions, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar transações'
      })
    }

    return {
      success: true,
      data: transactions || [],
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

