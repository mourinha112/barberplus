import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID é obrigatório'
      })
    }

    const { error } = await supabaseAdmin
      .from('barbershop_gallery')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao excluir imagem'
      })
    }

    return {
      success: true,
      message: 'Imagem excluída com sucesso'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

