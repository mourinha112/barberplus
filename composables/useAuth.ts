import { ref, computed } from 'vue'

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
const user = ref<User | null>(null)
const token = ref<string | null>(null)
const barbershops = ref<Barbershop[]>([])
const currentBarbershop = ref<Barbershop | null>(null)
const isLoading = ref(false)
const _initialized = ref(false)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isManager = computed(() => user.value?.role === 'manager' || user.value?.role === 'admin')

  // Header de autenticação
  const authHeaders = computed(() => {
    if (!token.value) return {}
    return { Authorization: `Bearer ${token.value}` }
  })

  // Inicializar do localStorage
  const init = () => {
    if (_initialized.value) return
    if (typeof window === 'undefined') return

    try {
      const savedToken = localStorage.getItem('barberplus_token')
      const savedUser = localStorage.getItem('barberplus_user')
      const savedBarbershop = localStorage.getItem('barberplus_barbershop')

      if (savedToken) token.value = savedToken
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch {
          localStorage.removeItem('barberplus_user')
        }
      }
      if (savedBarbershop) {
        try {
          currentBarbershop.value = JSON.parse(savedBarbershop)
        } catch {
          localStorage.removeItem('barberplus_barbershop')
        }
      }
    } catch {
      // localStorage pode falhar em contextos restritos
    }

    _initialized.value = true
  }

  // Login
  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      }) as any

      if (response.success) {
        _setAuthData(response.token, response.user)

        // Buscar barbearias se for gestor
        if (response.user.role === 'manager' || response.user.role === 'admin') {
          await fetchBarbershops()
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Erro ao fazer login'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
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
    isLoading.value = true
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      }) as any

      if (response.success) {
        _setAuthData(response.token, response.user)

        // Se registrou como manager, buscar barbearias
        if (response.user.role === 'manager' || response.user.role === 'admin') {
          await fetchBarbershops()
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao criar conta' }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Erro ao criar conta'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    token.value = null
    user.value = null
    barbershops.value = []
    currentBarbershop.value = null
    _initialized.value = false

    if (typeof window !== 'undefined') {
      localStorage.removeItem('barberplus_token')
      localStorage.removeItem('barberplus_user')
      localStorage.removeItem('barberplus_barbershop')
    }

    navigateTo('/')
  }

  // Buscar dados do usuário
  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      }) as any

      if (response.success) {
        user.value = response.user
        if (response.barbershops) {
          barbershops.value = response.barbershops
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('barberplus_user', JSON.stringify(response.user))
        }
      }
    } catch {
      // Token inválido, fazer logout
      logout()
    }
  }

  // Buscar barbearias do gestor
  const fetchBarbershops = async () => {
    if (!token.value) return

    try {
      const response = await $fetch('/api/painel/barbershop/my', {
        headers: { Authorization: `Bearer ${token.value}` }
      }) as any

      if (response.success) {
        barbershops.value = response.data || []

        // Selecionar primeira barbearia se não tiver selecionada
        if (barbershops.value.length > 0 && !currentBarbershop.value) {
          setCurrentBarbershop(barbershops.value[0])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar barbearias:', error)
    }
  }

  // Selecionar barbearia atual
  const setCurrentBarbershop = (barbershop: Barbershop) => {
    currentBarbershop.value = barbershop
    if (typeof window !== 'undefined') {
      localStorage.setItem('barberplus_barbershop', JSON.stringify(barbershop))
    }
  }

  // Helper interno para setar dados de auth
  const _setAuthData = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser

    if (typeof window !== 'undefined') {
      localStorage.setItem('barberplus_token', newToken)
      localStorage.setItem('barberplus_user', JSON.stringify(newUser))
    }
  }

  return {
    user,
    token,
    barbershops,
    currentBarbershop,
    isLoading,
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
