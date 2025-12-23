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

    const { data: automations, error } = await supabaseAdmin
      .from('whatsapp_automations')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('trigger_type')

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar automações'
      })
    }

    // Buscar status do bot
    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('whatsapp_bot_enabled, whatsapp_instance_id')
      .eq('id', barbershopId)
      .single()

    return {
      success: true,
      data: automations || [],
      botEnabled: barbershop?.whatsapp_bot_enabled || false,
      instanceConnected: !!barbershop?.whatsapp_instance_id
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

