import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      barbershopId,
      professionalId,
      rating,
      replied,
      page = 1,
      limit = 20
    } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('reviews')
      .select(`
        *,
        client:clients(id, name, avatar_url),
        professional:professionals(id, name, avatar_url),
        appointment:appointments(date, services:appointment_services(service_name))
      `, { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    if (professionalId) {
      queryBuilder = queryBuilder.eq('professional_id', professionalId)
    }

    if (rating) {
      queryBuilder = queryBuilder.eq('rating', rating)
    }

    if (replied === 'true') {
      queryBuilder = queryBuilder.not('reply', 'is', null)
    } else if (replied === 'false') {
      queryBuilder = queryBuilder.is('reply', null)
    }

    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data: reviews, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar avaliações'
      })
    }

    // Estatísticas
    const { data: stats } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('barbershop_id', barbershopId)

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    stats?.forEach(r => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++
    })

    const totalRatings = stats?.length || 0
    const averageRating = totalRatings 
      ? stats.reduce((acc, r) => acc + r.rating, 0) / totalRatings 
      : 0

    return {
      success: true,
      data: reviews || [],
      stats: {
        average: Math.round(averageRating * 10) / 10,
        total: totalRatings,
        distribution: ratingDistribution
      },
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

