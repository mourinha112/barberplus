import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, workingHours } = body

    if (!barbershopId || !workingHours) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios incompletos'
      })
    }

    // Remover horários antigos
    await supabaseAdmin
      .from('working_hours')
      .delete()
      .eq('barbershop_id', barbershopId)
      .is('professional_id', null)

    // Inserir novos horários
    const hoursToInsert = workingHours.map((wh: any) => ({
      barbershop_id: barbershopId,
      day_of_week: wh.dayOfWeek,
      open_time: wh.openTime,
      close_time: wh.closeTime,
      break_start: wh.breakStart || null,
      break_end: wh.breakEnd || null,
      is_closed: wh.isClosed || false
    }))

    const { data: hours, error } = await supabaseAdmin
      .from('working_hours')
      .insert(hoursToInsert)
      .select()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao salvar horários'
      })
    }

    return {
      success: true,
      data: hours
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

