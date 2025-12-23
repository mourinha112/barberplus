import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

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

    const query = getQuery(event)
    const { status, page = 1, limit = 20 } = query
    const { from, to } = getPagination(Number(page), Number(limit))

    // Buscar clientes do usuário
    const { data: clients } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', decoded.sub)

    if (!clients?.length) {
      return {
        success: true,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      }
    }

    const clientIds = clients.map(c => c.id)

    let queryBuilder = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        barbershop:barbershops(id, name, slug, logo_url, address_neighborhood, address_city),
        professional:professionals(id, name, avatar_url),
        services:appointment_services(service_name, price)
      `, { count: 'exact' })
      .in('client_id', clientIds)

    if (status === 'upcoming') {
      const today = new Date().toISOString().split('T')[0]
      queryBuilder = queryBuilder
        .gte('date', today)
        .in('status', ['pending', 'confirmed'])
    } else if (status === 'past') {
      queryBuilder = queryBuilder.in('status', ['completed', 'cancelled', 'no_show'])
    }

    queryBuilder = queryBuilder
      .order('date', { ascending: status !== 'past' })
      .order('start_time', { ascending: status !== 'past' })
      .range(from, to)

    const { data: appointments, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar agendamentos'
      })
    }

    return {
      success: true,
      data: appointments || [],
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

