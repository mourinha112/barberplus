import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { barbershopId, startDate, endDate } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const start = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    const end = endDate || today

    // Receitas
    const { data: incomes } = await supabaseAdmin
      .from('transactions')
      .select('amount, payment_method')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'income')
      .gte('transaction_date', start)
      .lte('transaction_date', end)

    const totalIncome = incomes?.reduce((acc, t) => acc + Number(t.amount), 0) || 0
    const incomeByCash = incomes?.filter(t => t.payment_method === 'cash').reduce((acc, t) => acc + Number(t.amount), 0) || 0
    const incomeByCard = incomes?.filter(t => ['credit_card', 'debit_card'].includes(t.payment_method)).reduce((acc, t) => acc + Number(t.amount), 0) || 0
    const incomeByPix = incomes?.filter(t => t.payment_method === 'pix').reduce((acc, t) => acc + Number(t.amount), 0) || 0

    // Despesas
    const { data: expenses } = await supabaseAdmin
      .from('transactions')
      .select('amount, category')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'expense')
      .gte('transaction_date', start)
      .lte('transaction_date', end)

    const totalExpense = expenses?.reduce((acc, t) => acc + Number(t.amount), 0) || 0

    // Despesas por categoria
    const expenseByCategory: Record<string, number> = {}
    expenses?.forEach(t => {
      const cat = t.category || 'Outros'
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(t.amount)
    })

    // Comissões
    const { data: commissions } = await supabaseAdmin
      .from('commissions')
      .select('commission_amount, is_paid')
      .eq('barbershop_id', barbershopId)
      .gte('created_at', `${start}T00:00:00`)
      .lte('created_at', `${end}T23:59:59`)

    const totalCommissions = commissions?.reduce((acc, c) => acc + Number(c.commission_amount), 0) || 0
    const pendingCommissions = commissions?.filter(c => !c.is_paid).reduce((acc, c) => acc + Number(c.commission_amount), 0) || 0

    // Agendamentos completados
    const { count: completedAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .eq('status', 'completed')
      .gte('date', start)
      .lte('date', end)

    // Ticket médio
    const averageTicket = completedAppointments ? totalIncome / completedAppointments : 0

    // Lucro líquido
    const netProfit = totalIncome - totalExpense - totalCommissions

    return {
      success: true,
      data: {
        period: { start, end },
        income: {
          total: totalIncome,
          cash: incomeByCash,
          card: incomeByCard,
          pix: incomeByPix
        },
        expense: {
          total: totalExpense,
          byCategory: expenseByCategory
        },
        commissions: {
          total: totalCommissions,
          pending: pendingCommissions
        },
        appointments: completedAppointments || 0,
        averageTicket: Math.round(averageTicket * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

