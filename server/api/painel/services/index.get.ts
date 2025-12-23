import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId, category } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    let queryBuilder = supabaseAdmin
      .from('services')
      .select(`
        *,
        professionals:service_professionals(
          professional:professionals(id, name)
        )
      `)
      .eq('barbershop_id', barbershopId)
      .order('sort_order')

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    const { data: services, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar serviços'
      })
    }

    // Buscar categorias únicas
    const { data: categories } = await supabaseAdmin
      .from('services')
      .select('category')
      .eq('barbershop_id', barbershopId)
      .not('category', 'is', null)

    const uniqueCategories = [...new Set(categories?.map(c => c.category).filter(Boolean))]

    return {
      success: true,
      data: services || [],
      categories: uniqueCategories
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

