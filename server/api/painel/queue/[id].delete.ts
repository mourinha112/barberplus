import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do item é obrigatório'
      })
    }

    const { error } = await supabaseAdmin
      .from('queue')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao remover da fila'
      })
    }

    return {
      success: true,
      message: 'Removido da fila com sucesso'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

