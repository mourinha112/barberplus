<template>
  <section class="py-6">
    <div class="container-app">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-display text-xl font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:map-pin" class="w-5 h-5 text-amber-500" />
            Perto de você
          </h2>
          <p class="text-sm text-neutral-500 mt-0.5">Baseado na sua localização</p>
        </div>
        <NuxtLink 
          to="/buscar?filter=nearby"
          class="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Ver todas
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- List -->
      <div class="space-y-3">
        <BarbershopCardCompact 
          v-for="(shop, index) in nearbyShops" 
          :key="shop.id"
          :barbershop="shop"
          class="fade-in-up animate-hidden"
          :style="{ animationDelay: `${index * 100}ms` }"
        />
      </div>

      <!-- Load More -->
      <button 
        v-if="hasMore"
        class="w-full mt-4 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:border-amber-500/30 transition-all flex items-center justify-center gap-2"
        @click="loadMore"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Carregar mais
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const hasMore = ref(true)

const nearbyShops = ref([
  {
    id: '1',
    slug: 'barbearia-falcone',
    name: 'Barbearia Falcone',
    logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
    address: 'Rua Lázaro Cárdenas, 123',
    rating: 5.0,
    distance: '1.26km',
    isOpen: true,
    featured: true
  },
  {
    id: '2',
    slug: 'barbershop-kids-fun',
    name: 'Barbershop Kids Fun',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop',
    address: 'Rua Lázaro Cárdenas, 309',
    rating: 5.0,
    distance: '1.31km',
    isOpen: true,
    featured: false
  },
  {
    id: '3',
    slug: 'barbearia-jubilexxx',
    name: 'Barbearia Jubilexxx',
    logo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop',
    address: 'R. Aracajú, 4 - lote 03',
    rating: 5.0,
    distance: '1.61km',
    isOpen: false,
    featured: false
  },
  {
    id: '4',
    slug: 'barbearia-portes',
    name: 'Barbearia Portes',
    logo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop',
    address: 'Rua Pedro Pondé, 28',
    rating: 5.0,
    distance: '2.05km',
    isOpen: true,
    featured: true
  }
])

const loadMore = () => {
  // Simulate loading more
  hasMore.value = false
}
</script>

