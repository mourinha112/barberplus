import { supabaseAdmin, isSupabaseConfigured, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      barbershopId,
      date,
      startDate,
      endDate,
      status,
      professionalId,
      page = 1,
      limit = 50
    } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Modo demo
    if (!isSupabaseConfigured || (typeof barbershopId === 'string' && barbershopId.startsWith('demo-'))) {
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: Number(limit),
          total: 0,
          totalPages: 0
        }
      }
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        client:clients(id, name, phone, avatar_url),
        professional:professionals(id, name, avatar_url),
        services:appointment_services(id, service_name, price, duration_minutes)
      `, { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    if (date) {
      queryBuilder = queryBuilder.eq('date', date)
    }
    if (startDate) {
      queryBuilder = queryBuilder.gte('date', startDate)
    }
    if (endDate) {
      queryBuilder = queryBuilder.lte('date', endDate)
    }
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }
    if (professionalId) {
      queryBuilder = queryBuilder.eq('professional_id', professionalId)
    }

    queryBuilder = queryBuilder
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .range(from, to)

    const { data: appointments, error, count } = await queryBuilder

    if (error) {
      // Se tabela não existe, retorna vazio
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return {
          success: true,
          data: [],
          pagination: { page: Number(page), limit: Number(limit), total: 0, totalPages: 0 }
        }
      }
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
