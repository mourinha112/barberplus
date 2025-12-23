import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId } = getQuery(event)
    const { userId } = event.context.auth || {}

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Verificar se o usuário tem acesso à barbearia
    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('id, owner_id')
      .eq('id', barbershopId)
      .single()

    if (!barbershop || barbershop.owner_id !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

    // Agendamentos de hoje
    const { count: todayAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .eq('date', today)
      .not('status', 'eq', 'cancelled')

    // Faturamento do mês
    const { data: monthRevenue } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'income')
      .gte('transaction_date', startOfMonth)

    const totalMonthRevenue = monthRevenue?.reduce((acc, t) => acc + Number(t.amount), 0) || 0

    // Faturamento de hoje
    const { data: todayRevenue } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'income')
      .eq('transaction_date', today)

    const totalTodayRevenue = todayRevenue?.reduce((acc, t) => acc + Number(t.amount), 0) || 0

    // Total de clientes
    const { count: totalClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)

    // Novos clientes do mês
    const { count: newClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .gte('created_at', startOfMonth)

    // Fila atual
    const { count: queueCount } = await supabaseAdmin
      .from('queue')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .eq('status', 'waiting')

    // Avaliação média
    const { data: barbershopData } = await supabaseAdmin
      .from('barbershops')
      .select('rating_average, rating_count')
      .eq('id', barbershopId)
      .single()

    // Próximos agendamentos
    const { data: nextAppointments } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        client:clients(name, phone, avatar_url),
        professional:professionals(name),
        services:appointment_services(service_name, price)
      `)
      .eq('barbershop_id', barbershopId)
      .eq('date', today)
      .in('status', ['pending', 'confirmed'])
      .order('start_time')
      .limit(5)

    // Gráfico de faturamento (últimos 7 dias)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      last7Days.push(date.toISOString().split('T')[0])
    }

    const { data: revenueChart } = await supabaseAdmin
      .from('transactions')
      .select('amount, transaction_date')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'income')
      .in('transaction_date', last7Days)

    const chartData = last7Days.map(date => ({
      date,
      revenue: revenueChart
        ?.filter(t => t.transaction_date === date)
        .reduce((acc, t) => acc + Number(t.amount), 0) || 0
    }))

    return {
      success: true,
      data: {
        todayAppointments: todayAppointments || 0,
        todayRevenue: totalTodayRevenue,
        monthRevenue: totalMonthRevenue,
        totalClients: totalClients || 0,
        newClients: newClients || 0,
        queueCount: queueCount || 0,
        rating: barbershopData?.rating_average || 0,
        ratingCount: barbershopData?.rating_count || 0,
        nextAppointments: nextAppointments || [],
        revenueChart: chartData
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

