import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, amenities } = body

    if (!barbershopId || !amenities) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios incompletos'
      })
    }

    // Remover comodidades antigas
    await supabaseAdmin
      .from('barbershop_amenities')
      .delete()
      .eq('barbershop_id', barbershopId)

    // Inserir novas comodidades
    if (amenities.length > 0) {
      const amenitiesToInsert = amenities.map((a: any) => ({
        barbershop_id: barbershopId,
        name: a.name,
        icon: a.icon
      }))

      const { data, error } = await supabaseAdmin
        .from('barbershop_amenities')
        .insert(amenitiesToInsert)
        .select()

      if (error) throw error

      return { success: true, data }
    }

    return {
      success: true,
      data: []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

