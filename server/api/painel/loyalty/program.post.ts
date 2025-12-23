import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      name = 'Cartão Fidelidade',
      description,
      stampsRequired = 10,
      rewardType = 'free_service',
      rewardValue,
      rewardServiceId,
      rewardDescription,
      stampsExpireDays
    } = body

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Verificar se já existe programa
    const { data: existing } = await supabaseAdmin
      .from('loyalty_programs')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .single()

    if (existing) {
      // Atualizar programa existente
      const { data: program, error } = await supabaseAdmin
        .from('loyalty_programs')
        .update({
          name,
          description,
          stamps_required: stampsRequired,
          reward_type: rewardType,
          reward_value: rewardValue,
          reward_service_id: rewardServiceId,
          reward_description: rewardDescription,
          stamps_expire_days: stampsExpireDays
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: program }
    } else {
      // Criar novo programa
      const { data: program, error } = await supabaseAdmin
        .from('loyalty_programs')
        .insert({
          barbershop_id: barbershopId,
          name,
          description,
          stamps_required: stampsRequired,
          reward_type: rewardType,
          reward_value: rewardValue,
          reward_service_id: rewardServiceId,
          reward_description: rewardDescription,
          stamps_expire_days: stampsExpireDays
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data: program }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

