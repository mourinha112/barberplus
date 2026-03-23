import { supabaseAdmin, isSupabaseConfigured, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      page = 1,
      limit = 20,
      search,
      category,
      featured,
      lat,
      lng,
      radius = 10,
      sortBy = 'rating'
    } = query

    if (!isSupabaseConfigured) {
      return { success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('barbershops')
      .select('*', { count: 'exact' })
      .eq('is_active', true)

    if (search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${search}%,address_neighborhood.ilike.%${search}%,address_city.ilike.%${search}%`)
    }

    if (featured === 'true') {
      queryBuilder = queryBuilder.eq('is_featured', true)
    }

    switch (sortBy) {
      case 'rating':
        queryBuilder = queryBuilder.order('rating_average', { ascending: false })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('total_appointments', { ascending: false })
        break
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    queryBuilder = queryBuilder.range(from, to)

    const { data: barbershops, error, count } = await queryBuilder

    if (error) {
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return { success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
      }
      throw createError({ statusCode: 500, message: 'Erro ao buscar barbearias' })
    }

    let results = barbershops || []
    if (lat && lng) {
      results = results.map(barbershop => ({
        ...barbershop,
        distance: calculateDistance(Number(lat), Number(lng), Number(barbershop.latitude), Number(barbershop.longitude))
      }))

      if (radius) {
        results = results.filter(b => b.distance <= Number(radius))
      }

      if (sortBy === 'distance') {
        results.sort((a: any, b: any) => a.distance - b.distance)
      }
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
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
