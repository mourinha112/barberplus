<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <HomeHeroSection @search="handleSearch" />

    <!-- Featured Carousel -->
    <HomeFeaturedCarousel :shops="featuredShops" :loading="loadingFeatured" />

    <!-- Categories -->
    <HomeCategoriesSection @select="handleCategorySelect" />

    <!-- Promo Section -->
    <HomePromoSection />

    <!-- Nearby / All Barbershops -->
    <HomeNearbySection :shops="allShops" :loading="loadingAll" />

    <!-- All Barbershops Grid (Desktop) -->
    <section v-if="allShops.length > 0" class="py-6 hidden lg:block">
      <div class="container-app">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-display text-xl font-semibold text-white">
              Todas as Barbearias
            </h2>
            <p class="text-sm text-neutral-500 mt-0.5">{{ allShops.length }} barbearias disponíveis</p>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center gap-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              :class="['p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white']"
              @click="viewMode = 'grid'"
            >
              <Icon name="lucide:layout-grid" class="w-4 h-4" />
            </button>
            <button
              :class="['p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white']"
              @click="viewMode = 'list'"
            >
              <Icon name="lucide:list" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 xl:grid-cols-3 gap-6">
          <BarbershopCard
            v-for="shop in allShops"
            :key="shop.id"
            :barbershop="shop"
            @favorite="handleFavorite"
          />
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <BarbershopCardCompact
            v-for="shop in allShops"
            :key="shop.id"
            :barbershop="shop"
          />
        </div>
      </div>
    </section>

    <!-- Empty state -->
    <section v-if="!loadingAll && allShops.length === 0" class="py-12">
      <div class="container-app text-center">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
          <Icon name="lucide:scissors" class="w-10 h-10 text-neutral-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Nenhuma barbearia ainda</h3>
        <p class="text-neutral-500 text-sm">As barbearias cadastradas aparecerão aqui.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const viewMode = ref<'grid' | 'list'>('grid')
const loadingFeatured = ref(true)
const loadingAll = ref(true)
const featuredShops = ref<any[]>([])
const allShops = ref<any[]>([])

// Mapear dados do banco para o formato dos cards
const mapBarbershop = (shop: any) => ({
  id: shop.id,
  slug: shop.slug,
  name: shop.name,
  logo: shop.logo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(shop.name) + '&background=f59e0b&color=000&size=200',
  coverImage: shop.cover_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop',
  address: [shop.address_street, shop.address_number, shop.address_neighborhood].filter(Boolean).join(', ') || shop.address_city || 'Endereço não informado',
  rating: Number(shop.rating_average) || 0,
  reviewCount: shop.rating_count || 0,
  distance: shop.distance ? `${shop.distance}km` : '',
  isOpen: true,
  isFavorite: false,
  featured: shop.is_featured || false,
  services: []
})

// Buscar barbearias em destaque
const fetchFeatured = async () => {
  loadingFeatured.value = true
  try {
    const response = await $fetch('/api/barbershops/featured') as any
    if (response.success && response.data) {
      featuredShops.value = response.data.map(mapBarbershop)
    }
  } catch {
    // Silently fail
  } finally {
    loadingFeatured.value = false
  }
}

// Buscar todas as barbearias
const fetchAll = async () => {
  loadingAll.value = true
  try {
    const response = await $fetch('/api/barbershops', {
      params: { sortBy: 'newest', limit: 50 }
    }) as any
    if (response.success && response.data) {
      allShops.value = response.data.map(mapBarbershop)
      // Se não tem featured separado, usar as primeiras como featured
      if (featuredShops.value.length === 0 && allShops.value.length > 0) {
        featuredShops.value = allShops.value.slice(0, 4)
      }
    }
  } catch {
    // Silently fail
  } finally {
    loadingAll.value = false
  }
}

// Buscar dados ao montar
onMounted(async () => {
  await Promise.all([fetchFeatured(), fetchAll()])
})

const handleCategorySelect = (categoryId: string) => {
  navigateTo(`/buscar?categoria=${categoryId}`)
}

const handleFavorite = (shopId: string) => {
  const shop = allShops.value.find(s => s.id === shopId)
  if (shop) {
    shop.isFavorite = !shop.isFavorite
  }
}

const handleSearch = (query: string) => {
  if (query) {
    navigateTo(`/buscar?q=${encodeURIComponent(query)}`)
  }
}

// SEO
useSeoMeta({
  title: 'BarberPlus - Marketplace Premium de Barbearias',
  description: 'Encontre as melhores barbearias perto de você. Agende cortes, barbas e muito mais com facilidade.',
  ogTitle: 'BarberPlus - Marketplace Premium de Barbearias',
  ogDescription: 'Encontre as melhores barbearias perto de você.',
  ogImage: '/og-image.png'
})
</script>
