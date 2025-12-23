import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, enabled } = body

    if (!barbershopId || enabled === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios incompletos'
      })
    }

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .update({ whatsapp_bot_enabled: enabled })
      .eq('id', barbershopId)
      .select('whatsapp_bot_enabled')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar configuração'
      })
    }

    return {
      success: true,
      data: { enabled: barbershop.whatsapp_bot_enabled }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

