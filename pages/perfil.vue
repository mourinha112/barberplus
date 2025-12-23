<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Profile Header -->
      <div class="text-center mb-8">
        <div class="relative inline-block mb-4">
          <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/50 mx-auto">
            <img 
              :src="user.avatar" 
              :alt="user.name"
              class="w-full h-full object-cover"
            />
          </div>
          <button class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-lg">
            <Icon name="lucide:camera" class="w-4 h-4" />
          </button>
        </div>
        <h1 class="font-display text-2xl font-semibold text-white mb-1">{{ user.name }}</h1>
        <p class="text-sm text-neutral-500">{{ user.email }}</p>
        
        <!-- Stats -->
        <div class="flex items-center justify-center gap-8 mt-6">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ user.totalBookings }}</p>
            <p class="text-xs text-neutral-500">Agendamentos</p>
          </div>
          <div class="w-px h-10 bg-neutral-800" />
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ user.favoriteShops }}</p>
            <p class="text-xs text-neutral-500">Favoritos</p>
          </div>
          <div class="w-px h-10 bg-neutral-800" />
          <div class="text-center">
            <p class="text-2xl font-bold text-gold-gradient">{{ user.points }}</p>
            <p class="text-xs text-neutral-500">Pontos</p>
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
              icon="lucide:credit-card"
              label="Métodos de pagamento"
              badge="2"
              @click="navigateTo('/perfil/pagamentos')"
            />
            <ProfileMenuItem 
              icon="lucide:map-pin"
              label="Endereços salvos"
              @click="navigateTo('/perfil/enderecos')"
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
            <ProfileMenuItem 
              icon="lucide:bookmark"
              label="Serviços salvos"
              @click="navigateTo('/perfil/servicos-salvos')"
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
              icon="lucide:help-circle"
              label="Central de ajuda"
              @click="navigateTo('/ajuda')"
            />
            <ProfileMenuItem 
              icon="lucide:message-circle"
              label="Fale conosco"
              @click="navigateTo('/contato')"
            />
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
    </div>
  </div>
</template>

<script setup lang="ts">
const user = ref({
  name: 'João Silva',
  email: 'joao.silva@email.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  totalBookings: 24,
  favoriteShops: 5,
  points: 1250
})

const handleLogout = () => {
  const toast = useToast()
  toast.add({
    title: 'Você saiu da conta',
    icon: 'i-lucide-check',
    color: 'green'
  })
}

useSeoMeta({
  title: 'Meu Perfil - BarberPlus'
})
</script>

