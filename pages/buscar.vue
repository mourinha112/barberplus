<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Search Header -->
      <div class="mb-6">
        <h1 class="font-display text-2xl font-semibold text-white mb-4">
          Buscar Barbearias
        </h1>

        <!-- Search Input -->
        <div class="relative mb-4">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou serviço..."
            class="input-premium pl-12 pr-4"
            @keyup.enter="fetchShops"
          />
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            v-for="filter in filters"
            :key="filter.id"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all',
              activeFilters.includes(filter.id)
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-neutral-900/50 border border-neutral-800 text-neutral-300 hover:border-amber-500/30'
            ]"
            @click="toggleFilter(filter.id)"
          >
            <Icon :name="filter.icon" class="w-4 h-4" />
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Results Count & Sort -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-neutral-500">
          {{ filteredShops.length }} barbearias encontradas
        </p>
        <div class="relative">
          <button
            class="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            @click="showSortMenu = !showSortMenu"
          >
            <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
            {{ currentSort.label }}
          </button>
          <div
            v-if="showSortMenu"
            class="absolute right-0 top-full mt-2 w-40 p-1 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl z-10"
          >
            <button
              v-for="option in sortOptions"
              :key="option.id"
              class="w-full px-3 py-2 rounded-lg text-sm text-left transition-colors"
              :class="currentSort.id === option.id ? 'text-amber-500 bg-amber-500/10' : 'text-neutral-300 hover:bg-neutral-800'"
              @click="currentSort = option; showSortMenu = false"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
          <div class="h-40 bg-neutral-800 rounded-xl mb-3" />
          <div class="h-4 w-40 bg-neutral-800 rounded mb-2" />
          <div class="h-3 w-56 bg-neutral-800 rounded" />
        </div>
      </div>

      <!-- Results -->
      <div v-else class="space-y-4">
        <BarbershopCard
          v-for="shop in filteredShops"
          :key="shop.id"
          :barbershop="shop"
          @favorite="handleFavorite"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredShops.length === 0" class="text-center py-16">
        <Icon name="lucide:search-x" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Nenhuma barbearia encontrada</h3>
        <p class="text-sm text-neutral-500">Tente ajustar seus filtros ou buscar por outro termo</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { isAuthenticated } = useAuth()
const toast = useToast()

const searchQuery = ref(route.query.q as string || '')
const activeFilters = ref<string[]>([])
const showSortMenu = ref(false)
const loading = ref(true)
const allShops = ref<any[]>([])

const filters = [
  { id: 'open', icon: 'lucide:clock', label: 'Abertos agora' },
  { id: 'nearby', icon: 'lucide:map-pin', label: 'Mais próximos' },
  { id: 'top-rated', icon: 'lucide:star', label: 'Melhores avaliações' },
  { id: 'featured', icon: 'lucide:crown', label: 'Destaques' },
  { id: 'haircut', icon: 'lucide:scissors', label: 'Corte' },
  { id: 'beard', icon: 'mdi:mustache', label: 'Barba' }
]

const sortOptions = [
  { id: 'relevance', label: 'Relevância' },
  { id: 'rating', label: 'Avaliação' },
  { id: 'distance', label: 'Distância' },
  { id: 'name', label: 'Nome A-Z' }
]

const currentSort = ref(sortOptions[0])

const filteredShops = computed(() => {
  let result = [...allShops.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(shop =>
      shop.name?.toLowerCase().includes(query) ||
      shop.services?.some((s: any) => (s.name || s).toLowerCase().includes(query)) ||
      shop.address?.toLowerCase().includes(query)
    )
  }

  // Active filters
  if (activeFilters.value.includes('open')) {
    result = result.filter(shop => shop.isOpen)
  }
  if (activeFilters.value.includes('featured')) {
    result = result.filter(shop => shop.featured || shop.is_featured)
  }
  if (activeFilters.value.includes('top-rated')) {
    result = result.filter(shop => (shop.rating || shop.average_rating || 0) >= 4.5)
  }
  if (activeFilters.value.includes('haircut')) {
    result = result.filter(shop =>
      shop.services?.some((s: any) => (s.name || s).toLowerCase().includes('corte'))
    )
  }
  if (activeFilters.value.includes('beard')) {
    result = result.filter(shop =>
      shop.services?.some((s: any) => (s.name || s).toLowerCase().includes('barba'))
    )
  }

  // Sorting
  switch (currentSort.value.id) {
    case 'rating':
      result.sort((a, b) => (b.rating || b.average_rating || 0) - (a.rating || a.average_rating || 0))
      break
    case 'name':
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'distance':
      result.sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'))
      break
  }

  return result
})

const fetchShops = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (searchQuery.value) params.q = searchQuery.value

    const response = await api.marketplace.getBarbershops(params) as any
    const shops = response.success ? (response.data || []) : (Array.isArray(response) ? response : [])

    allShops.value = shops.map((shop: any) => ({
      id: shop.id,
      slug: shop.slug,
      name: shop.name,
      logo: shop.logo_url || shop.logoUrl || '',
      coverImage: shop.cover_url || shop.coverUrl || '',
      address: shop.address || [shop.street, shop.neighborhood, shop.city].filter(Boolean).join(', '),
      rating: shop.average_rating || shop.rating || 0,
      reviewCount: shop.total_reviews || shop.reviewCount || 0,
      distance: shop.distance || '',
      isOpen: shop.is_open ?? true,
      isFavorite: shop.is_favorite || false,
      featured: shop.is_featured || false,
      services: shop.services || []
    }))
  } catch {
    allShops.value = []
  } finally {
    loading.value = false
  }
}

const toggleFilter = (filterId: string) => {
  const index = activeFilters.value.indexOf(filterId)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    if (filterId === 'nearby') {
      fetchNearby()
    }
    activeFilters.value.push(filterId)
  }
}

const fetchNearby = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await api.marketplace.getNearbyBarbershops({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 10
          }) as any

          if (response.success && response.data) {
            const nearbyIds = response.data.map((s: any) => s.id)
            allShops.value = allShops.value.map(shop => ({
              ...shop,
              isNearby: nearbyIds.includes(shop.id),
              distance: response.data.find((s: any) => s.id === shop.id)?.distance || shop.distance
            }))
          }
        } catch { /* silently fail */ }
      },
      () => {
        toast.add({ title: 'Localização indisponível', description: 'Habilite a localização para ver barbearias próximas', icon: 'i-lucide-map-pin-off', color: 'yellow' })
      }
    )
  }
}

const handleFavorite = async (shopId: string) => {
  if (!isAuthenticated.value) {
    toast.add({ title: 'Faça login para favoritar', icon: 'i-lucide-log-in', color: 'yellow' })
    return
  }

  const shop = allShops.value.find(s => s.id === shopId)
  if (shop) {
    shop.isFavorite = !shop.isFavorite
    try {
      await api.user.toggleFavorite(shopId)
    } catch {
      shop.isFavorite = !shop.isFavorite
    }
  }
}

// Handle URL query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
    fetchShops()
  }
})

// Close sort menu on click outside
onMounted(() => {
  fetchShops()
  const handler = (e: Event) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      showSortMenu.value = false
    }
  }
  document.addEventListener('click', handler)
  onUnmounted(() => document.removeEventListener('click', handler))
})

useSeoMeta({
  title: 'Buscar Barbearias - BarberPlus'
})
</script>
