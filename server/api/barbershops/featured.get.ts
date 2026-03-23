import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    if (!isSupabaseConfigured) {
      return { success: true, data: [] }
    }

    const { data: barbershops, error } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('is_active', true)
      .order('rating_average', { ascending: false })
      .limit(10)

    if (error) {
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return { success: true, data: [] }
      }
      throw createError({ statusCode: 500, message: 'Erro ao buscar barbearias em destaque' })
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
