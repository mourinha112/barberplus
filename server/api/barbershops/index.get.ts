import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

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

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('barbershops')
      .select(`
        *,
        categories:barbershop_categories(
          category:marketplace_categories(*)
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    // Filtro de busca
    if (search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${search}%,address_neighborhood.ilike.%${search}%,address_city.ilike.%${search}%`)
    }

    // Filtro de destaque
    if (featured === 'true') {
      queryBuilder = queryBuilder.eq('is_featured', true)
    }

    // Filtro por categoria
    if (category) {
      const { data: categoryData } = await supabaseAdmin
        .from('marketplace_categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        const { data: barbershopIds } = await supabaseAdmin
          .from('barbershop_categories')
          .select('barbershop_id')
          .eq('category_id', categoryData.id)
        
        if (barbershopIds?.length) {
          queryBuilder = queryBuilder.in('id', barbershopIds.map(b => b.barbershop_id))
        }
      }
    }

    // Ordenação
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
        queryBuilder = queryBuilder.order('rating_average', { ascending: false })
    }

    // Paginação
    queryBuilder = queryBuilder.range(from, to)

    const { data: barbershops, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar barbearias'
      })
    }

    // Calcular distância se lat/lng fornecidos
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

      // Filtrar por raio
      if (radius) {
        results = results.filter(b => b.distance <= Number(radius))
      }

      // Ordenar por distância se necessário
      if (sortBy === 'distance') {
        results.sort((a, b) => a.distance - b.distance)
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

// Função para calcular distância em km (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat2 || !lon2) return 999999
  
  const R = 6371 // Raio da Terra em km
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

