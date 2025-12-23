import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      barbershopId,
      search,
      sortBy = 'name',
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
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    // Busca
    if (search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Ordenação
    switch (sortBy) {
      case 'name':
        queryBuilder = queryBuilder.order('name')
        break
      case 'visits':
        queryBuilder = queryBuilder.order('total_visits', { ascending: false })
        break
      case 'spent':
        queryBuilder = queryBuilder.order('total_spent', { ascending: false })
        break
      case 'recent':
        queryBuilder = queryBuilder.order('last_visit', { ascending: false, nullsFirst: false })
        break
      default:
        queryBuilder = queryBuilder.order('name')
    }

    queryBuilder = queryBuilder.range(from, to)

    const { data: clients, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar clientes'
      })
    }

    return {
      success: true,
      data: clients || [],
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

