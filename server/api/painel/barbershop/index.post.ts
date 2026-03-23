import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth

  if (!auth?.userId) {
    throw createError({
      statusCode: 401,
      message: 'Não autorizado'
    })
  }

  const body = await readBody(event)
  const { name, slug } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Nome da barbearia é obrigatório'
    })
  }

  // Gerar slug se não fornecido
  const finalSlug = slug || name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (!isSupabaseConfigured) {
    return {
      success: true,
      data: {
        id: 'demo-' + Date.now(),
        name,
        slug: finalSlug,
        owner_id: auth.userId,
        created_at: new Date().toISOString()
      },
      demo: true
    }
  }

  try {
    // Verificar se slug já existe
    const { data: existing } = await supabaseAdmin
      .from('barbershops')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle()

    if (existing) {
      throw createError({
        statusCode: 400,
        message: 'Este slug já está em uso. Escolha outro nome.'
      })
    }

    // Criar barbearia
    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .insert({
        name,
        slug: finalSlug,
        owner_id: auth.userId,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar barbearia:', error)
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        throw createError({
          statusCode: 500,
          message: 'Tabela de barbearias não encontrada. Execute o schema SQL no Supabase.'
        })
      }
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar barbearia: ' + error.message
      })
    }

    return {
      success: true,
      data: barbershop
    }
  } catch (error: any) {
    if (error.statusCode && typeof error.statusCode === 'number') {
      throw error
    }
    console.error('Erro ao criar barbearia:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})
