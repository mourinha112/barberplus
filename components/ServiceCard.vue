<template>
  <div 
    class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer group"
    @click="$emit('select', service)"
  >
    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h4 class="font-medium text-white group-hover:text-amber-400 transition-colors">
          {{ service.name }}
        </h4>
        <span v-if="service.popular" class="badge-gold text-[10px] px-2 py-0.5">
          Popular
        </span>
      </div>
      <p class="text-sm text-neutral-500 mb-2 line-clamp-1">
        {{ service.description }}
      </p>
      <div class="flex items-center gap-3 text-xs text-neutral-400">
        <span class="flex items-center gap-1">
          <Icon name="lucide:clock" class="w-3.5 h-3.5" />
          {{ service.duration }} min
        </span>
      </div>
    </div>

    <!-- Price & Action -->
    <div class="flex flex-col items-end gap-2">
      <div class="text-right">
        <p class="text-lg font-bold text-gold-gradient">
          R$ {{ service.price.toFixed(2) }}
        </p>
      </div>
      <button class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
        <Icon name="lucide:plus" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  popular: boolean
}

defineProps<{
  service: Service
}>()

defineEmits<{
  (e: 'select', service: Service): void
}>()
</script>

