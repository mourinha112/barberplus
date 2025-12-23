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

    const { data: program, error } = await supabaseAdmin
      .from('loyalty_programs')
      .select(`
        *,
        reward_service:services(name, price)
      `)
      .eq('barbershop_id', barbershopId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar programa de fidelidade'
      })
    }

    // Estatísticas
    let stats = null
    if (program) {
      const { count: activeCards } = await supabaseAdmin
        .from('loyalty_cards')
        .select('*', { count: 'exact', head: true })
        .eq('program_id', program.id)
        .eq('is_completed', false)

      const { count: completedCards } = await supabaseAdmin
        .from('loyalty_cards')
        .select('*', { count: 'exact', head: true })
        .eq('program_id', program.id)
        .eq('is_completed', true)

      const { count: totalStamps } = await supabaseAdmin
        .from('loyalty_stamps')
        .select('*', { count: 'exact', head: true })
        .eq('card_id', program.id)

      stats = {
        activeCards: activeCards || 0,
        completedCards: completedCards || 0,
        totalStamps: totalStamps || 0
      }
    }

    return {
      success: true,
      data: program,
      stats
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

