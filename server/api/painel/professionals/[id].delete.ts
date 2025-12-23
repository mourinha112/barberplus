import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do profissional é obrigatório'
      })
    }

    // Verificar se tem agendamentos futuros
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', id)
      .gte('date', today)
      .not('status', 'in', '("cancelled","completed","no_show")')

    if (count && count > 0) {
      throw createError({
        statusCode: 400,
        message: `Este profissional tem ${count} agendamentos futuros. Cancele-os antes de excluir.`
      })
    }

    // Soft delete - apenas desativar
    const { error } = await supabaseAdmin
      .from('professionals')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao excluir profissional'
      })
    }

    return {
      success: true,
      message: 'Profissional desativado com sucesso'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

