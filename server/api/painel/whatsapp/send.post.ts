import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { barbershopId, phone, message, clientId } = body

    if (!barbershopId || !phone || !message) {
      throw createError({
        statusCode: 400,
        message: 'Dados obrigatórios incompletos'
      })
    }

    // Verificar se o bot está habilitado
    const { data: barbershop } = await supabaseAdmin
      .from('barbershops')
      .select('whatsapp_bot_enabled, whatsapp_instance_id')
      .eq('id', barbershopId)
      .single()

    if (!barbershop?.whatsapp_bot_enabled || !barbershop?.whatsapp_instance_id) {
      throw createError({
        statusCode: 400,
        message: 'WhatsApp Bot não está configurado'
      })
    }

    // Formatar número
    const formattedPhone = phone.replace(/\D/g, '')
    const fullPhone = formattedPhone.startsWith('55') ? formattedPhone : `55${formattedPhone}`

    // Enviar mensagem via Evolution API ou similar
    const whatsappApiUrl = process.env.WHATSAPP_API_URL
    const whatsappApiKey = process.env.WHATSAPP_API_KEY

    if (whatsappApiUrl && whatsappApiKey) {
      try {
        const response = await $fetch(`${whatsappApiUrl}/message/sendText/${barbershop.whatsapp_instance_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': whatsappApiKey
          },
          body: {
            number: `${fullPhone}@s.whatsapp.net`,
            text: message
          }
        })

        // Salvar mensagem enviada
        await supabaseAdmin
          .from('whatsapp_messages')
          .insert({
            barbershop_id: barbershopId,
            client_id: clientId,
            phone: fullPhone,
            message,
            status: 'sent',
            sent_at: new Date().toISOString()
          })

        return {
          success: true,
          message: 'Mensagem enviada com sucesso'
        }
      } catch (apiError) {
        // Salvar erro
        await supabaseAdmin
          .from('whatsapp_messages')
          .insert({
            barbershop_id: barbershopId,
            client_id: clientId,
            phone: fullPhone,
            message,
            status: 'failed',
            error_message: 'Falha ao enviar mensagem'
          })

        throw createError({
          statusCode: 500,
          message: 'Falha ao enviar mensagem via WhatsApp'
        })
      }
    }

    // Se não tem API configurada, apenas salvar como pendente
    await supabaseAdmin
      .from('whatsapp_messages')
      .insert({
        barbershop_id: barbershopId,
        client_id: clientId,
        phone: fullPhone,
        message,
        status: 'pending'
      })

    return {
      success: true,
      message: 'Mensagem agendada'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

