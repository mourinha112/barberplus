import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, ...updateFields } = body

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (updateFields.customSlug !== undefined) {
      // Verificar se slug já existe
      const { data: existing } = await supabaseAdmin
        .from('link_bio')
        .select('id')
        .eq('custom_slug', updateFields.customSlug)
        .neq('barbershop_id', barbershopId)
        .single()

      if (existing) {
        throw createError({
          statusCode: 400,
          message: 'Este link já está em uso'
        })
      }
      updateData.custom_slug = updateFields.customSlug
    }
    
    if (updateFields.theme !== undefined) updateData.theme = updateFields.theme
    if (updateFields.primaryColor !== undefined) updateData.primary_color = updateFields.primaryColor
    if (updateFields.backgroundType !== undefined) updateData.background_type = updateFields.backgroundType
    if (updateFields.backgroundValue !== undefined) updateData.background_value = updateFields.backgroundValue
    if (updateFields.title !== undefined) updateData.title = updateFields.title
    if (updateFields.bio !== undefined) updateData.bio = updateFields.bio
    if (updateFields.avatarUrl !== undefined) updateData.avatar_url = updateFields.avatarUrl
    if (updateFields.instagramUrl !== undefined) updateData.instagram_url = updateFields.instagramUrl
    if (updateFields.facebookUrl !== undefined) updateData.facebook_url = updateFields.facebookUrl
    if (updateFields.tiktokUrl !== undefined) updateData.tiktok_url = updateFields.tiktokUrl
    if (updateFields.youtubeUrl !== undefined) updateData.youtube_url = updateFields.youtubeUrl

    const { data: linkBio, error } = await supabaseAdmin
      .from('link_bio')
      .update(updateData)
      .eq('barbershop_id', barbershopId)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar link bio'
      })
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

