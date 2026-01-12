import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const barbershopId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const updateData: any = {}
    
    // Informações básicas
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.logoUrl !== undefined) updateData.logo_url = body.logoUrl
    if (body.coverUrl !== undefined) updateData.cover_url = body.coverUrl
    
    // Contato
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp
    if (body.website !== undefined) updateData.website = body.website
    
    // Endereço
    if (body.addressStreet !== undefined) updateData.address_street = body.addressStreet
    if (body.addressNumber !== undefined) updateData.address_number = body.addressNumber
    if (body.addressComplement !== undefined) updateData.address_complement = body.addressComplement
    if (body.addressNeighborhood !== undefined) updateData.address_neighborhood = body.addressNeighborhood
    if (body.addressCity !== undefined) updateData.address_city = body.addressCity
    if (body.addressState !== undefined) updateData.address_state = body.addressState
    if (body.addressZip !== undefined) updateData.address_zip = body.addressZip
    if (body.latitude !== undefined) updateData.latitude = body.latitude
    if (body.longitude !== undefined) updateData.longitude = body.longitude
    
    // Anti-Falta
    if (body.antiFaultEnabled !== undefined) updateData.anti_fault_enabled = body.antiFaultEnabled
    if (body.antiFaultDepositAmount !== undefined) updateData.anti_fault_deposit_amount = body.antiFaultDepositAmount
    if (body.antiFaultHoursLimit !== undefined) updateData.anti_fault_hours_limit = body.antiFaultHoursLimit
    
    // Fila Virtual
    if (body.queueEnabled !== undefined) updateData.queue_enabled = body.queueEnabled
    if (body.queueAverageTime !== undefined) updateData.queue_average_time = body.queueAverageTime

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .update(updateData)
      .eq('id', barbershopId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar configurações'
      })
    }

    return {
      success: true,
      data: barbershop
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})
