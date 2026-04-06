<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Not logged in -->
      <div v-if="!isAuthenticated" class="text-center py-16">
        <Icon name="lucide:user-x" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Você não está logado</h3>
        <p class="text-sm text-neutral-500 mb-4">Faça login para acessar seu perfil</p>
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="showAuthModal = true"
        >
          <Icon name="lucide:log-in" class="w-4 h-4" />
          Entrar
        </button>
        <AuthModal v-model="showAuthModal" @success="onAuthSuccess" />
      </div>

      <!-- Logged in -->
      <template v-else>
        <!-- Profile Header -->
        <div class="text-center mb-8">
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/50 mx-auto">
              <img
                :src="profileData.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileData.name) + '&background=f59e0b&color=000&size=200'"
                :alt="profileData.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 class="font-display text-2xl font-semibold text-white mb-1">{{ profileData.name }}</h1>
          <p class="text-sm text-neutral-500">{{ profileData.email }}</p>

          <!-- Stats -->
          <div class="flex items-center justify-center gap-8 mt-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-white">{{ profileData.totalBookings }}</p>
              <p class="text-xs text-neutral-500">Agendamentos</p>
            </div>
            <div class="w-px h-10 bg-neutral-800" />
            <div class="text-center">
              <p class="text-2xl font-bold text-white">{{ profileData.favoriteShops }}</p>
              <p class="text-xs text-neutral-500">Favoritos</p>
            </div>
          </div>
        </div>

        <!-- Menu Sections -->
        <div class="space-y-6">
          <!-- Account Section -->
          <div>
            <h3 class="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 px-1">
              Conta
            </h3>
            <div class="space-y-2">
              <ProfileMenuItem
                icon="lucide:user"
                label="Editar perfil"
                @click="navigateTo('/perfil/editar')"
              />
              <ProfileMenuItem
                icon="lucide:bell"
                label="Notificações"
                @click="navigateTo('/perfil/notificacoes')"
              />
            </div>
          </div>

          <!-- Favorites Section -->
          <div>
            <h3 class="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 px-1">
              Favoritos
            </h3>
            <div class="space-y-2">
              <ProfileMenuItem
                icon="lucide:heart"
                label="Barbearias favoritas"
                @click="navigateTo('/perfil/favoritos')"
              />
            </div>
          </div>

          <!-- Manager Section -->
          <div v-if="isManager">
            <h3 class="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 px-1">
              Barbearia
            </h3>
            <div class="space-y-2">
              <ProfileMenuItem
                icon="lucide:layout-dashboard"
                label="Painel de gestão"
                @click="navigateTo('/painel')"
              />
            </div>
          </div>

          <!-- Support Section -->
          <div>
            <h3 class="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 px-1">
              Suporte
            </h3>
            <div class="space-y-2">
              <ProfileMenuItem
                icon="lucide:file-text"
                label="Termos de uso"
                @click="navigateTo('/termos')"
              />
              <ProfileMenuItem
                icon="lucide:shield"
                label="Política de privacidade"
                @click="navigateTo('/privacidade')"
              />
            </div>
          </div>

          <!-- Logout -->
          <button
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            @click="handleLogout"
          >
            <Icon name="lucide:log-out" class="w-5 h-5" />
            Sair da conta
          </button>

          <!-- Version -->
          <p class="text-center text-xs text-neutral-600 pt-4">
            BarberPlus v1.0.0
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, isManager, logout } = useAuth()
const api = useApi()

const showAuthModal = ref(false)

const profileData = computed(() => ({
  name: user.value?.fullName || user.value?.full_name || 'Usuário',
  email: user.value?.email || '',
  avatar: user.value?.avatarUrl || user.value?.avatar_url || '',
  totalBookings: 0,
  favoriteShops: 0
}))

const onAuthSuccess = () => {
  showAuthModal.value = false
}

const handleLogout = () => {
  logout()
}

useSeoMeta({
  title: 'Meu Perfil - BarberPlus'
})
</script>
