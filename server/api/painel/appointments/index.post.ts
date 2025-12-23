import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      barbershopId,
      clientId,
      professionalId,
      date,
      startTime,
      services,
      clientNotes,
      isRepeatLastCut = false
    } = body

    if (!barbershopId || !professionalId || !date || !startTime || !services?.length) {
      throw createError({
        statusCode: 400,
        message: 'Dados incompletos para criar agendamento'
      })
    }

    // Calcular duração total e preço
    const { data: serviceDetails } = await supabaseAdmin
      .from('services')
      .select('id, name, price, promotional_price, duration_minutes')
      .in('id', services)

    if (!serviceDetails?.length) {
      throw createError({
        statusCode: 400,
        message: 'Serviços não encontrados'
      })
    }

    const totalDuration = serviceDetails.reduce((acc, s) => acc + s.duration_minutes, 0)
    const totalPrice = serviceDetails.reduce((acc, s) => acc + Number(s.promotional_price || s.price), 0)

    // Calcular horário de término
    const [hours, minutes] = startTime.split(':').map(Number)
    const startMinutes = hours * 60 + minutes
    const endMinutes = startMinutes + totalDuration
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    // Verificar disponibilidade
    const { data: conflicts } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('professional_id', professionalId)
      .eq('date', date)
      .not('status', 'in', '("cancelled","no_show")')
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`)

    if (conflicts?.length) {
      throw createError({
        statusCode: 409,
        message: 'Horário não disponível'
      })
    }

    // Verificar se precisa de depósito (anti-falta)
    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('anti_fault_enabled, anti_fault_deposit_amount')
      .eq('id', barbershopId)
      .single()

    const depositAmount = barbershop?.anti_fault_enabled ? barbershop.anti_fault_deposit_amount : 0

    // Criar agendamento
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        barbershop_id: barbershopId,
        client_id: clientId,
        professional_id: professionalId,
        date,
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        final_price: totalPrice,
        deposit_amount: depositAmount,
        client_notes: clientNotes,
        is_repeat_last_cut: isRepeatLastCut,
        status: depositAmount > 0 ? 'pending' : 'confirmed'
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar agendamento'
      })
    }

    // Inserir serviços do agendamento
    const appointmentServices = serviceDetails.map(s => ({
      appointment_id: appointment.id,
      service_id: s.id,
      service_name: s.name,
      price: Number(s.promotional_price || s.price),
      duration_minutes: s.duration_minutes
    }))

    await supabaseAdmin
      .from('appointment_services')
      .insert(appointmentServices)

    // Se precisa de depósito, criar registro
    if (depositAmount > 0) {
      await supabaseAdmin
        .from('anti_fault_deposits')
        .insert({
          barbershop_id: barbershopId,
          appointment_id: appointment.id,
          client_id: clientId,
          amount: depositAmount,
          status: 'pending'
        })
    }

    return {
      success: true,
      data: appointment,
      requiresDeposit: depositAmount > 0,
      depositAmount
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

