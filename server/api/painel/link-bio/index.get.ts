import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { barbershopId } = getQuery(event)

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    if (!isSupabaseConfigured) {
      return {
        success: true,
        data: {
          id: 'demo-linkbio',
          barbershop_id: barbershopId,
          title: 'Sua Barbearia',
          bio: '',
          custom_slug: '',
          links: []
        }
      }
    }

    // Buscar link bio existente
    let { data: linkBio } = await supabaseAdmin
      .from('link_bio')
      .select(`
        *,
        links:link_bio_links(*)
      `)
      .eq('barbershop_id', barbershopId)
      .maybeSingle()

    if (!linkBio) {
      // Buscar dados da barbearia para pré-popular
      const { data: barbershop } = await supabaseAdmin
        .from('barbershops')
        .select('name, slug, logo_url, phone')
        .eq('id', barbershopId)
        .maybeSingle()

      // Criar link bio
      const { data: newLinkBio, error: insertError } = await supabaseAdmin
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

      if (insertError) {
        console.error('Erro ao criar link bio:', insertError)
        throw createError({
          statusCode: 500,
          message: 'Erro ao criar link bio'
        })
      }
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
