import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do cliente é obrigatório'
      })
    }

    // Buscar cliente com histórico
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !client) {
      throw createError({
        statusCode: 404,
        message: 'Cliente não encontrado'
      })
    }

    // Buscar histórico de cortes
    const { data: history } = await supabaseAdmin
      .from('client_history')
      .select(`
        *,
        professional:professionals(name)
      `)
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Buscar últimos agendamentos
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        professional:professionals(name),
        services:appointment_services(service_name, price)
      `)
      .eq('client_id', id)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })
      .limit(20)

    // Buscar cartão de fidelidade
    const { data: loyaltyCard } = await supabaseAdmin
      .from('loyalty_cards')
      .select(`
        *,
        program:loyalty_programs(name, stamps_required, reward_description)
      `)
      .eq('client_id', id)
      .single()

    return {
      success: true,
      data: {
        ...client,
        history: history || [],
        appointments: appointments || [],
        loyaltyCard
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

