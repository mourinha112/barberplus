<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button @click="navigateTo('/perfil')" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <h1 class="font-display text-2xl font-semibold text-white">Barbearias Favoritas</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
          <div class="flex gap-4">
            <div class="w-16 h-16 rounded-xl bg-neutral-800" />
            <div class="flex-1">
              <div class="h-4 w-40 bg-neutral-800 rounded mb-2" />
              <div class="h-3 w-56 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Favorites List -->
      <div v-else-if="favorites.length > 0" class="space-y-4">
        <div
          v-for="shop in favorites"
          :key="shop.id"
          class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
          @click="navigateTo(`/barbearia/${shop.slug}`)"
        >
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
            <img v-if="shop.logo" :src="shop.logo" :alt="shop.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-amber-500 font-bold text-xl">
              {{ shop.name?.charAt(0) }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white truncate">{{ shop.name }}</h3>
            <p class="text-sm text-neutral-500 truncate">{{ shop.address }}</p>
            <div class="flex items-center gap-2 mt-1">
              <Icon name="lucide:star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span class="text-xs text-neutral-400">{{ shop.rating || '0.0' }}</span>
            </div>
          </div>
          <button
            class="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
            @click.stop="removeFavorite(shop.id)"
          >
            <Icon name="lucide:heart" class="w-5 h-5 text-red-400 fill-red-400" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <Icon name="lucide:heart" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Nenhuma favorita</h3>
        <p class="text-sm text-neutral-500 mb-4">Você ainda não favoritou nenhuma barbearia</p>
        <NuxtLink
          to="/buscar"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        >
          <Icon name="lucide:search" class="w-4 h-4" />
          Buscar barbearias
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const toast = useToast()

const loading = ref(true)
const favorites = ref<any[]>([])

const fetchFavorites = async () => {
  loading.value = true
  try {
    const response = await api.user.getFavorites() as any
    if (response.success) {
      favorites.value = (response.data || []).map((f: any) => ({
        id: f.barbershop_id || f.id,
        name: f.barbershop?.name || f.name || '',
        slug: f.barbershop?.slug || f.slug || '',
        logo: f.barbershop?.logo_url || f.logo || '',
        address: f.barbershop?.address || f.address || '',
        rating: f.barbershop?.average_rating || f.rating || 0
      }))
    }
  } catch {
    // Show empty state
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (barbershopId: string) => {
  try {
    await api.user.toggleFavorite(barbershopId)
    favorites.value = favorites.value.filter(f => f.id !== barbershopId)
    toast.add({ title: 'Removido dos favoritos', icon: 'i-lucide-heart', color: 'green' })
  } catch {
    toast.add({ title: 'Erro ao remover', icon: 'i-lucide-alert-circle', color: 'red' })
  }
}

onMounted(() => {
  fetchFavorites()
})

useSeoMeta({
  title: 'Favoritos - BarberPlus'
})
</script>
