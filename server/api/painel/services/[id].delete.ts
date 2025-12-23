import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from('services')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao excluir serviço'
      })
    }

    return {
      success: true,
      message: 'Serviço desativado com sucesso'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

