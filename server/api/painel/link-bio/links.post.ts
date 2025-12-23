import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, title, url, icon, style = 'default' } = body

    if (!barbershopId || !title || !url) {
      throw createError({
        statusCode: 400,
        message: 'Título e URL são obrigatórios'
      })
    }

    // Buscar link_bio
    const { data: linkBio } = await supabaseAdmin
      .from('link_bio')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .single()

    if (!linkBio) {
      throw createError({
        statusCode: 404,
        message: 'Link Bio não encontrado'
      })
    }

    // Buscar última ordem
    const { data: lastLink } = await supabaseAdmin
      .from('link_bio_links')
      .select('sort_order')
      .eq('link_bio_id', linkBio.id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (lastLink?.sort_order || 0) + 1

    const { data: link, error } = await supabaseAdmin
      .from('link_bio_links')
      .insert({
        link_bio_id: linkBio.id,
        title,
        url,
        icon,
        style,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar link'
      })
    }

    return {
      success: true,
      data: link
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

