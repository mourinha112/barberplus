import { supabaseAdmin } from '~/server/utils/supabase'

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

  // Verificar se Supabase está configurado
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Modo demo - retorna usuário fake para testes
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
      .single()

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
        phone,
        role
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
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
    // Se já for um H3Error, re-lança
    if (error.statusCode && typeof error.statusCode === 'number') {
      throw error
    }
    // Senão, cria um novo erro
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
