<template>
  <NuxtLink 
    :to="`/barbearia/${barbershop.slug}`"
    class="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 hover:border-amber-500/30 transition-all group"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <div class="w-16 h-16 rounded-xl overflow-hidden border border-neutral-700">
        <img 
          :src="barbershop.logo" 
          :alt="barbershop.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div 
        v-if="barbershop.featured"
        class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
      >
        <Icon name="lucide:crown" class="w-3.5 h-3.5 text-black" />
      </div>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <h3 class="font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
          {{ barbershop.name }}
        </h3>
        <span :class="['badge-status text-[10px] px-2 py-0.5', barbershop.isOpen ? 'open' : 'closed']">
          {{ barbershop.isOpen ? 'Aberto' : 'Fechado' }}
        </span>
      </div>
      
      <p class="text-sm text-neutral-500 truncate mb-1.5">
        {{ barbershop.address }}
      </p>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <Icon name="lucide:star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span class="text-sm font-medium text-white">{{ barbershop.rating }}</span>
        </div>
        <span class="text-neutral-700">•</span>
        <div class="flex items-center gap-1 text-amber-500">
          <Icon name="lucide:map-pin" class="w-3.5 h-3.5" />
          <span class="text-sm">{{ barbershop.distance }}</span>
        </div>
      </div>
    </div>

    <!-- Arrow -->
    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-neutral-800/50 flex items-center justify-center group-hover:bg-amber-500 transition-all">
      <Icon name="lucide:chevron-right" class="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Barbershop {
  id: string
  slug: string
  name: string
  logo: string
  address: string
  rating: number
  distance: string
  isOpen: boolean
  featured: boolean
}

defineProps<{
  barbershop: Barbershop
}>()
</script>

