import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId, status } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const today = new Date().toISOString().split('T')[0]

    let queryBuilder = supabaseAdmin
      .from('queue')
      .select(`
        *,
        client:clients(id, name, phone, avatar_url),
        professional:professionals(id, name, avatar_url)
      `)
      .eq('barbershop_id', barbershopId)
      .gte('check_in_at', `${today}T00:00:00`)

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    } else {
      queryBuilder = queryBuilder.in('status', ['waiting', 'called', 'in_service'])
    }

    queryBuilder = queryBuilder.order('position')

    const { data: queue, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar fila'
      })
    }

    // Calcular tempo de espera estimado
    const queueWithWaitTime = (queue || []).map((item, index) => {
      const waitingBefore = (queue || []).slice(0, index).filter(q => q.status === 'waiting')
      const estimatedWait = waitingBefore.reduce((acc, q) => acc + (q.estimated_duration || 30), 0)
      return {
        ...item,
        estimatedWaitMinutes: estimatedWait
      }
    })

    return {
      success: true,
      data: queueWithWaitTime
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

