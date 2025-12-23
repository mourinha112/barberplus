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

      <!-- Results Count -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-neutral-500">
          {{ filteredShops.length }} barbearias encontradas
        </p>
        <button 
          class="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          @click="showSortMenu = !showSortMenu"
        >
          <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
          {{ currentSort.label }}
        </button>
      </div>

      <!-- Results -->
      <div class="space-y-4">
        <BarbershopCard 
          v-for="shop in filteredShops" 
          :key="shop.id"
          :barbershop="shop"
          @favorite="handleFavorite"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredShops.length === 0" class="text-center py-16">
        <Icon name="lucide:search-x" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Nenhuma barbearia encontrada</h3>
        <p class="text-sm text-neutral-500">Tente ajustar seus filtros ou buscar por outro termo</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const searchQuery = ref(route.query.q as string || '')
const activeFilters = ref<string[]>([])
const showSortMenu = ref(false)

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
  { id: 'distance', label: 'Distância' },
  { id: 'rating', label: 'Avaliação' },
  { id: 'price', label: 'Preço' }
]

const currentSort = ref(sortOptions[0])

const allShops = ref([
  {
    id: '1',
    slug: 'barbearia-premium',
    name: 'Barbearia Premium',
    logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop',
    address: 'Av. Barão de Maruim, 245',
    rating: 4.9,
    reviewCount: 127,
    distance: '1.2km',
    isOpen: true,
    isFavorite: false,
    featured: true,
    services: ['Corte', 'Barba', 'Sobrancelha', 'Pigmentação', 'Relaxamento']
  },
  {
    id: '2',
    slug: 'barber-kings',
    name: 'Barber Kings',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
    address: 'Rua São Cristóvão, 890',
    rating: 4.8,
    reviewCount: 89,
    distance: '2.5km',
    isOpen: true,
    isFavorite: true,
    featured: false,
    services: ['Corte', 'Barba', 'Combo']
  },
  {
    id: '3',
    slug: 'classic-cuts',
    name: 'Classic Cuts',
    logo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=600&fit=crop',
    address: 'Praça da Bandeira, 56',
    rating: 4.7,
    reviewCount: 203,
    distance: '3.1km',
    isOpen: false,
    isFavorite: false,
    featured: false,
    services: ['Corte Clássico', 'Barba Navalhada', 'Hot Towel']
  }
])

const filteredShops = computed(() => {
  let result = [...allShops.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(shop => 
      shop.name.toLowerCase().includes(query) ||
      shop.services.some(s => s.toLowerCase().includes(query))
    )
  }

  // Active filters
  if (activeFilters.value.includes('open')) {
    result = result.filter(shop => shop.isOpen)
  }
  if (activeFilters.value.includes('featured')) {
    result = result.filter(shop => shop.featured)
  }

  return result
})

const toggleFilter = (filterId: string) => {
  const index = activeFilters.value.indexOf(filterId)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterId)
  }
}

const handleFavorite = (shopId: string) => {
  const shop = allShops.value.find(s => s.id === shopId)
  if (shop) {
    shop.isFavorite = !shop.isFavorite
  }
}

// Handle URL query
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
  }
})

useSeoMeta({
  title: 'Buscar Barbearias - BarberPlus'
})
</script>

