import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'
import { asaasRequest, isAsaasConfigured } from '~/server/utils/asaas'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.auth || {}
    const body = await readBody(event)
    const { barbershopId } = body

    if (!barbershopId) {
      throw createError({ statusCode: 400, message: 'barbershopId é obrigatório' })
    }

    if (!isSupabaseConfigured) {
      throw createError({ statusCode: 500, message: 'Banco de dados não configurado' })
    }

    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('id, owner_id, asaas_subscription_id, subscription_plan')
      .eq('id', barbershopId)
      .maybeSingle()

    if (!barbershop || barbershop.owner_id !== userId) {
      throw createError({ statusCode: 403, message: 'Acesso negado' })
    }

    if (barbershop.subscription_plan === 'free') {
      throw createError({ statusCode: 400, message: 'Você já está no plano gratuito' })
    }

    // Cancelar no Asaas se configurado
    if (isAsaasConfigured && barbershop.asaas_subscription_id) {
      try {
        await asaasRequest('DELETE', `/subscriptions/${barbershop.asaas_subscription_id}`)
      } catch (_e) { /* ignora se já cancelada */ }
    }

    // Voltar para plano free
    await supabaseAdmin
      .from('barbershops')
      .update({
        subscription_plan: 'free',
        asaas_subscription_id: null,
        subscription_expires_at: null,
      })
      .eq('id', barbershopId)

    return {
      success: true,
      message: 'Assinatura cancelada. Você voltou ao plano gratuito.',
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Erro ao cancelar assinatura:', error)
    throw createError({ statusCode: 500, message: 'Erro interno do servidor' })
  }
})
