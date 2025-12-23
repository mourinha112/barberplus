import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      name,
      description,
      category,
      imageUrl,
      price,
      promotionalPrice,
      durationMinutes = 30,
      isFeatured = false,
      requiresDeposit = false,
      professionals = []
    } = body

    if (!barbershopId || !name || !price) {
      throw createError({
        statusCode: 400,
        message: 'Nome, preço e ID da barbearia são obrigatórios'
      })
    }

    // Buscar maior sort_order
    const { data: lastService } = await supabaseAdmin
      .from('services')
      .select('sort_order')
      .eq('barbershop_id', barbershopId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (lastService?.sort_order || 0) + 1

    // Criar serviço
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .insert({
        barbershop_id: barbershopId,
        name,
        description,
        category,
        image_url: imageUrl,
        price,
        promotional_price: promotionalPrice,
        duration_minutes: durationMinutes,
        is_featured: isFeatured,
        requires_deposit: requiresDeposit,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar serviço'
      })
    }

    // Associar profissionais
    if (professionals.length > 0) {
      const professionalRelations = professionals.map((professionalId: string) => ({
        service_id: service.id,
        professional_id: professionalId
      }))

      await supabaseAdmin
        .from('service_professionals')
        .insert(professionalRelations)
    }

    return {
      success: true,
      data: service
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

