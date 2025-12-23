import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, ...updateFields } = body

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const updateData: any = {}
    
    // Informações básicas
    if (updateFields.name !== undefined) updateData.name = updateFields.name
    if (updateFields.description !== undefined) updateData.description = updateFields.description
    if (updateFields.logoUrl !== undefined) updateData.logo_url = updateFields.logoUrl
    if (updateFields.coverUrl !== undefined) updateData.cover_url = updateFields.coverUrl
    
    // Contato
    if (updateFields.email !== undefined) updateData.email = updateFields.email
    if (updateFields.phone !== undefined) updateData.phone = updateFields.phone
    if (updateFields.whatsapp !== undefined) updateData.whatsapp = updateFields.whatsapp
    if (updateFields.website !== undefined) updateData.website = updateFields.website
    
    // Endereço
    if (updateFields.addressStreet !== undefined) updateData.address_street = updateFields.addressStreet
    if (updateFields.addressNumber !== undefined) updateData.address_number = updateFields.addressNumber
    if (updateFields.addressComplement !== undefined) updateData.address_complement = updateFields.addressComplement
    if (updateFields.addressNeighborhood !== undefined) updateData.address_neighborhood = updateFields.addressNeighborhood
    if (updateFields.addressCity !== undefined) updateData.address_city = updateFields.addressCity
    if (updateFields.addressState !== undefined) updateData.address_state = updateFields.addressState
    if (updateFields.addressZip !== undefined) updateData.address_zip = updateFields.addressZip
    if (updateFields.latitude !== undefined) updateData.latitude = updateFields.latitude
    if (updateFields.longitude !== undefined) updateData.longitude = updateFields.longitude
    
    // Anti-Falta
    if (updateFields.antiFaultEnabled !== undefined) updateData.anti_fault_enabled = updateFields.antiFaultEnabled
    if (updateFields.antiFaultDepositAmount !== undefined) updateData.anti_fault_deposit_amount = updateFields.antiFaultDepositAmount
    if (updateFields.antiFaultHoursLimit !== undefined) updateData.anti_fault_hours_limit = updateFields.antiFaultHoursLimit
    
    // Fila Virtual
    if (updateFields.queueEnabled !== undefined) updateData.queue_enabled = updateFields.queueEnabled
    if (updateFields.queueAverageTime !== undefined) updateData.queue_average_time = updateFields.queueAverageTime

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .update(updateData)
      .eq('id', barbershopId)
      .select()
      .single()

    if (error) {
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

