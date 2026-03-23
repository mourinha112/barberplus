interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: string
  avatarUrl?: string
}

interface Barbershop {
  id: string
  name: string
  slug: string
  logoUrl?: string
  logo_url?: string
  [key: string]: any
}

// Estado global compartilhado (fora do composable para manter entre componentes)
const authUser = ref<User | null>(null)
const authToken = ref<string | null>(null)
const authBarbershops = ref<Barbershop[]>([])
const authCurrentBarbershop = ref<Barbershop | null>(null)
const authIsLoading = ref(false)
const authInitialized = ref(false)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!authToken.value && !!authUser.value)
  const isManager = computed(() => authUser.value?.role === 'manager' || authUser.value?.role === 'admin')

  // Header de autenticação
  const authHeaders = computed(() => {
    if (!authToken.value) return {}
    return { Authorization: `Bearer ${authToken.value}` }
  })

  // Inicializar do localStorage
  const init = () => {
    if (authInitialized.value) return
    if (typeof window === 'undefined') return

    try {
      const savedToken = localStorage.getItem('barberplus_token')
      const savedUser = localStorage.getItem('barberplus_user')
      const savedBarbershop = localStorage.getItem('barberplus_barbershop')

      if (savedToken) authToken.value = savedToken
      if (savedUser) {
        try {
          authUser.value = JSON.parse(savedUser)
        } catch {
          localStorage.removeItem('barberplus_user')
        }
      }
      if (savedBarbershop) {
        try {
          authCurrentBarbershop.value = JSON.parse(savedBarbershop)
        } catch {
          localStorage.removeItem('barberplus_barbershop')
        }
      }
    } catch {
      // localStorage pode falhar em contextos restritos
    }

    authInitialized.value = true
  }

  // Login
  const login = async (email: string, password: string) => {
    authIsLoading.value = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      }) as any

      if (response.success) {
        setAuthData(response.token, response.user)

        // Buscar barbearias se for gestor
        if (response.user.role === 'manager' || response.user.role === 'admin') {
          await fetchBarbershops()
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Erro ao fazer login'
      return { success: false, error: message }
    } finally {
      authIsLoading.value = false
    }
  }

  // Registro
  const register = async (data: {
    email: string
    password: string
    fullName: string
    phone?: string
    role?: string
  }) => {
    authIsLoading.value = true
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      }) as any

      if (response.success) {
        setAuthData(response.token, response.user)

        if (response.user.role === 'manager' || response.user.role === 'admin') {
          await fetchBarbershops()
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao criar conta' }
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Erro ao criar conta'
      return { success: false, error: message }
    } finally {
      authIsLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    authToken.value = null
    authUser.value = null
    authBarbershops.value = []
    authCurrentBarbershop.value = null
    authInitialized.value = false

    if (typeof window !== 'undefined') {
      localStorage.removeItem('barberplus_token')
      localStorage.removeItem('barberplus_user')
      localStorage.removeItem('barberplus_barbershop')
    }

    navigateTo('/')
  }

  // Buscar dados do usuário
  const fetchUser = async () => {
    if (!authToken.value) return

    try {
      const response = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken.value}` }
      }) as any

      if (response.success) {
        authUser.value = response.user
        if (response.barbershops) {
          authBarbershops.value = response.barbershops
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('barberplus_user', JSON.stringify(response.user))
        }
      }
    } catch {
      logout()
    }
  }

  // Buscar barbearias do gestor
  const fetchBarbershops = async () => {
    if (!authToken.value) return

    try {
      const response = await $fetch('/api/painel/barbershop/my', {
        headers: { Authorization: `Bearer ${authToken.value}` }
      }) as any

      if (response.success) {
        authBarbershops.value = response.data || []

        if (authBarbershops.value.length > 0 && !authCurrentBarbershop.value) {
          setCurrentBarbershop(authBarbershops.value[0])
        }
      }
    } catch (err) {
      console.error('Erro ao buscar barbearias:', err)
    }
  }

  // Selecionar barbearia atual
  const setCurrentBarbershop = (barbershop: Barbershop) => {
    authCurrentBarbershop.value = barbershop
    if (typeof window !== 'undefined') {
      localStorage.setItem('barberplus_barbershop', JSON.stringify(barbershop))
    }
  }

  // Helper interno para setar dados de auth
  const setAuthData = (newToken: string, newUser: User) => {
    authToken.value = newToken
    authUser.value = newUser

    if (typeof window !== 'undefined') {
      localStorage.setItem('barberplus_token', newToken)
      localStorage.setItem('barberplus_user', JSON.stringify(newUser))
    }
  }

  return {
    user: authUser,
    token: authToken,
    barbershops: authBarbershops,
    currentBarbershop: authCurrentBarbershop,
    isLoading: authIsLoading,
    isAuthenticated,
    isManager,
    authHeaders,
    init,
    login,
    register,
    logout,
    fetchUser,
    fetchBarbershops,
    setCurrentBarbershop
  }
}
