import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { barbershopId, professionalId, date, duration = 30 } = query

    if (!barbershopId || !professionalId || !date) {
      throw createError({
        statusCode: 400,
        message: 'Parâmetros obrigatórios: barbershopId, professionalId, date'
      })
    }

    // Buscar horários de funcionamento
    const dayOfWeek = getDayOfWeek(date as string)
    
    const { data: workingHours } = await supabaseAdmin
      .from('working_hours')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .eq('day_of_week', dayOfWeek)
      .single()

    if (!workingHours || workingHours.is_closed) {
      return {
        success: true,
        data: [],
        message: 'Fechado neste dia'
      }
    }

    // Buscar horários bloqueados
    const { data: blockedTimes } = await supabaseAdmin
      .from('blocked_times')
      .select('start_datetime, end_datetime')
      .eq('professional_id', professionalId)
      .gte('start_datetime', `${date}T00:00:00`)
      .lte('end_datetime', `${date}T23:59:59`)

    // Buscar agendamentos existentes
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('start_time, end_time')
      .eq('barbershop_id', barbershopId)
      .eq('professional_id', professionalId)
      .eq('date', date)
      .not('status', 'in', '("cancelled","no_show")')

    // Gerar slots disponíveis
    const slots = generateTimeSlots(
      workingHours.open_time,
      workingHours.close_time,
      Number(duration),
      appointments || [],
      blockedTimes || [],
      workingHours.break_start,
      workingHours.break_end,
      date as string
    )

    return {
      success: true,
      data: slots
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00')
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

function generateTimeSlots(
  openTime: string,
  closeTime: string,
  duration: number,
  appointments: any[],
  blockedTimes: any[],
  breakStart?: string,
  breakEnd?: string,
  date?: string
): string[] {
  const slots: string[] = []
  const interval = 30 // Intervalo de 30 minutos

  const openMinutes = timeToMinutes(openTime)
  const closeMinutes = timeToMinutes(closeTime)
  const breakStartMinutes = breakStart ? timeToMinutes(breakStart) : null
  const breakEndMinutes = breakEnd ? timeToMinutes(breakEnd) : null

  // Se for hoje, começar a partir do horário atual + 1 hora
  let startMinutes = openMinutes
  if (date) {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    if (date === today) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + 60 // +1 hora
      startMinutes = Math.max(startMinutes, Math.ceil(currentMinutes / interval) * interval)
    }
  }

  for (let current = startMinutes; current + duration <= closeMinutes; current += interval) {
    const slotStart = current
    const slotEnd = current + duration

    // Verificar intervalo de almoço
    if (breakStartMinutes && breakEndMinutes) {
      if (slotStart < breakEndMinutes && slotEnd > breakStartMinutes) {
        continue
      }
    }

    // Verificar conflito com agendamentos
    const hasConflict = appointments.some(apt => {
      const aptStart = timeToMinutes(apt.start_time)
      const aptEnd = timeToMinutes(apt.end_time)
      return slotStart < aptEnd && slotEnd > aptStart
    })

    if (hasConflict) continue

    // Verificar bloqueios
    const isBlocked = blockedTimes.some(block => {
      const blockStart = new Date(block.start_datetime).getHours() * 60 + new Date(block.start_datetime).getMinutes()
      const blockEnd = new Date(block.end_datetime).getHours() * 60 + new Date(block.end_datetime).getMinutes()
      return slotStart < blockEnd && slotEnd > blockStart
    })

    if (isBlocked) continue

    slots.push(minutesToTime(slotStart))
  }

  return slots
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

