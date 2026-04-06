import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Nenhum arquivo enviado'
      })
    }

    const fileField = formData.find(f => f.name === 'file')
    const typeField = formData.find(f => f.name === 'type')
    const barbershopIdField = formData.find(f => f.name === 'barbershopId')

    if (!fileField || !fileField.data) {
      throw createError({
        statusCode: 400,
        message: 'Arquivo é obrigatório'
      })
    }

    const type = typeField?.data?.toString() || 'image'
    const barbershopId = barbershopIdField?.data?.toString()

    if (!barbershopId) {
      throw createError({
        statusCode: 400,
        message: 'ID da barbearia é obrigatório'
      })
    }

    // Gerar nome único para o arquivo
    const ext = fileField.filename?.split('.').pop() || 'png'
    const fileName = `${barbershopId}/${type}-${Date.now()}.${ext}`

    if (!isSupabaseConfigured) {
      // Sem Supabase, converter para base64 data URL
      const base64 = fileField.data.toString('base64')
      const mimeType = fileField.type || 'image/png'
      const dataUrl = `data:${mimeType};base64,${base64}`

      // Salvar a URL diretamente no barbershop
      const field = type === 'logo' ? 'logo_url' : 'cover_url'

      return {
        success: true,
        data: { url: dataUrl }
      }
    }

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('barbershop-images')
      .upload(fileName, fileField.data, {
        contentType: fileField.type || 'image/png',
        upsert: true
      })

    if (uploadError) {
      // Se o bucket não existe, tentar criar
      if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
        await supabaseAdmin.storage.createBucket('barbershop-images', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        })

        // Tentar upload novamente
        const { data: retryData, error: retryError } = await supabaseAdmin
          .storage
          .from('barbershop-images')
          .upload(fileName, fileField.data, {
            contentType: fileField.type || 'image/png',
            upsert: true
          })

        if (retryError) {
          throw createError({
            statusCode: 500,
            message: 'Erro ao enviar imagem: ' + retryError.message
          })
        }
      } else {
        throw createError({
          statusCode: 500,
          message: 'Erro ao enviar imagem: ' + uploadError.message
        })
      }
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin
      .storage
      .from('barbershop-images')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // Atualizar o campo no barbershop
    const field = type === 'logo' ? 'logo_url' : 'cover_url'
    await supabaseAdmin
      .from('barbershops')
      .update({ [field]: publicUrl })
      .eq('id', barbershopId)

    return {
      success: true,
      data: { url: publicUrl }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao processar upload'
    })
  }
})
