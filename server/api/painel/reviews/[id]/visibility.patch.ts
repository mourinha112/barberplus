import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { isVisible } = body

    if (!id || isVisible === undefined) {
      throw createError({
        statusCode: 400,
        message: 'ID e visibilidade são obrigatórios'
      })
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .update({ is_visible: isVisible })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar visibilidade'
      })
    }

    return {
      success: true,
      data: review
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

