import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'
import { asaasRequest, isAsaasConfigured, PLANS, type PlanKey } from '~/server/utils/asaas'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.auth || {}
    const body = await readBody(event)
    const { barbershopId, plan, cpfCnpj } = body

    if (!barbershopId || !plan) {
      throw createError({ statusCode: 400, message: 'barbershopId e plan são obrigatórios' })
    }

    if (plan === 'free') {
      throw createError({ statusCode: 400, message: 'Não é necessário assinar o plano gratuito' })
    }

    const planInfo = PLANS[plan as PlanKey]
    if (!planInfo || planInfo.value === 0) {
      throw createError({ statusCode: 400, message: 'Plano inválido' })
    }

    if (!isSupabaseConfigured) {
      throw createError({ statusCode: 500, message: 'Banco de dados não configurado' })
    }

    // Verificar propriedade da barbearia
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

    if (!isAsaasConfigured) {
      // Modo simulação: apenas atualiza o plano no banco
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await supabaseAdmin
        .from('barbershops')
        .update({
          subscription_plan: plan,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('id', barbershopId)

      return {
        success: true,
        data: {
          plan,
          status: 'active',
          currentPeriodEnd: expiresAt.toISOString(),
          invoiceUrl: null,
          message: 'Plano ativado (modo demonstração)',
        }
      }
    }

    // --- Integração real com Asaas ---

    if (!cpfCnpj) {
      throw createError({ statusCode: 400, message: 'CPF/CNPJ é obrigatório para pagamento' })
    }

    // Buscar dados do usuário
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('id', userId)
      .maybeSingle()

    if (!user) {
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    // Criar ou reutilizar cliente no Asaas
    let customerId = barbershop.asaas_customer_id
    if (!customerId) {
      const customer = await asaasRequest('POST', '/customers', {
        name: user.full_name,
        email: user.email,
        cpfCnpj: cpfCnpj.replace(/\D/g, ''),
      })
      customerId = customer.id

      await supabaseAdmin
        .from('barbershops')
        .update({ asaas_customer_id: customerId })
        .eq('id', barbershopId)
    }

    // Cancelar assinatura anterior se existir
    if (barbershop.asaas_subscription_id) {
      try {
        await asaasRequest('DELETE', `/subscriptions/${barbershop.asaas_subscription_id}`)
      } catch (_e) { /* ignora se não existir */ }
    }

    // Criar nova assinatura no Asaas
    const nextDueDate = new Date()
    nextDueDate.setDate(nextDueDate.getDate() + 1)
    const dueDateStr = nextDueDate.toISOString().split('T')[0]

    const asaasSub = await asaasRequest('POST', '/subscriptions', {
      customer: customerId,
      billingType: 'UNDEFINED',
      value: planInfo.value,
      nextDueDate: dueDateStr,
      cycle: 'MONTHLY',
      description: planInfo.description,
      externalReference: barbershopId,
    })

    // Buscar URL de pagamento
    let invoiceUrl: string | null = null
    try {
      const payments = await asaasRequest('GET', `/subscriptions/${asaasSub.id}/payments`)
      if (payments.data?.length > 0) {
        invoiceUrl = payments.data[0].invoiceUrl || null
      }
    } catch (_e) {
      console.error('Erro ao buscar pagamento:', _e)
    }

    // Atualizar barbearia com dados da assinatura
    await supabaseAdmin
      .from('barbershops')
      .update({
        subscription_plan: plan,
        asaas_subscription_id: asaasSub.id,
        asaas_customer_id: customerId,
      })
      .eq('id', barbershopId)

    return {
      success: true,
      data: {
        plan,
        status: 'pending',
        asaasSubscriptionId: asaasSub.id,
        invoiceUrl,
        message: 'Assinatura criada! Complete o pagamento.',
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Erro ao criar assinatura:', error)
    throw createError({ statusCode: 500, message: error.message || 'Erro interno do servidor' })
  }
})
