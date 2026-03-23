import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth

  if (!auth?.userId) {
    throw createError({
      statusCode: 401,
      message: 'Não autorizado'
    })
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      data: [],
      demo: true
    }
  }

  try {
    const { data: barbershops, error } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('owner_id', auth.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar barbearias:', error)
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        throw createError({
          statusCode: 500,
          message: 'Tabela de barbearias não encontrada. Execute o schema SQL no Supabase.'
        })
      }
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar barbearias'
      })
    }

    return {
      success: true,
      data: barbershops || []
    }
  } catch (error: any) {
    if (error.statusCode && typeof error.statusCode === 'number') {
      throw error
    }
    console.error('Erro ao buscar barbearias:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})
