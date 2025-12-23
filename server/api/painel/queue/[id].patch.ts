import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, professionalId } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do item é obrigatório'
      })
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status

      switch (status) {
        case 'called':
          updateData.called_at = new Date().toISOString()
          break
        case 'in_service':
          updateData.started_at = new Date().toISOString()
          break
        case 'completed':
          updateData.completed_at = new Date().toISOString()
          break
      }
    }

    if (professionalId) {
      updateData.professional_id = professionalId
    }

    const { data: queueItem, error } = await supabaseAdmin
      .from('queue')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, name, phone),
        professional:professionals(id, name)
      `)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao atualizar fila'
      })
    }

    return {
      success: true,
      data: queueItem
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

