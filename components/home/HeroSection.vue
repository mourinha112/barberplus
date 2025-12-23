<template>
  <section class="relative py-8 overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px]" />
    </div>

    <div class="container-app relative">
      <!-- Greeting -->
      <div class="mb-6 fade-in-up">
        <p class="text-neutral-500 text-sm mb-1">{{ greeting }}</p>
        <h1 class="font-display text-3xl md:text-4xl font-semibold text-white">
          Seja bem-vindo<span class="text-gold-gradient">.</span>
        </h1>
        <p class="text-neutral-400 mt-2">{{ formattedDate }}</p>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-8 fade-in-up stagger-1 animate-hidden">
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Encontre uma barbearia..."
            class="input-premium pl-12 pr-24 py-4"
            @focus="showSearchSuggestions = true"
          />
          <button 
            class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
          >
            Buscar
          </button>
        </div>

        <!-- Search Suggestions -->
        <Transition name="slide-down">
          <div 
            v-if="showSearchSuggestions && searchQuery"
            class="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl glass-gold border border-amber-500/20 z-10"
          >
            <button 
              v-for="suggestion in filteredSuggestions" 
              :key="suggestion"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-colors text-left"
              @click="selectSuggestion(suggestion)"
            >
              <Icon name="lucide:search" class="w-4 h-4 text-amber-500" />
              <span class="text-sm text-neutral-300">{{ suggestion }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Quick Filters -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 fade-in-up stagger-2 animate-hidden">
        <button 
          v-for="filter in quickFilters" 
          :key="filter.id"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all',
            activeFilter === filter.id 
              ? 'bg-amber-500 text-black font-semibold' 
              : 'bg-neutral-900/50 border border-neutral-800 text-neutral-300 hover:border-amber-500/30'
          ]"
          @click="activeFilter = filter.id"
        >
          <Icon :name="filter.icon" class="w-4 h-4" />
          {{ filter.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const searchQuery = ref('')
const showSearchSuggestions = ref(false)
const activeFilter = ref('all')

const suggestions = [
  'Corte degradê',
  'Barba completa',
  'Corte + Barba',
  'Pigmentação',
  'Relaxamento capilar',
  'Sobrancelha'
]

const quickFilters = [
  { id: 'all', icon: 'lucide:layout-grid', label: 'Todos' },
  { id: 'nearby', icon: 'lucide:map-pin', label: 'Próximos' },
  { id: 'open', icon: 'lucide:clock', label: 'Abertos agora' },
  { id: 'top-rated', icon: 'lucide:star', label: 'Melhores' },
  { id: 'featured', icon: 'lucide:crown', label: 'Destaques' }
]

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const formattedDate = computed(() => {
  return format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })
})

const filteredSuggestions = computed(() => {
  return suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSearchSuggestions.value = false
}

// Close suggestions when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showSearchSuggestions.value = false
    }
  })
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

