import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Slug é obrigatório'
      })
    }

    // Buscar barbearia com todos os relacionamentos
    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .select(`
        *,
        gallery:barbershop_gallery(id, image_url, caption, sort_order),
        amenities:barbershop_amenities(id, name, icon),
        working_hours(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !barbershop) {
      throw createError({
        statusCode: 404,
        message: 'Barbearia não encontrada'
      })
    }

    // Buscar profissionais
    const { data: professionals } = await supabaseAdmin
      .from('professionals')
      .select('*')
      .eq('barbershop_id', barbershop.id)
      .eq('is_active', true)
      .order('sort_order')

    // Buscar serviços
    const { data: services } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('barbershop_id', barbershop.id)
      .eq('is_active', true)
      .order('sort_order')

    // Buscar últimas avaliações
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        client:clients(name, avatar_url),
        professional:professionals(name)
      `)
      .eq('barbershop_id', barbershop.id)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(10)

    // Verificar se está aberto
    const isOpen = checkIfOpen(barbershop.working_hours)

    return {
      success: true,
      data: {
        ...barbershop,
        professionals: professionals || [],
        services: services || [],
        reviews: reviews || [],
        isOpen
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

// Verificar se está aberto
function checkIfOpen(workingHours: any[]): boolean {
  if (!workingHours?.length) return false

  const now = new Date()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[now.getDay()]

  const todayHours = workingHours.find(wh => wh.day_of_week === today)
  if (!todayHours || todayHours.is_closed) return false

  const currentTime = now.toTimeString().slice(0, 5)
  const openTime = todayHours.open_time?.slice(0, 5)
  const closeTime = todayHours.close_time?.slice(0, 5)

  if (!openTime || !closeTime) return false

  // Verificar intervalo
  if (todayHours.break_start && todayHours.break_end) {
    const breakStart = todayHours.break_start.slice(0, 5)
    const breakEnd = todayHours.break_end.slice(0, 5)
    if (currentTime >= breakStart && currentTime < breakEnd) {
      return false
    }
  }

  return currentTime >= openTime && currentTime < closeTime
}

