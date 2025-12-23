import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('marketplace_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar categorias'
      })
    }

    return {
      success: true,
      data: categories || []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

