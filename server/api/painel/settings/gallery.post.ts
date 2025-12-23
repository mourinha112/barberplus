import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, imageUrl, caption } = body

    if (!barbershopId || !imageUrl) {
      throw createError({
        statusCode: 400,
        message: 'URL da imagem é obrigatória'
      })
    }

    // Buscar última ordem
    const { data: lastImage } = await supabaseAdmin
      .from('barbershop_gallery')
      .select('sort_order')
      .eq('barbershop_id', barbershopId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (lastImage?.sort_order || 0) + 1

    const { data: image, error } = await supabaseAdmin
      .from('barbershop_gallery')
      .insert({
        barbershop_id: barbershopId,
        image_url: imageUrl,
        caption,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao adicionar imagem'
      })
    }

    return {
      success: true,
      data: image
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

