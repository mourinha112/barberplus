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

    const { data: linkBio, error } = await supabaseAdmin
      .from('link_bio')
      .select(`
        *,
        links:link_bio_links(*)
      `)
      .eq('custom_slug', slug)
      .single()

    if (error || !linkBio) {
      throw createError({
        statusCode: 404,
        message: 'Link Bio não encontrado'
      })
    }

    // Incrementar views
    await supabaseAdmin
      .from('link_bio')
      .update({ total_views: (linkBio.total_views || 0) + 1 })
      .eq('id', linkBio.id)

    // Ordenar links ativos
    const activeLinks = (linkBio.links || [])
      .filter((l: any) => l.is_active)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)

    return {
      success: true,
      data: {
        ...linkBio,
        links: activeLinks
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

