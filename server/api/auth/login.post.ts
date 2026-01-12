import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Validações
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios'
    })
  }

  // Verificar se Supabase está configurado
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Modo demo - aceita qualquer login
    console.warn('⚠️ Supabase não configurado - usando modo demo')
    
    const demoUser = {
      id: 'demo-' + Date.now(),
      email,
      fullName: 'Usuário Demo',
      phone: null,
      role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'client',
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
    const bcrypt = await import('bcryptjs')
    const validPassword = await bcrypt.default.compare(password, user.password_hash)
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
    // Se já for um H3Error, re-lança
    if (error.statusCode && typeof error.statusCode === 'number') {
      throw error
    }
    // Senão, cria um novo erro
    console.error('Erro no login:', error)
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
