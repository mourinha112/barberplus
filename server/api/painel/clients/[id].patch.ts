import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do cliente é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.email !== undefined) updateData.email = body.email
    if (body.avatarUrl !== undefined) updateData.avatar_url = body.avatarUrl
    if (body.birthDate !== undefined) updateData.birth_date = body.birthDate
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.preferredStyle !== undefined) updateData.preferred_style = body.preferredStyle
    if (body.lastCutPhotoUrl !== undefined) updateData.last_cut_photo_url = body.lastCutPhotoUrl
    if (body.lastCutNotes !== undefined) updateData.last_cut_notes = body.lastCutNotes
    if (body.hairType !== undefined) updateData.hair_type = body.hairType
    if (body.beardStyle !== undefined) updateData.beard_style = body.beardStyle
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.isBlocked !== undefined) updateData.is_blocked = body.isBlocked

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar cliente'
      })
    }

    return {
      success: true,
      data: client
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

