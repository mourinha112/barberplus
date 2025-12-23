import { supabaseAdmin } from '~/server/utils/supabase'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validações
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email e senha são obrigatórios'
      })
    }

    // Buscar usuário
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      throw createError({
        statusCode: 401,
        message: 'Credenciais inválidas'
      })
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      throw createError({
        statusCode: 401,
        message: 'Credenciais inválidas'
      })
    }

    // Atualizar último login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    // Gerar token JWT
    const token = await generateToken(user)

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
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})

// Função para gerar JWT
async function generateToken(user: any) {
  const jwt = await import('jsonwebtoken')
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  
  return jwt.default.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn: '7d' }
  )
}

