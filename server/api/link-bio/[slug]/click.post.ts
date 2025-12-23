import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    const body = await readBody(event)
    const { linkId } = body

    if (!slug || !linkId) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios'
      })
    }

    // Incrementar cliques do link
    const { data: link } = await supabaseAdmin
      .from('link_bio_links')
      .select('clicks')
      .eq('id', linkId)
      .single()

    if (link) {
      await supabaseAdmin
        .from('link_bio_links')
        .update({ clicks: (link.clicks || 0) + 1 })
        .eq('id', linkId)
    }

    // Incrementar cliques totais do bio
    const { data: linkBio } = await supabaseAdmin
      .from('link_bio')
      .select('id, total_clicks')
      .eq('custom_slug', slug)
      .single()

    if (linkBio) {
      await supabaseAdmin
        .from('link_bio')
        .update({ total_clicks: (linkBio.total_clicks || 0) + 1 })
        .eq('id', linkBio.id)
    }

    return {
      success: true
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

