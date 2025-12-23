import { supabaseAdmin } from '~/server/utils/supabase'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, fullName, phone, role = 'client' } = body

    // Validações
    if (!email || !password || !fullName) {
      throw createError({
        statusCode: 400,
        message: 'Email, senha e nome são obrigatórios'
      })
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Este email já está em uso'
      })
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10)

    // Criar usuário
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone,
        role
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar usuário'
      })
    }

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

