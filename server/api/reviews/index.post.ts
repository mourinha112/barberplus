import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      professionalId,
      appointmentId,
      rating,
      comment,
      userId
    } = body

    if (!barbershopId || !rating) {
      throw createError({
        statusCode: 400,
        message: 'Barbearia e nota são obrigatórios'
      })
    }

    if (rating < 1 || rating > 5) {
      throw createError({
        statusCode: 400,
        message: 'Nota deve ser entre 1 e 5'
      })
    }

    // Buscar cliente
    let clientId = null
    if (userId) {
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('barbershop_id', barbershopId)
        .eq('user_id', userId)
        .single()

      clientId = client?.id
    }

    // Verificar se já avaliou este agendamento
    if (appointmentId) {
      const { data: existingReview } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('appointment_id', appointmentId)
        .single()

      if (existingReview) {
        throw createError({
          statusCode: 400,
          message: 'Este agendamento já foi avaliado'
        })
      }
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        barbershop_id: barbershopId,
        professional_id: professionalId,
        client_id: clientId,
        appointment_id: appointmentId,
        rating,
        comment,
        is_verified: !!appointmentId
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar avaliação'
      })
    }

    return {
      success: true,
      data: review
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

