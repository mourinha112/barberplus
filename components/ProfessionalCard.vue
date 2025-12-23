<template>
  <div 
    class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer group text-center"
    @click="$emit('select', professional)"
  >
    <!-- Avatar -->
    <div class="relative mx-auto mb-3 w-20 h-20">
      <img 
        :src="professional.avatar" 
        :alt="professional.name"
        class="w-full h-full rounded-2xl object-cover border-2 border-neutral-700 group-hover:border-amber-500/50 transition-colors"
      />
      <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#171717] flex items-center justify-center">
        <Icon name="lucide:check" class="w-3 h-3 text-white" />
      </div>
    </div>

    <!-- Info -->
    <h4 class="font-semibold text-white group-hover:text-amber-400 transition-colors mb-0.5">
      {{ professional.name }}
    </h4>
    <p class="text-xs text-neutral-500 mb-2">{{ professional.role }}</p>

    <!-- Rating -->
    <div class="flex items-center justify-center gap-1 mb-3">
      <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
      <span class="text-sm font-medium text-white">{{ professional.rating }}</span>
      <span class="text-xs text-neutral-500">({{ professional.reviewCount }})</span>
    </div>

    <!-- Specialties -->
    <div class="flex flex-wrap justify-center gap-1">
      <span 
        v-for="specialty in professional.specialties.slice(0, 2)" 
        :key="specialty"
        class="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400"
      >
        {{ specialty }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Professional {
  id: string
  name: string
  avatar: string
  role: string
  rating: number
  reviewCount: number
  specialties: string[]
}

defineProps<{
  professional: Professional
}>()

defineEmits<{
  (e: 'select', professional: Professional): void
}>()
</script>

