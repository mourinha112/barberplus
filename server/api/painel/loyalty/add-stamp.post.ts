import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, clientId, appointmentId } = body

    if (!barbershopId || !clientId) {
      throw createError({
        statusCode: 400,
        message: 'IDs obrigatórios'
      })
    }

    // Buscar programa
    const { data: program } = await supabaseAdmin
      .from('loyalty_programs')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)
      .single()

    if (!program) {
      throw createError({
        statusCode: 404,
        message: 'Programa de fidelidade não encontrado ou inativo'
      })
    }

    // Buscar ou criar cartão
    let { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('*')
      .eq('program_id', program.id)
      .eq('client_id', clientId)
      .single()

    if (!card) {
      const { data: newCard } = await supabaseAdmin
        .from('loyalty_cards')
        .insert({
          program_id: program.id,
          client_id: clientId
        })
        .select()
        .single()
      card = newCard
    }

    if (!card) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar cartão'
      })
    }

    // Verificar se cartão já está completo
    if (card.is_completed) {
      throw createError({
        statusCode: 400,
        message: 'Cartão já completado. Resgate o prêmio antes de adicionar mais carimbos.'
      })
    }

    // Adicionar carimbo
    const { error: stampError } = await supabaseAdmin
      .from('loyalty_stamps')
      .insert({
        card_id: card.id,
        appointment_id: appointmentId,
        expires_at: program.stamps_expire_days 
          ? new Date(Date.now() + program.stamps_expire_days * 24 * 60 * 60 * 1000).toISOString()
          : null
      })

    if (stampError) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao adicionar carimbo'
      })
    }

    // Atualizar contador
    const newStampCount = card.stamps_collected + 1
    const isCompleted = newStampCount >= program.stamps_required

    const { data: updatedCard } = await supabaseAdmin
      .from('loyalty_cards')
      .update({
        stamps_collected: newStampCount,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      })
      .eq('id', card.id)
      .select()
      .single()

    // Atualizar cliente
    await supabaseAdmin
      .from('clients')
      .update({ loyalty_stamps: newStampCount })
      .eq('id', clientId)

    return {
      success: true,
      data: {
        card: updatedCard,
        stampsCollected: newStampCount,
        stampsRequired: program.stamps_required,
        isCompleted,
        reward: isCompleted ? program.reward_description : null
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

