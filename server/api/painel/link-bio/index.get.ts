import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Buscar ou criar link bio
    let { data: linkBio, error } = await supabaseAdmin
      .from('link_bio')
      .select(`
        *,
        links:link_bio_links(*)
      `)
      .eq('barbershop_id', barbershopId)
      .single()

    if (!linkBio) {
      // Buscar dados da barbearia para pré-popular
      const { data: barbershop } = await supabaseAdmin
        .from('barbershops')
        .select('name, slug, logo_url, phone')
        .eq('id', barbershopId)
        .single()

      // Criar link bio
      const { data: newLinkBio, error: createError } = await supabaseAdmin
        .from('link_bio')
        .insert({
          barbershop_id: barbershopId,
          custom_slug: barbershop?.slug,
          title: barbershop?.name,
          avatar_url: barbershop?.logo_url
        })
        .select(`
          *,
          links:link_bio_links(*)
        `)
        .single()

      if (createError) throw createError
      linkBio = newLinkBio
    }

    return {
      success: true,
      data: linkBio
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

