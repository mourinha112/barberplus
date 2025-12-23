import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, paymentStatus, paymentMethod, internalNotes, cancelledReason } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do agendamento é obrigatório'
      })
    }

    // Buscar agendamento atual
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('*, client:clients(id, no_show_count)')
      .eq('id', id)
      .single()

    if (fetchError || !appointment) {
      throw createError({
        statusCode: 404,
        message: 'Agendamento não encontrado'
      })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Atualizar status
    if (status) {
      updateData.status = status

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString()
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString()
        updateData.cancelled_reason = cancelledReason

        // Verificar se precisa estornar depósito
        const { data: deposit } = await supabaseAdmin
          .from('anti_fault_deposits')
          .select('*')
          .eq('appointment_id', id)
          .eq('status', 'paid')
          .single()

        if (deposit) {
          // Marcar como estornado se cancelamento feito a tempo
          await supabaseAdmin
            .from('anti_fault_deposits')
            .update({ 
              status: 'refunded',
              refunded_at: new Date().toISOString()
            })
            .eq('id', deposit.id)
        }
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()

        // Criar transação de receita
        await supabaseAdmin
          .from('transactions')
          .insert({
            barbershop_id: appointment.barbershop_id,
            appointment_id: id,
            professional_id: appointment.professional_id,
            client_id: appointment.client_id,
            type: 'income',
            amount: appointment.final_price,
            description: 'Serviço concluído',
            payment_method: paymentMethod || 'cash',
            transaction_date: new Date().toISOString().split('T')[0]
          })

        // Calcular comissão
        const { data: professional } = await supabaseAdmin
          .from('professionals')
          .select('commission_percentage')
          .eq('id', appointment.professional_id)
          .single()

        if (professional) {
          const commissionAmount = (appointment.final_price * professional.commission_percentage) / 100

          await supabaseAdmin
            .from('commissions')
            .insert({
              barbershop_id: appointment.barbershop_id,
              professional_id: appointment.professional_id,
              appointment_id: id,
              service_total: appointment.final_price,
              commission_percentage: professional.commission_percentage,
              commission_amount: commissionAmount
            })
        }

        // Adicionar carimbo de fidelidade
        const { data: loyaltyProgram } = await supabaseAdmin
          .from('loyalty_programs')
          .select('id')
          .eq('barbershop_id', appointment.barbershop_id)
          .eq('is_active', true)
          .single()

        if (loyaltyProgram && appointment.client_id) {
          // Buscar ou criar cartão de fidelidade
          let { data: card } = await supabaseAdmin
            .from('loyalty_cards')
            .select('id, stamps_collected')
            .eq('program_id', loyaltyProgram.id)
            .eq('client_id', appointment.client_id)
            .single()

          if (!card) {
            const { data: newCard } = await supabaseAdmin
              .from('loyalty_cards')
              .insert({
                program_id: loyaltyProgram.id,
                client_id: appointment.client_id
              })
              .select()
              .single()
            card = newCard
          }

          if (card) {
            // Adicionar carimbo
            await supabaseAdmin
              .from('loyalty_stamps')
              .insert({
                card_id: card.id,
                appointment_id: id
              })

            // Atualizar contador
            await supabaseAdmin
              .from('loyalty_cards')
              .update({ stamps_collected: card.stamps_collected + 1 })
              .eq('id', card.id)
          }
        }
      } else if (status === 'no_show') {
        // Cliente faltou - atualizar contador
        if (appointment.client?.id) {
          await supabaseAdmin
            .from('clients')
            .update({ no_show_count: (appointment.client.no_show_count || 0) + 1 })
            .eq('id', appointment.client.id)

          // Confiscar depósito se houver
          await supabaseAdmin
            .from('anti_fault_deposits')
            .update({ 
              status: 'forfeited',
              forfeited_at: new Date().toISOString()
            })
            .eq('appointment_id', id)
            .eq('status', 'paid')
        }
      }
    }

    // Atualizar pagamento
    if (paymentStatus) {
      updateData.payment_status = paymentStatus
      if (paymentStatus === 'paid') {
        updateData.paid_at = new Date().toISOString()
        updateData.payment_method = paymentMethod
      }
    }

    if (internalNotes !== undefined) {
      updateData.internal_notes = internalNotes
    }

    // Atualizar agendamento
    const { data: updated, error } = await supabaseAdmin
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar agendamento'
      })
    }

    return {
      success: true,
      data: updated
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

