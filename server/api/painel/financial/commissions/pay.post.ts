import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, professionalId, commissionIds, payAll = false } = body

    if (!barbershopId || !professionalId) {
      throw createError({
        statusCode: 400,
        message: 'IDs obrigatórios'
      })
    }

    let queryBuilder = supabaseAdmin
      .from('commissions')
      .update({
        is_paid: true,
        paid_at: new Date().toISOString()
      })
      .eq('barbershop_id', barbershopId)
      .eq('professional_id', professionalId)
      .eq('is_paid', false)

    if (!payAll && commissionIds?.length) {
      queryBuilder = queryBuilder.in('id', commissionIds)
    }

    const { data: updated, error } = await queryBuilder.select()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao pagar comissões'
      })
    }

    const totalPaid = updated?.reduce((acc, c) => acc + Number(c.commission_amount), 0) || 0

    // Criar transação de saída
    if (totalPaid > 0) {
      const { data: professional } = await supabaseAdmin
        .from('professionals')
        .select('name')
        .eq('id', professionalId)
        .single()

      await supabaseAdmin
        .from('transactions')
        .insert({
          barbershop_id: barbershopId,
          professional_id: professionalId,
          type: 'commission',
          amount: totalPaid,
          description: `Pagamento de comissão - ${professional?.name}`,
          category: 'Comissões',
          transaction_date: new Date().toISOString().split('T')[0]
        })
    }

    return {
      success: true,
      data: {
        paidCount: updated?.length || 0,
        totalPaid
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

