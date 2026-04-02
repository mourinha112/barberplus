import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'
import { PLANS, type PlanKey } from '~/server/utils/asaas'

interface SubscriptionInfo {
  plan: PlanKey
  features: readonly string[]
  maxProfessionals: number
  isExpired: boolean
}

/**
 * Busca info de assinatura da barbearia e valida acesso.
 * Retorna os dados do plano ou lança erro 403 se a feature não estiver inclusa.
 */
export async function getSubscriptionInfo(barbershopId: string): Promise<SubscriptionInfo> {
  if (!isSupabaseConfigured) {
    // Modo demo: libera tudo
    return {
      plan: 'pro',
      features: PLANS.pro.features,
      maxProfessionals: PLANS.pro.maxProfessionals,
      isExpired: false,
    }
  }

  const { data: barbershop } = await supabaseAdmin
    .from('barbershops')
    .select('subscription_plan, subscription_expires_at')
    .eq('id', barbershopId)
    .maybeSingle()

  const plan = (barbershop?.subscription_plan || 'free') as PlanKey
  const planInfo = PLANS[plan] || PLANS.free
  const expiresAt = barbershop?.subscription_expires_at
  const isExpired = plan !== 'free' && (!expiresAt || new Date(expiresAt) < new Date())

  // Se expirou, volta a ter features do free
  const effectivePlan = isExpired ? PLANS.free : planInfo

  return {
    plan: isExpired ? 'free' : plan,
    features: effectivePlan.features,
    maxProfessionals: effectivePlan.maxProfessionals,
    isExpired,
  }
}

/**
 * Verifica se a barbearia tem acesso a uma feature específica.
 * Lança createError 403 se não tiver.
 */
export async function requireFeature(barbershopId: string, feature: string): Promise<SubscriptionInfo> {
  const info = await getSubscriptionInfo(barbershopId)

  if (!info.features.includes(feature)) {
    throw createError({
      statusCode: 403,
      message: `Recurso "${feature}" não disponível no plano ${PLANS[info.plan]?.name || info.plan}. Faça upgrade para acessar.`,
    })
  }

  return info
}

/**
 * Verifica se a barbearia pode adicionar mais profissionais.
 * Lança createError 403 se atingiu o limite.
 */
export async function checkProfessionalLimit(barbershopId: string): Promise<void> {
  const info = await getSubscriptionInfo(barbershopId)

  const { count } = await supabaseAdmin
    .from('professionals')
    .select('*', { count: 'exact', head: true })
    .eq('barbershop_id', barbershopId)
    .eq('is_active', true)

  const currentCount = count || 0

  if (currentCount >= info.maxProfessionals) {
    throw createError({
      statusCode: 403,
      message: `Limite de ${info.maxProfessionals} funcionário(s) atingido no plano ${PLANS[info.plan]?.name || info.plan}. Faça upgrade para adicionar mais.`,
    })
  }
}
