import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { lat, lng, radius = 5, limit = 10 } = query

    if (!lat || !lng) {
      throw createError({
        statusCode: 400,
        message: 'Latitude e longitude são obrigatórios'
      })
    }

    const { data: barbershops, error } = await supabaseAdmin
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
      `)
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar barbearias próximas'
      })
    }

    // Calcular distância e filtrar
    const nearbyBarbershops = (barbershops || [])
      .map(barbershop => ({
        ...barbershop,
        distance: calculateDistance(
          Number(lat),
          Number(lng),
          Number(barbershop.latitude),
          Number(barbershop.longitude)
        )
      }))
      .filter(b => b.distance <= Number(radius))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Number(limit))

    return {
      success: true,
      data: nearbyBarbershops
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

