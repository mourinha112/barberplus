<template>
  <div class="min-h-screen bg-[#0a0a0a] flex">
    <!-- Modal Criar Barbearia -->
    <UModal v-model="showCreateBarbershop" :ui="{ width: 'max-w-lg' }">
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Icon name="lucide:store" class="w-8 h-8 text-black" />
          </div>
          <h2 class="text-xl font-bold text-white">Crie sua Barbearia</h2>
          <p class="text-neutral-400 text-sm mt-2">Configure sua barbearia para começar a usar o sistema</p>
        </div>

        <form @submit.prevent="createBarbershop" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Nome da Barbearia *</label>
            <input
              v-model="newBarbershop.name"
              type="text"
              placeholder="Ex: Barbearia do João"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Slug (URL) </label>
            <div class="flex items-center gap-2">
              <span class="text-neutral-500 text-sm">barberplus.com/</span>
              <input
                v-model="newBarbershop.slug"
                type="text"
                placeholder="barbearia-do-joao"
                class="flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              />
            </div>
            <p class="text-xs text-neutral-500 mt-1">Deixe em branco para gerar automaticamente</p>
          </div>

          <button
            type="submit"
            :disabled="creatingBarbershop || !newBarbershop.name"
            class="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Icon v-if="creatingBarbershop" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <span>{{ creatingBarbershop ? 'Criando...' : 'Criar Barbearia' }}</span>
          </button>

          <p v-if="createBarbershopError" class="text-red-400 text-sm text-center">{{ createBarbershopError }}</p>
        </form>
      </div>
    </UModal>

    <!-- Sidebar -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-50 w-72 border-r border-neutral-800 flex flex-col transition-transform duration-300"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      style="background-color: #0a0a0a;"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-neutral-800">
        <NuxtLink to="/painel" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Icon name="lucide:scissors" class="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 class="font-display text-lg font-semibold text-white">BarberPlus</h1>
            <p class="text-[10px] text-neutral-500">Painel do Gestor</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Barbershop Selector -->
      <div class="p-4 border-b border-neutral-800">
        <button
          v-if="currentBarbershop"
          class="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          @click="showBarbershopSelector = !showBarbershopSelector"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center overflow-hidden">
            <template v-if="currentBarbershop?.logo_url || currentBarbershop?.logoUrl">
              <img :src="currentBarbershop.logo_url || currentBarbershop.logoUrl" :alt="currentBarbershop.name" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <span class="text-black font-bold text-sm">{{ barbershopInitials }}</span>
            </template>
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium text-white">{{ currentBarbershop?.name }}</p>
            <p class="text-xs text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Ativo
            </p>
          </div>
          <Icon name="lucide:chevron-down" class="w-4 h-4 text-neutral-500" />
        </button>

        <!-- Botão criar barbearia se não tiver -->
        <button
          v-else-if="!loadingBarbershops"
          class="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
          @click="showCreateBarbershop = true"
        >
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-amber-500" />
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium text-amber-500">Criar Barbearia</p>
            <p class="text-xs text-neutral-500">Configure sua primeira barbearia</p>
          </div>
        </button>

        <!-- Barbershop Dropdown -->
        <div v-if="showBarbershopSelector && barbershops.length > 1" class="mt-2 p-2 rounded-xl bg-neutral-800 border border-neutral-700">
          <button
            v-for="shop in barbershops"
            :key="shop.id"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700 transition-colors"
            :class="currentBarbershop?.id === shop.id ? 'bg-neutral-700' : ''"
            @click="selectBarbershop(shop)"
          >
            <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-xs font-bold text-black">
              {{ shop.name.charAt(0) }}
            </div>
            <span class="text-sm text-white">{{ shop.name }}</span>
          </button>

          <button
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700 transition-colors mt-2 border-t border-neutral-700 pt-2"
            @click="showCreateBarbershop = true; showBarbershopSelector = false"
          >
            <div class="w-8 h-8 rounded-lg bg-neutral-600 flex items-center justify-center">
              <Icon name="lucide:plus" class="w-4 h-4 text-neutral-300" />
            </div>
            <span class="text-sm text-neutral-400">Nova barbearia</span>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <p class="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3">Principal</p>

        <NuxtLink
          v-for="item in mainNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
            isActive(item.path)
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span class="flex-1 text-sm">{{ item.label }}</span>
        </NuxtLink>

        <p class="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3 mt-6">Gestão</p>

        <NuxtLink
          v-for="item in managementNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
            isActive(item.path)
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span class="flex-1 text-sm">{{ item.label }}</span>
        </NuxtLink>

        <p class="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3 mt-6">Sistema</p>

        <NuxtLink
          v-for="item in systemNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
            isActive(item.path)
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span class="text-sm">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-neutral-800">
        <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 overflow-hidden flex items-center justify-center">
            <template v-if="user?.avatarUrl">
              <img :src="user.avatarUrl" :alt="user.fullName" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <span class="text-black font-bold text-sm">{{ userInitials }}</span>
            </template>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ user?.fullName || 'Usuário' }}</p>
            <p class="text-xs text-neutral-500">{{ roleLabel }}</p>
          </div>
          <button @click="handleLogout" class="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
            <Icon name="lucide:log-out" class="w-4 h-4 text-neutral-500 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-0">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <button
              class="lg:hidden p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              @click="sidebarOpen = !sidebarOpen"
            >
              <Icon name="lucide:menu" class="w-5 h-5 text-neutral-400" />
            </button>
            <div>
              <h2 class="text-lg font-semibold text-white">{{ pageTitle }}</h2>
              <p class="text-xs text-neutral-500">{{ currentDate }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Quick Actions -->
            <button
              v-if="currentBarbershop"
              class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
              @click="navigateTo('/painel/agendamentos?novo=true')"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              Novo Agendamento
            </button>

            <!-- Notifications -->
            <button class="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <Icon name="lucide:bell" class="w-5 h-5 text-neutral-400" />
            </button>

            <!-- Search -->
            <button class="hidden md:flex p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <Icon name="lucide:search" class="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <!-- Mostrar aviso se não tiver barbearia -->
        <div v-if="!currentBarbershop && !loadingBarbershops" class="flex flex-col items-center justify-center min-h-[60vh]">
          <div class="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
            <Icon name="lucide:store" class="w-10 h-10 text-amber-500" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Bem-vindo ao BarberPlus!</h2>
          <p class="text-neutral-400 text-center max-w-md mb-6">
            Para começar a usar o sistema, você precisa criar sua primeira barbearia.
          </p>
          <button
            @click="showCreateBarbershop = true"
            class="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2"
          >
            <Icon name="lucide:plus" class="w-5 h-5" />
            Criar Minha Barbearia
          </button>
        </div>

        <!-- Conteúdo normal -->
        <div v-else-if="currentBarbershop">
          <slot />
        </div>

        <!-- Loading -->
        <div v-else class="flex items-center justify-center min-h-[60vh]">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const route = useRoute()
const {
  user,
  token,
  isAuthenticated,
  isManager,
  barbershops,
  currentBarbershop,
  authHeaders,
  init,
  logout,
  fetchBarbershops,
  setCurrentBarbershop
} = useAuth()

const sidebarOpen = ref(false)
const showBarbershopSelector = ref(false)
const showCreateBarbershop = ref(false)
const loadingBarbershops = ref(true)
const creatingBarbershop = ref(false)
const createBarbershopError = ref('')
const newBarbershop = ref({
  name: '',
  slug: ''
})

// Initialize auth
onMounted(async () => {
  init()

  // Aguardar próximo tick para os valores computados atualizarem
  await nextTick()

  // Redirect if not authenticated or not a manager
  if (!isAuthenticated.value || !isManager.value) {
    navigateTo('/')
    return
  }

  // Buscar barbearias do usuário
  await loadBarbershops()
})

// Buscar barbearias do usuário
const loadBarbershops = async () => {
  if (!token.value) return

  loadingBarbershops.value = true
  try {
    await fetchBarbershops()
  } catch (error) {
    console.error('Erro ao buscar barbearias:', error)
  } finally {
    loadingBarbershops.value = false
  }
}

// Criar barbearia
const createBarbershop = async () => {
  if (!newBarbershop.value.name || !token.value) return

  creatingBarbershop.value = true
  createBarbershopError.value = ''

  try {
    const response = await $fetch('/api/painel/barbershop', {
      method: 'POST',
      headers: authHeaders.value,
      body: {
        name: newBarbershop.value.name,
        slug: newBarbershop.value.slug || undefined
      }
    }) as any

    if (response.success) {
      // Recarregar barbearias e selecionar a nova
      await fetchBarbershops()
      if (response.data) {
        setCurrentBarbershop(response.data)
      }
      showCreateBarbershop.value = false
      newBarbershop.value = { name: '', slug: '' }
    }
  } catch (error: any) {
    createBarbershopError.value = error.data?.message || error.message || 'Erro ao criar barbearia'
  } finally {
    creatingBarbershop.value = false
  }
}

// Watch for auth changes
watch(isAuthenticated, (isAuth) => {
  if (!isAuth) {
    navigateTo('/')
  }
})

const userInitials = computed(() => {
  if (!user.value?.fullName) return '?'
  const names = user.value.fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return names[0][0].toUpperCase()
})

const barbershopInitials = computed(() => {
  if (!currentBarbershop.value?.name) return 'BP'
  const words = currentBarbershop.value.name.split(' ')
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  return words[0].substring(0, 2).toUpperCase()
})

const roleLabel = computed(() => {
  const roles: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gestor',
    professional: 'Profissional',
    client: 'Cliente'
  }
  return roles[user.value?.role || ''] || 'Usuário'
})

const selectBarbershop = (shop: any) => {
  setCurrentBarbershop(shop)
  showBarbershopSelector.value = false
}

const handleLogout = () => {
  logout()
}

const mainNavItems = [
  { path: '/painel', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
  { path: '/painel/agendamentos', icon: 'lucide:calendar', label: 'Agendamentos' },
  { path: '/painel/fila', icon: 'lucide:users', label: 'Fila Virtual' },
  { path: '/painel/caixa', icon: 'lucide:banknote', label: 'Caixa do Dia' }
]

const managementNavItems = [
  { path: '/painel/clientes', icon: 'lucide:user-circle', label: 'Clientes' },
  { path: '/painel/equipe', icon: 'lucide:users-round', label: 'Equipe' },
  { path: '/painel/servicos', icon: 'lucide:scissors', label: 'Serviços' },
  { path: '/painel/financeiro', icon: 'lucide:wallet', label: 'Financeiro' },
  { path: '/painel/fidelidade', icon: 'lucide:gift', label: 'Fidelidade' },
  { path: '/painel/avaliacoes', icon: 'lucide:star', label: 'Avaliações' }
]

const systemNavItems = [
  { path: '/painel/whatsapp', icon: 'mdi:whatsapp', label: 'WhatsApp Bot' },
  { path: '/painel/link-bio', icon: 'lucide:link', label: 'Link Bio' },
  { path: '/painel/planos', icon: 'lucide:crown', label: 'Planos' },
  { path: '/painel/configuracoes', icon: 'lucide:settings', label: 'Configurações' }
]

const isActive = (path: string) => {
  if (path === '/painel') {
    return route.path === '/painel'
  }
  return route.path.startsWith(path)
}

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/painel': 'Dashboard',
    '/painel/agendamentos': 'Agendamentos',
    '/painel/fila': 'Fila Virtual',
    '/painel/caixa': 'Caixa do Dia',
    '/painel/clientes': 'Clientes',
    '/painel/equipe': 'Equipe',
    '/painel/servicos': 'Serviços',
    '/painel/financeiro': 'Financeiro',
    '/painel/fidelidade': 'Programa de Fidelidade',
    '/painel/avaliacoes': 'Avaliações',
    '/painel/whatsapp': 'WhatsApp Bot',
    '/painel/link-bio': 'Link Bio',
    '/painel/planos': 'Planos',
    '/painel/configuracoes': 'Configurações'
  }
  return titles[route.path] || 'Painel'
})

const currentDate = computed(() => {
  return format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })
})

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})

// Provide barbershop to child components
provide('currentBarbershop', currentBarbershop)
</script>
