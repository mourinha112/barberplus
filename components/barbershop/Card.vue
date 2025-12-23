<template>
  <NuxtLink 
    :to="`/barbearia/${barbershop.slug}`"
    class="card-premium block group"
  >
    <!-- Image Section -->
    <div class="relative h-44 overflow-hidden">
      <img 
        :src="barbershop.coverImage" 
        :alt="barbershop.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <!-- Badges -->
      <div class="absolute top-3 left-3 flex items-center gap-2">
        <span v-if="barbershop.featured" class="badge-gold flex items-center gap-1">
          <Icon name="lucide:crown" class="w-3 h-3" />
          Destaque
        </span>
        <span :class="['badge-status', barbershop.isOpen ? 'open' : 'closed']">
          <span class="w-1.5 h-1.5 rounded-full" :class="barbershop.isOpen ? 'bg-emerald-400' : 'bg-red-400'" />
          {{ barbershop.isOpen ? 'Aberto' : 'Fechado' }}
        </span>
      </div>

      <!-- Favorite Button -->
      <button 
        class="absolute top-3 right-3 w-9 h-9 rounded-xl glass flex items-center justify-center transition-all hover:scale-110"
        :class="barbershop.isFavorite ? 'text-red-500' : 'text-white/70 hover:text-red-400'"
        @click.prevent="toggleFavorite"
      >
        <Icon :name="barbershop.isFavorite ? 'lucide:heart' : 'lucide:heart'" :class="barbershop.isFavorite ? 'fill-current' : ''" class="w-5 h-5" />
      </button>

      <!-- Avatar -->
      <div class="absolute -bottom-6 left-4">
        <div class="w-16 h-16 rounded-2xl border-4 border-[#171717] overflow-hidden shadow-xl">
          <img 
            :src="barbershop.logo" 
            :alt="barbershop.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-4 pt-8">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-white text-lg truncate group-hover:text-amber-400 transition-colors">
            {{ barbershop.name }}
          </h3>
          <p class="text-sm text-neutral-500 truncate flex items-center gap-1">
            <Icon name="lucide:map-pin" class="w-3.5 h-3.5 flex-shrink-0" />
            {{ barbershop.address }}
          </p>
        </div>
      </div>

      <!-- Rating & Distance -->
      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-3">
          <!-- Rating -->
          <div class="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
            <span class="text-sm font-semibold text-amber-400">{{ barbershop.rating }}</span>
            <span class="text-xs text-neutral-500">({{ barbershop.reviewCount }})</span>
          </div>

          <!-- Distance -->
          <div class="distance-badge">
            <Icon name="lucide:navigation" class="w-3.5 h-3.5" />
            {{ barbershop.distance }}
          </div>
        </div>

        <!-- Arrow -->
        <div class="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:bg-amber-500 transition-all">
          <Icon name="lucide:arrow-right" class="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
        </div>
      </div>

      <!-- Services Preview -->
      <div class="mt-3 pt-3 border-t border-neutral-800">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span 
            v-for="service in barbershop.services.slice(0, 3)" 
            :key="service"
            class="px-2.5 py-1 rounded-lg bg-neutral-800/50 text-xs text-neutral-400 whitespace-nowrap"
          >
            {{ service }}
          </span>
          <span 
            v-if="barbershop.services.length > 3"
            class="text-xs text-amber-500 whitespace-nowrap"
          >
            +{{ barbershop.services.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Barbershop {
  id: string
  slug: string
  name: string
  logo: string
  coverImage: string
  address: string
  rating: number
  reviewCount: number
  distance: string
  isOpen: boolean
  isFavorite: boolean
  featured: boolean
  services: string[]
}

const props = defineProps<{
  barbershop: Barbershop
}>()

const emit = defineEmits<{
  (e: 'favorite', id: string): void
}>()

const toggleFavorite = () => {
  emit('favorite', props.barbershop.id)
}
</script>

