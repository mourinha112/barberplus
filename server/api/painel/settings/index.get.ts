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

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .select(`
        *,
        working_hours(*),
        amenities:barbershop_amenities(*),
        gallery:barbershop_gallery(*)
      `)
      .eq('id', barbershopId)
      .single()

    if (error || !barbershop) {
      throw createError({
        statusCode: 404,
        message: 'Barbearia não encontrada'
      })
    }

    return {
      success: true,
      data: barbershop
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

