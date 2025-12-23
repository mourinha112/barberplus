import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId, date } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const targetDate = date || new Date().toISOString().split('T')[0]

    // Buscar ou criar caixa do dia
    let { data: cashRegister, error } = await supabaseAdmin
      .from('cash_register')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .eq('date', targetDate)
      .single()

    if (!cashRegister) {
      // Criar caixa do dia
      const { data: newCashRegister, error: createError } = await supabaseAdmin
        .from('cash_register')
        .insert({
          barbershop_id: barbershopId,
          date: targetDate,
          opening_amount: 0
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      cashRegister = newCashRegister
    }

    // Buscar transações do dia
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        professional:professionals(name),
        client:clients(name)
      `)
      .eq('barbershop_id', barbershopId)
      .eq('transaction_date', targetDate)
      .order('created_at', { ascending: false })

    return {
      success: true,
      data: {
        ...cashRegister,
        transactions: transactions || []
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

