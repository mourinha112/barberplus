import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { cardId } = body

    if (!cardId) {
      throw createError({
        statusCode: 400,
        message: 'ID do cartão é obrigatório'
      })
    }

    // Buscar cartão
    const { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select(`
        *,
        program:loyalty_programs(*),
        client:clients(id)
      `)
      .eq('id', cardId)
      .single()

    if (!card) {
      throw createError({
        statusCode: 404,
        message: 'Cartão não encontrado'
      })
    }

    if (!card.is_completed) {
      throw createError({
        statusCode: 400,
        message: 'Cartão ainda não está completo'
      })
    }

    // Atualizar cartão como resgatado
    await supabaseAdmin
      .from('loyalty_cards')
      .update({
        rewards_claimed: card.rewards_claimed + 1
      })
      .eq('id', cardId)

    // Resetar para novo ciclo (criar novo cartão limpo)
    await supabaseAdmin
      .from('loyalty_cards')
      .update({
        stamps_collected: 0,
        is_completed: false,
        completed_at: null
      })
      .eq('id', cardId)

    // Limpar carimbos antigos
    await supabaseAdmin
      .from('loyalty_stamps')
      .delete()
      .eq('card_id', cardId)

    // Atualizar cliente
    await supabaseAdmin
      .from('clients')
      .update({ loyalty_stamps: 0 })
      .eq('id', card.client.id)

    return {
      success: true,
      message: 'Prêmio resgatado com sucesso!',
      data: {
        reward: card.program.reward_description,
        rewardType: card.program.reward_type,
        rewardValue: card.program.reward_value
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

