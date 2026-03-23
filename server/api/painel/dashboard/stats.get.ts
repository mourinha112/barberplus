import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

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

    // Modo demo ou Supabase não configurado
    if (!isSupabaseConfigured || (typeof barbershopId === 'string' && barbershopId.startsWith('demo-'))) {
      return {
        success: true,
        data: {
          todayAppointments: 0,
          totalAppointments: 0,
          completedAppointments: 0,
          todayRevenue: 0,
          monthRevenue: 0,
          totalClients: 0,
          totalServices: 0,
          newClients: 0,
          queueCount: 0,
          rating: 0,
          ratingCount: 0,
          nextAppointments: [],
          revenueChart: []
        }
      }
    }

    // Verificar se o usuário tem acesso à barbearia
    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('id, owner_id')
      .eq('id', barbershopId)
      .maybeSingle()

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

    // Agendamentos completados hoje
    const { count: completedAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .eq('date', today)
      .eq('status', 'completed')

    // Faturamento de hoje
    const { data: todayRevenueData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('barbershop_id', barbershopId)
      .eq('type', 'income')
      .eq('transaction_date', today)

    const totalTodayRevenue = todayRevenueData?.reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0

    // Total de clientes
    const { count: totalClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)

    // Total de serviços ativos
    const { count: totalServices } = await supabaseAdmin
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)

    return {
      success: true,
      data: {
        todayAppointments: todayAppointments || 0,
        totalAppointments: todayAppointments || 0,
        completedAppointments: completedAppointments || 0,
        todayRevenue: totalTodayRevenue,
        totalClients: totalClients || 0,
        totalServices: totalServices || 0
      }
    }
  } catch (error: any) {
    // Se for erro de tabela não encontrada, retorna dados zerados
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      return {
        success: true,
        data: {
          todayAppointments: 0,
          totalAppointments: 0,
          completedAppointments: 0,
          todayRevenue: 0,
          totalClients: 0,
          totalServices: 0
        }
      }
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})
