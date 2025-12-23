import { supabaseAdmin, getPagination } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      barbershopId,
      professionalId,
      isPaid,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = query

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const { from, to } = getPagination(Number(page), Number(limit))

    let queryBuilder = supabaseAdmin
      .from('commissions')
      .select(`
        *,
        professional:professionals(id, name, avatar_url),
        appointment:appointments(date, start_time)
      `, { count: 'exact' })
      .eq('barbershop_id', barbershopId)

    if (professionalId) {
      queryBuilder = queryBuilder.eq('professional_id', professionalId)
    }

    if (isPaid !== undefined) {
      queryBuilder = queryBuilder.eq('is_paid', isPaid === 'true')
    }

    if (startDate) {
      queryBuilder = queryBuilder.gte('created_at', `${startDate}T00:00:00`)
    }

    if (endDate) {
      queryBuilder = queryBuilder.lte('created_at', `${endDate}T23:59:59`)
    }

    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data: commissions, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar comissões'
      })
    }

    // Resumo por profissional
    const { data: summary } = await supabaseAdmin
      .from('commissions')
      .select('professional_id, commission_amount, is_paid')
      .eq('barbershop_id', barbershopId)

    const summaryByProfessional: Record<string, { total: number, pending: number, paid: number }> = {}
    summary?.forEach(c => {
      if (!summaryByProfessional[c.professional_id]) {
        summaryByProfessional[c.professional_id] = { total: 0, pending: 0, paid: 0 }
      }
      summaryByProfessional[c.professional_id].total += Number(c.commission_amount)
      if (c.is_paid) {
        summaryByProfessional[c.professional_id].paid += Number(c.commission_amount)
      } else {
        summaryByProfessional[c.professional_id].pending += Number(c.commission_amount)
      }
    })

    return {
      success: true,
      data: commissions || [],
      summaryByProfessional,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

