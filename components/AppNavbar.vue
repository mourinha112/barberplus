<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-800/50">
    <div class="container-app">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <Icon name="lucide:scissors" class="w-5 h-5 text-black" />
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] pulse-dot" />
          </div>
          <div class="hidden sm:block">
            <h1 class="font-display text-xl font-semibold text-white">
              Barber<span class="text-gold-gradient">Plus</span>
            </h1>
            <p class="text-[10px] text-neutral-500 -mt-1 tracking-wider uppercase">Premium Barbershops</p>
          </div>
        </NuxtLink>

        <!-- Location (Desktop) -->
        <button 
          class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-all group"
          @click="showLocationModal = true"
        >
          <Icon name="lucide:map-pin" class="w-4 h-4 text-amber-500" />
          <span class="text-sm text-neutral-300 group-hover:text-white transition-colors">
            {{ currentLocation }}
          </span>
          <Icon name="lucide:chevron-down" class="w-4 h-4 text-neutral-500" />
        </button>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Search (Desktop) -->
          <button 
            class="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 hover:bg-neutral-800 transition-all"
            @click="showSearch = true"
          >
            <Icon name="lucide:search" class="w-5 h-5 text-neutral-400" />
          </button>

          <!-- Notifications -->
          <button class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 hover:bg-neutral-800 transition-all">
            <Icon name="lucide:bell" class="w-5 h-5 text-neutral-400" />
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
              3
            </span>
          </button>

          <!-- Profile / Login Button -->
          <div class="relative" ref="profileDropdown">
            <button 
              class="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-800/50 transition-all"
              @click="isAuthenticated ? toggleProfileMenu() : openAuthModal()"
            >
              <div 
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center border transition-all',
                  isAuthenticated 
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500/50' 
                    : 'bg-gradient-to-br from-neutral-700 to-neutral-800 border-neutral-700'
                ]"
              >
                <template v-if="isAuthenticated && user?.avatarUrl">
                  <img :src="user.avatarUrl" :alt="user.fullName" class="w-full h-full object-cover rounded-xl" />
                </template>
                <template v-else-if="isAuthenticated">
                  <span class="text-sm font-bold text-black">{{ userInitials }}</span>
                </template>
                <template v-else>
                  <Icon name="lucide:user" class="w-5 h-5 text-neutral-400" />
                </template>
              </div>
              <Icon v-if="isAuthenticated" name="lucide:chevron-down" class="w-4 h-4 text-neutral-500 hidden sm:block" />
            </button>

            <!-- Profile Dropdown -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div 
                v-if="showProfileMenu && isAuthenticated"
                class="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl shadow-black/50 overflow-hidden"
              >
                <!-- User Info -->
                <div class="p-4 border-b border-neutral-800">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <template v-if="user?.avatarUrl">
                        <img :src="user.avatarUrl" :alt="user.fullName" class="w-full h-full object-cover rounded-xl" />
                      </template>
                      <template v-else>
                        <span class="text-lg font-bold text-black">{{ userInitials }}</span>
                      </template>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-white truncate">{{ user?.fullName }}</p>
                      <p class="text-sm text-neutral-400 truncate">{{ user?.email }}</p>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="p-2">
                  <NuxtLink 
                    to="/perfil" 
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                    @click="showProfileMenu = false"
                  >
                    <Icon name="lucide:user" class="w-5 h-5 text-neutral-400" />
                    <span class="text-neutral-300">Meu Perfil</span>
                  </NuxtLink>
                  <NuxtLink 
                    to="/agendamentos" 
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                    @click="showProfileMenu = false"
                  >
                    <Icon name="lucide:calendar" class="w-5 h-5 text-neutral-400" />
                    <span class="text-neutral-300">Meus Agendamentos</span>
                  </NuxtLink>
                  <NuxtLink 
                    to="/favoritos" 
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                    @click="showProfileMenu = false"
                  >
                    <Icon name="lucide:heart" class="w-5 h-5 text-neutral-400" />
                    <span class="text-neutral-300">Favoritos</span>
                  </NuxtLink>
                  
                  <!-- Manager Options -->
                  <template v-if="isManager">
                    <div class="my-2 h-px bg-neutral-800" />
                    <NuxtLink 
                      to="/painel" 
                      class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                      @click="showProfileMenu = false"
                    >
                      <Icon name="lucide:layout-dashboard" class="w-5 h-5 text-amber-500" />
                      <span class="text-amber-500 font-medium">Painel da Barbearia</span>
                    </NuxtLink>
                  </template>
                </div>

                <!-- Logout -->
                <div class="p-2 border-t border-neutral-800">
                  <button 
                    class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-left"
                    @click="handleLogout"
                  >
                    <Icon name="lucide:log-out" class="w-5 h-5 text-red-400" />
                    <span class="text-red-400">Sair da conta</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Modal -->
    <UModal v-model="showSearch">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="lucide:search" class="w-5 h-5 text-amber-500" />
          <h3 class="text-lg font-semibold">Buscar Barbearias</h3>
        </div>
        <UInput 
          v-model="searchQuery"
          placeholder="Digite o nome da barbearia..."
          icon="i-lucide-search"
          size="lg"
          autofocus
          @keyup.enter="handleSearch"
        />
        <div class="mt-4 space-y-2">
          <p class="text-xs text-neutral-500 uppercase tracking-wider">Buscas recentes</p>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="recent in recentSearches" 
              :key="recent"
              class="px-3 py-1.5 rounded-lg bg-neutral-800 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="searchQuery = recent"
            >
              {{ recent }}
            </button>
          </div>
        </div>
      </div>
    </UModal>

    <!-- Auth Modal -->
    <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
  </header>

  <!-- Spacer -->
  <div class="h-16" />
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { user, isAuthenticated, isManager, logout, init } = useAuth()

// Initialize auth on mount
onMounted(() => {
  init()
})

const showSearch = ref(false)
const showLocationModal = ref(false)
const showAuthModal = ref(false)
const showProfileMenu = ref(false)
const searchQuery = ref('')
const currentLocation = ref('Aracaju, SE')
const recentSearches = ref(['Corte degradê', 'Barba', 'Barbearia Premium'])
const profileDropdown = ref<HTMLElement | null>(null)

// Close dropdown when clicking outside
onClickOutside(profileDropdown, () => {
  showProfileMenu.value = false
})

const userInitials = computed(() => {
  if (!user.value?.fullName) return '?'
  const names = user.value.fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return names[0][0].toUpperCase()
})

const openAuthModal = () => {
  showAuthModal.value = true
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleAuthSuccess = () => {
  showProfileMenu.value = false
  // Redirect managers to panel
  if (isManager.value) {
    navigateTo('/painel')
  }
}

const handleLogout = () => {
  showProfileMenu.value = false
  logout()
}

const handleSearch = () => {
  if (searchQuery.value) {
    navigateTo(`/buscar?q=${encodeURIComponent(searchQuery.value)}`)
    showSearch.value = false
  }
}
</script>
