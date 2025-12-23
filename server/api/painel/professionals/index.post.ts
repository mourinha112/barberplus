import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      name,
      nickname,
      bio,
      avatarUrl,
      phone,
      email,
      commissionPercentage = 50,
      services = []
    } = body

    if (!barbershopId || !name) {
      throw createError({
        statusCode: 400,
        message: 'Nome e ID da barbearia são obrigatórios'
      })
    }

    // Buscar maior sort_order
    const { data: lastProfessional } = await supabaseAdmin
      .from('professionals')
      .select('sort_order')
      .eq('barbershop_id', barbershopId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (lastProfessional?.sort_order || 0) + 1

    // Criar profissional
    const { data: professional, error } = await supabaseAdmin
      .from('professionals')
      .insert({
        barbershop_id: barbershopId,
        name,
        nickname,
        bio,
        avatar_url: avatarUrl,
        phone,
        email,
        commission_percentage: commissionPercentage,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar profissional'
      })
    }

    // Associar serviços
    if (services.length > 0) {
      const serviceRelations = services.map((serviceId: string) => ({
        service_id: serviceId,
        professional_id: professional.id
      }))

      await supabaseAdmin
        .from('service_professionals')
        .insert(serviceRelations)
    }

    return {
      success: true,
      data: professional
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

