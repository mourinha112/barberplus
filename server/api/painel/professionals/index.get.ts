import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const { data: professionals, error } = await supabaseAdmin
      .from('professionals')
      .select(`
        *,
        services:service_professionals(
          service:services(id, name, price)
        )
      `)
      .eq('barbershop_id', barbershopId)
      .order('sort_order')

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar profissionais'
      })
    }

    return {
      success: true,
      data: professionals || []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

