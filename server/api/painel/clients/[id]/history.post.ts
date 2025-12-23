import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const clientId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const {
      appointmentId,
      professionalId,
      servicesPerformed,
      styleDescription,
      photoBeforeUrl,
      photoAfterUrl,
      professionalNotes,
      productsUsed
    } = body

    if (!clientId) {
      throw createError({
        statusCode: 400,
        message: 'ID do cliente é obrigatório'
      })
    }

    // Criar registro de histórico
    const { data: history, error } = await supabaseAdmin
      .from('client_history')
      .insert({
        client_id: clientId,
        appointment_id: appointmentId,
        professional_id: professionalId,
        services_performed: servicesPerformed,
        style_description: styleDescription,
        photo_before_url: photoBeforeUrl,
        photo_after_url: photoAfterUrl,
        professional_notes: professionalNotes,
        products_used: productsUsed
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao adicionar histórico'
      })
    }

    // Atualizar último corte do cliente
    if (photoAfterUrl || styleDescription) {
      await supabaseAdmin
        .from('clients')
        .update({
          last_cut_photo_url: photoAfterUrl,
          last_cut_notes: styleDescription
        })
        .eq('id', clientId)
    }

    return {
      success: true,
      data: history
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

