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

    // Primeiro buscar apenas campos que sempre existem para validar acesso
    const { data: barbershop, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('id', barbershopId)
      .maybeSingle()

    if (barbershopError) {
      console.error('Erro ao buscar barbearia:', barbershopError)
      throw createError({ statusCode: 500, message: 'Erro ao buscar barbearia' })
    }

    if (!barbershop || barbershop.owner_id !== userId) {
      throw createError({ statusCode: 403, message: 'Acesso negado' })
    }

    const plan = barbershop.subscription_plan || 'free'
    const expiresAt = barbershop.subscription_expires_at || null
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
