import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      name,
      phone,
      email,
      birthDate,
      notes,
      preferredStyle,
      hairType,
      beardStyle,
      tags
    } = body

    if (!barbershopId || !name) {
      throw createError({
        statusCode: 400,
        message: 'Nome e ID da barbearia são obrigatórios'
      })
    }

    // Verificar se já existe cliente com mesmo telefone
    if (phone) {
      const { data: existing } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('barbershop_id', barbershopId)
        .eq('phone', phone)
        .single()

      if (existing) {
        throw createError({
          statusCode: 400,
          message: 'Já existe um cliente com este telefone'
        })
      }
    }

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .insert({
        barbershop_id: barbershopId,
        name,
        phone,
        email,
        birth_date: birthDate,
        notes,
        preferred_style: preferredStyle,
        hair_type: hairType,
        beard_style: beardStyle,
        tags
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar cliente'
      })
    }

    return {
      success: true,
      data: client
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

