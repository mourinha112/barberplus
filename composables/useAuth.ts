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
}

const user = ref<User | null>(null)
const token = ref<string | null>(null)
const barbershops = ref<Barbershop[]>([])
const currentBarbershop = ref<Barbershop | null>(null)
const isLoading = ref(false)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isManager = computed(() => user.value?.role === 'manager' || user.value?.role === 'admin')

  // Inicializar do localStorage
  const init = () => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('barberplus_token')
      const savedUser = localStorage.getItem('barberplus_user')
      const savedBarbershop = localStorage.getItem('barberplus_barbershop')

      if (savedToken) token.value = savedToken
      if (savedUser) user.value = JSON.parse(savedUser)
      if (savedBarbershop) currentBarbershop.value = JSON.parse(savedBarbershop)
    }
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
        token.value = response.token
        user.value = response.user

        localStorage.setItem('barberplus_token', response.token)
        localStorage.setItem('barberplus_user', JSON.stringify(response.user))

        // Buscar barbearias se for gestor
        if (response.user.role === 'manager' || response.user.role === 'admin') {
          await fetchBarbershops()
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Erro ao fazer login' }
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
        token.value = response.token
        user.value = response.user

        localStorage.setItem('barberplus_token', response.token)
        localStorage.setItem('barberplus_user', JSON.stringify(response.user))

        return { success: true }
      }

      return { success: false, error: 'Erro ao criar conta' }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Erro ao criar conta' }
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

    localStorage.removeItem('barberplus_token')
    localStorage.removeItem('barberplus_user')
    localStorage.removeItem('barberplus_barbershop')

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
        barbershops.value = response.barbershops || []

        localStorage.setItem('barberplus_user', JSON.stringify(response.user))
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
      const response = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      }) as any

      if (response.success && response.barbershops) {
        barbershops.value = response.barbershops

        // Selecionar primeira barbearia se não tiver selecionada
        if (response.barbershops.length > 0 && !currentBarbershop.value) {
          setCurrentBarbershop(response.barbershops[0])
        }
      }
    } catch {
      // Silently fail
    }
  }

  // Selecionar barbearia atual
  const setCurrentBarbershop = (barbershop: Barbershop) => {
    currentBarbershop.value = barbershop
    localStorage.setItem('barberplus_barbershop', JSON.stringify(barbershop))
  }

  // Header de autenticação
  const authHeaders = computed(() => {
    if (!token.value) return {}
    return { Authorization: `Bearer ${token.value}` }
  })

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

