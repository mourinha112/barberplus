import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
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
        address_city
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('rating_average', { ascending: false })
      .limit(10)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar barbearias em destaque'
      })
    }

    return {
      success: true,
      data: barbershops || []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

