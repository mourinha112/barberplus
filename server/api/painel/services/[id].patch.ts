import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl
    if (body.price !== undefined) updateData.price = body.price
    if (body.promotionalPrice !== undefined) updateData.promotional_price = body.promotionalPrice
    if (body.durationMinutes !== undefined) updateData.duration_minutes = body.durationMinutes
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.isFeatured !== undefined) updateData.is_featured = body.isFeatured
    if (body.requiresDeposit !== undefined) updateData.requires_deposit = body.requiresDeposit
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder

    const { data: service, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar serviço'
      })
    }

    // Atualizar profissionais se fornecidos
    if (body.professionals) {
      await supabaseAdmin
        .from('service_professionals')
        .delete()
        .eq('service_id', id)

      if (body.professionals.length > 0) {
        const professionalRelations = body.professionals.map((professionalId: string) => ({
          service_id: id,
          professional_id: professionalId
        }))

        await supabaseAdmin
          .from('service_professionals')
          .insert(professionalRelations)
      }
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

