import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.delayMinutes !== undefined) updateData.delay_minutes = body.delayMinutes
    if (body.sendTime !== undefined) updateData.send_time = body.sendTime
    if (body.messageTemplate !== undefined) updateData.message_template = body.messageTemplate
    if (body.isActive !== undefined) updateData.is_active = body.isActive

    const { data: automation, error } = await supabaseAdmin
      .from('whatsapp_automations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar automação'
      })
    }

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

