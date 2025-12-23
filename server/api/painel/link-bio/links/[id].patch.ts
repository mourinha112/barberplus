import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID é obrigatório'
      })
    }

    const updateData: any = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.url !== undefined) updateData.url = body.url
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.style !== undefined) updateData.style = body.style
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder

    const { data: link, error } = await supabaseAdmin
      .from('link_bio_links')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar link'
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

