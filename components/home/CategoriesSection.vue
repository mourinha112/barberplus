<template>
  <section class="py-6">
    <div class="container-app">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-display text-xl font-semibold text-white">
            Categorias
          </h2>
          <p class="text-sm text-neutral-500 mt-0.5">O que você procura?</p>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-4 md:grid-cols-8 gap-3">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-item group"
          @click="selectCategory(category.id)"
        >
          <div 
            class="category-icon"
            :style="{ background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)` }"
          >
            <Icon :name="category.icon" class="w-6 h-6" :style="{ color: category.color }" />
          </div>
          <span class="text-xs text-neutral-400 group-hover:text-white transition-colors text-center leading-tight mt-2">
            {{ category.name }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const categories = [
  { id: 'haircut', name: 'Corte', icon: 'lucide:scissors', color: '#f59e0b' },
  { id: 'beard', name: 'Barba', icon: 'mdi:mustache', color: '#ef4444' },
  { id: 'combo', name: 'Combo', icon: 'lucide:sparkles', color: '#8b5cf6' },
  { id: 'eyebrow', name: 'Sobrancelha', icon: 'lucide:eye', color: '#06b6d4' },
  { id: 'shave', name: 'Barbear', icon: 'mdi:razor-single-edge', color: '#10b981' },
  { id: 'kids', name: 'Infantil', icon: 'lucide:baby', color: '#f472b6' },
  { id: 'relax', name: 'Relaxar', icon: 'lucide:leaf', color: '#22c55e' },
  { id: 'more', name: 'Mais', icon: 'lucide:more-horizontal', color: '#737373' }
]

const emit = defineEmits<{
  (e: 'select', categoryId: string): void
}>()

const selectCategory = (id: string) => {
  emit('select', id)
}
</script>

<style scoped>
.category-item {
  @apply flex flex-col items-center p-2 rounded-2xl transition-all duration-300;
}

.category-item:hover {
  @apply bg-neutral-900/50;
}

.category-icon {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border border-transparent;
}

.category-item:hover .category-icon {
  @apply scale-110 border-current;
  border-color: currentColor;
}
</style>

