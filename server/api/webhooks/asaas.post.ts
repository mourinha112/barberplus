import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { event: asaasEvent, payment, subscription: webhookSub } = body

    console.log('Asaas webhook:', asaasEvent, JSON.stringify(body).substring(0, 500))

    if (!asaasEvent) {
      return { status: 400, message: 'Event missing' }
    }

    if (!isSupabaseConfigured) {
      return { received: true }
    }

    // Pagamento confirmado -> ativar assinatura
    if (asaasEvent === 'PAYMENT_CONFIRMED' || asaasEvent === 'PAYMENT_RECEIVED') {
      const subId = payment?.subscription
      if (subId) {
        const periodEnd = new Date()
        periodEnd.setDate(periodEnd.getDate() + 30)

        await supabaseAdmin
          .from('barbershops')
          .update({
            subscription_expires_at: periodEnd.toISOString(),
          })
          .eq('asaas_subscription_id', subId)

        console.log(`Assinatura ${subId} ativada via pagamento`)
      }
    }

    // Pagamento atrasado
    if (asaasEvent === 'PAYMENT_OVERDUE') {
      const subId = payment?.subscription
      if (subId) {
        console.log(`Assinatura ${subId} com pagamento atrasado`)
      }
    }

    // Assinatura cancelada
    if (asaasEvent === 'SUBSCRIPTION_DELETED' || asaasEvent === 'SUBSCRIPTION_INACTIVATED') {
      const asaasSubId = webhookSub?.id || payment?.subscription
      if (asaasSubId) {
        await supabaseAdmin
          .from('barbershops')
          .update({
            subscription_plan: 'free',
            asaas_subscription_id: null,
            subscription_expires_at: null,
          })
          .eq('asaas_subscription_id', asaasSubId)

        console.log(`Assinatura ${asaasSubId} cancelada via webhook`)
      }
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return { status: 500, message: 'Webhook error' }
  }
})
