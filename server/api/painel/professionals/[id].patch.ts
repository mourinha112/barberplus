import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do profissional é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.nickname !== undefined) updateData.nickname = body.nickname
    if (body.bio !== undefined) updateData.bio = body.bio
    if (body.avatarUrl !== undefined) updateData.avatar_url = body.avatarUrl
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.email !== undefined) updateData.email = body.email
    if (body.commissionPercentage !== undefined) updateData.commission_percentage = body.commissionPercentage
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.acceptsOnlineBooking !== undefined) updateData.accepts_online_booking = body.acceptsOnlineBooking
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder

    const { data: professional, error } = await supabaseAdmin
      .from('professionals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar profissional'
      })
    }

    // Atualizar serviços se fornecidos
    if (body.services) {
      // Remover serviços antigos
      await supabaseAdmin
        .from('service_professionals')
        .delete()
        .eq('professional_id', id)

      // Adicionar novos serviços
      if (body.services.length > 0) {
        const serviceRelations = body.services.map((serviceId: string) => ({
          service_id: serviceId,
          professional_id: id
        }))

        await supabaseAdmin
          .from('service_professionals')
          .insert(serviceRelations)
      }
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

