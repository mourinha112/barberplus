<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <HomeHeroSection />

    <!-- Featured Carousel -->
    <HomeFeaturedCarousel />

    <!-- Categories -->
    <HomeCategoriesSection @select="handleCategorySelect" />

    <!-- Promo Section -->
    <HomePromoSection />

    <!-- Nearby Section -->
    <HomeNearbySection />

    <!-- All Barbershops Grid (Desktop) -->
    <section class="py-6 hidden lg:block">
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
  </div>
</template>

<script setup lang="ts">
const viewMode = ref<'grid' | 'list'>('grid')

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
  },
  {
    id: '4',
    slug: 'the-gentlemans-barber',
    name: "The Gentleman's Barber",
    logo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=600&fit=crop',
    address: 'Rua João Pessoa, 1024',
    rating: 4.9,
    reviewCount: 312,
    distance: '0.8km',
    isOpen: true,
    isFavorite: false,
    featured: true,
    services: ['Corte', 'Barba', 'Tratamento Capilar', 'Massagem']
  },
  {
    id: '5',
    slug: 'urban-barber',
    name: 'Urban Barber',
    logo: 'https://images.unsplash.com/photo-1587909209111-5097ee578ec3?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1587909209111-5097ee578ec3?w=800&h=600&fit=crop',
    address: 'Av. Hermes Fontes, 678',
    rating: 4.6,
    reviewCount: 156,
    distance: '1.9km',
    isOpen: true,
    isFavorite: false,
    featured: false,
    services: ['Corte Moderno', 'Degradê', 'Design de Barba']
  },
  {
    id: '6',
    slug: 'vintage-cuts',
    name: 'Vintage Cuts',
    logo: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&h=600&fit=crop',
    address: 'Rua Laranjeiras, 432',
    rating: 4.8,
    reviewCount: 98,
    distance: '2.2km',
    isOpen: true,
    isFavorite: true,
    featured: false,
    services: ['Corte Vintage', 'Pompadour', 'Side Part', 'Barba Clássica']
  }
])

const handleCategorySelect = (categoryId: string) => {
  navigateTo(`/buscar?categoria=${categoryId}`)
}

const handleFavorite = (shopId: string) => {
  const shop = allShops.value.find(s => s.id === shopId)
  if (shop) {
    shop.isFavorite = !shop.isFavorite
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

