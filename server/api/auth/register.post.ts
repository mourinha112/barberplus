import { supabaseAdmin, isSupabaseConfigured } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, fullName, phone, role = 'client' } = body

  // Validações
  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      message: 'Email, senha e nome são obrigatórios'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'A senha deve ter no mínimo 6 caracteres'
    })
  }

  // Verificar se Supabase está configurado
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado - usando modo demo')

    const demoUser = {
      id: 'demo-' + Date.now(),
      email,
      fullName,
      phone,
      role,
      avatarUrl: null
    }

    const token = await generateToken(demoUser)

    return {
      success: true,
      user: demoUser,
      token,
      demo: true
    }
  }

  try {
    // Verificar se email já existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Este email já está em uso'
      })
    }

    // Hash da senha
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.default.hash(password, 10)

    // Criar usuário
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone || null,
        role
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      // Verificar se é erro de tabela não encontrada
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        throw createError({
          statusCode: 500,
          message: 'Tabela de usuários não encontrada. Execute o schema SQL no Supabase.'
        })
      }
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar usuário: ' + error.message
      })
    }

    // Gerar token JWT
    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url
      },
      token
    }
  } catch (error: any) {
    if (error.statusCode && typeof error.statusCode === 'number') {
      throw error
    }
    console.error('Erro no registro:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

// Função para gerar JWT
async function generateToken(user: { id: string; email: string; role?: string }) {
  const jwt = await import('jsonwebtoken')
  const secret = process.env.JWT_SECRET || 'barberplus-demo-secret-2024'

  return jwt.default.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role || 'client'
    },
    secret,
    { expiresIn: '7d' }
  )
}
