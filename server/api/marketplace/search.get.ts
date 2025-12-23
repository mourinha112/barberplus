import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      q,
      category,
      lat,
      lng,
      radius = 20,
      minRating,
      services,
      page = 1,
      limit = 20
    } = query

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('barbershops')
      .select(`
        id,
        name,
        slug,
        logo_url,
        cover_url,
        rating_average,
        rating_count,
        address_neighborhood,
        address_city,
        latitude,
        longitude
      `, { count: 'exact' })
      .eq('is_active', true)

    // Busca por texto
    if (q) {
      queryBuilder = queryBuilder.or(`name.ilike.%${q}%,address_neighborhood.ilike.%${q}%,address_city.ilike.%${q}%`)
    }

    // Rating mínimo
    if (minRating) {
      queryBuilder = queryBuilder.gte('rating_average', minRating)
    }

    queryBuilder = queryBuilder
      .order('rating_average', { ascending: false })
      .range(from, to)

    const { data: barbershops, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro na busca'
      })
    }

    // Calcular distância e filtrar
    let results = barbershops || []
    if (lat && lng) {
      results = results.map(barbershop => ({
        ...barbershop,
        distance: calculateDistance(
          Number(lat),
          Number(lng),
          Number(barbershop.latitude),
          Number(barbershop.longitude)
        )
      }))

      if (radius) {
        results = results.filter(b => b.distance <= Number(radius))
      }

      results.sort((a, b) => a.distance - b.distance)
    }

    return {
      success: true,
      data: results,
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat2 || !lon2) return 999999
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

