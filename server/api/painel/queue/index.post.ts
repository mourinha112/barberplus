import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      clientId,
      professionalId,
      clientName,
      clientPhone,
      services = [],
      estimatedDuration = 30
    } = body

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    if (!clientId && !clientName) {
      throw createError({
        statusCode: 400,
        message: 'Cliente ou nome do cliente é obrigatório'
      })
    }

    // Buscar última posição da fila
    const today = new Date().toISOString().split('T')[0]
    const { data: lastInQueue } = await supabaseAdmin
      .from('queue')
      .select('position')
      .eq('barbershop_id', barbershopId)
      .gte('check_in_at', `${today}T00:00:00`)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const position = (lastInQueue?.position || 0) + 1

    // Adicionar à fila
    const { data: queueItem, error } = await supabaseAdmin
      .from('queue')
      .insert({
        barbershop_id: barbershopId,
        client_id: clientId,
        professional_id: professionalId,
        client_name: clientName,
        client_phone: clientPhone,
        position,
        services,
        estimated_duration: estimatedDuration,
        status: 'waiting'
      })
      .select(`
        *,
        client:clients(id, name, phone, avatar_url),
        professional:professionals(id, name)
      `)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao adicionar à fila'
      })
    }

    return {
      success: true,
      data: queueItem
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

