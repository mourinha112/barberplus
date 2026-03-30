import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'
import { PLANS } from '~/server/utils/asaas'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId } = getQuery(event)
    const { userId } = event.context.auth || {}

    if (!barbershopId) {
      throw createError({ statusCode: 400, message: 'ID da barbearia é obrigatório' })
    }

    if (!isSupabaseConfigured) {
      return {
        success: true,
        data: {
          plan: 'free',
          status: 'active',
          trialEndsAt: null,
          currentPeriodEnd: null,
        }
      }
    }

    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('id, owner_id, subscription_plan, subscription_expires_at, asaas_customer_id, asaas_subscription_id')
      .eq('id', barbershopId)
      .maybeSingle()

    if (!barbershop || barbershop.owner_id !== userId) {
      throw createError({ statusCode: 403, message: 'Acesso negado' })
    }

    const plan = barbershop.subscription_plan || 'free'
    const expiresAt = barbershop.subscription_expires_at
    const isExpired = expiresAt && new Date(expiresAt) < new Date()

    return {
      success: true,
      data: {
        plan,
        status: plan === 'free' ? 'active' : (isExpired ? 'expired' : 'active'),
        currentPeriodEnd: expiresAt,
        asaasSubscriptionId: barbershop.asaas_subscription_id || null,
        planDetails: PLANS[plan as keyof typeof PLANS] || PLANS.free,
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Erro ao buscar assinatura:', error)
    throw createError({ statusCode: 500, message: 'Erro interno do servidor' })
  }
})
