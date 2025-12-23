import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      name,
      triggerType,
      delayMinutes = 0,
      sendTime,
      messageTemplate,
      isActive = true
    } = body

    if (!barbershopId || !name || !triggerType || !messageTemplate) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios incompletos'
      })
    }

    // Verificar se já existe automação para esse trigger
    const { data: existing } = await supabaseAdmin
      .from('whatsapp_automations')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('trigger_type', triggerType)
      .single()

    if (existing) {
      // Atualizar existente
      const { data: automation, error } = await supabaseAdmin
        .from('whatsapp_automations')
        .update({
          name,
          delay_minutes: delayMinutes,
          send_time: sendTime,
          message_template: messageTemplate,
          is_active: isActive
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data: automation }
    }

    // Criar nova automação
    const { data: automation, error } = await supabaseAdmin
      .from('whatsapp_automations')
      .insert({
        barbershop_id: barbershopId,
        name,
        trigger_type: triggerType,
        delay_minutes: delayMinutes,
        send_time: sendTime,
        message_template: messageTemplate,
        is_active: isActive
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: automation
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

