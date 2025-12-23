import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      type,
      amount,
      description,
      category,
      paymentMethod,
      professionalId,
      transactionDate
    } = body

    if (!barbershopId || !type || !amount) {
      throw createError({
        statusCode: 400,
        message: 'Tipo, valor e ID da barbearia são obrigatórios'
      })
    }

    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        barbershop_id: barbershopId,
        type,
        amount,
        description,
        category,
        payment_method: paymentMethod,
        professional_id: professionalId,
        transaction_date: transactionDate || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar transação'
      })
    }

    // Atualizar caixa do dia
    const today = new Date().toISOString().split('T')[0]
    const { data: cashRegister } = await supabaseAdmin
      .from('cash_register')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .eq('date', today)
      .single()

    if (cashRegister) {
      const updateData: any = {}
      
      if (type === 'income') {
        updateData.total_income = (cashRegister.total_income || 0) + amount
        
        switch (paymentMethod) {
          case 'cash':
            updateData.total_cash = (cashRegister.total_cash || 0) + amount
            break
          case 'credit_card':
          case 'debit_card':
            updateData.total_card = (cashRegister.total_card || 0) + amount
            break
          case 'pix':
            updateData.total_pix = (cashRegister.total_pix || 0) + amount
            break
          default:
            updateData.total_other = (cashRegister.total_other || 0) + amount
        }
      } else if (type === 'expense') {
        updateData.total_expense = (cashRegister.total_expense || 0) + amount
      }

      await supabaseAdmin
        .from('cash_register')
        .update(updateData)
        .eq('id', cashRegister.id)
    }

    return {
      success: true,
      data: transaction
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

