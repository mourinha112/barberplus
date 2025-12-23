import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, action, openingAmount, closingAmount, notes } = body

    if (!barbershopId || !action) {
      throw createError({
        statusCode: 400,
        message: 'Ação e ID da barbearia são obrigatórios'
      })
    }

    const today = new Date().toISOString().split('T')[0]

    if (action === 'open') {
      // Abrir caixa
      const { data: existing } = await supabaseAdmin
        .from('cash_register')
        .select('id')
        .eq('barbershop_id', barbershopId)
        .eq('date', today)
        .single()

      if (existing) {
        // Atualizar caixa existente
        const { data: cashRegister, error } = await supabaseAdmin
          .from('cash_register')
          .update({
            opening_amount: openingAmount || 0,
            is_open: true,
            opened_at: new Date().toISOString(),
            notes
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error

        return { success: true, data: cashRegister }
      } else {
        // Criar novo caixa
        const { data: cashRegister, error } = await supabaseAdmin
          .from('cash_register')
          .insert({
            barbershop_id: barbershopId,
            date: today,
            opening_amount: openingAmount || 0,
            is_open: true,
            notes
          })
          .select()
          .single()

        if (error) throw error

        return { success: true, data: cashRegister }
      }
    } else if (action === 'close') {
      // Fechar caixa
      const { data: cashRegister, error } = await supabaseAdmin
        .from('cash_register')
        .update({
          closing_amount: closingAmount,
          is_open: false,
          closed_at: new Date().toISOString(),
          notes
        })
        .eq('barbershop_id', barbershopId)
        .eq('date', today)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: cashRegister }
    }

    throw createError({
      statusCode: 400,
      message: 'Ação inválida'
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

