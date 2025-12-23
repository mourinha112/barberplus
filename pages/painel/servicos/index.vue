<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div class="flex items-center gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            activeTab === tab.value 
              ? 'bg-amber-500 text-black' 
              : 'bg-neutral-800 text-neutral-400 hover:text-white'
          ]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
      <button 
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        @click="showAddModal = true"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Novo Serviço
      </button>
    </div>

    <!-- Services Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="service in filteredServices" 
        :key="service.id"
        class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="service.iconBg"
            >
              <Icon :name="service.icon" class="w-6 h-6" :class="service.iconColor" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">{{ service.name }}</h3>
              <span 
                class="px-2 py-0.5 rounded text-[10px] font-medium"
                :class="getCategoryClass(service.category)"
              >
                {{ service.category }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-2 rounded-lg hover:bg-neutral-700">
              <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
            </button>
            <button class="p-2 rounded-lg hover:bg-neutral-700">
              <Icon name="lucide:trash" class="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        <p class="text-sm text-neutral-500 mb-4 line-clamp-2">{{ service.description }}</p>

        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center gap-2">
            <Icon name="lucide:clock" class="w-4 h-4 text-neutral-500" />
            <span class="text-sm text-neutral-400">{{ service.duration }} min</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="lucide:trending-up" class="w-4 h-4 text-emerald-500" />
            <span class="text-sm text-neutral-400">{{ service.monthlyBookings }}x/mês</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div>
            <p class="text-2xl font-bold text-amber-400">R$ {{ service.price }}</p>
            <p v-if="service.commission" class="text-xs text-neutral-500">Comissão: {{ service.commission }}%</p>
          </div>
          <div class="flex items-center gap-2">
            <span 
              class="px-2 py-1 rounded-lg text-xs font-medium"
              :class="service.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-neutral-400'"
            >
              {{ service.active ? 'Ativo' : 'Inativo' }}
            </span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="service.active" class="sr-only peer" @change="toggleService(service)">
              <div class="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Management -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Categorias</h3>
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-sm hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Nova Categoria
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="category in categories" 
          :key="category.name"
          class="flex items-center gap-2 px-3 py-2 rounded-xl"
          :class="category.bgClass"
        >
          <span :class="category.textClass">{{ category.name }}</span>
          <span class="text-xs text-neutral-500">{{ category.count }}</span>
          <button class="p-1 rounded hover:bg-black/20">
            <Icon name="lucide:x" class="w-3 h-3" :class="category.textClass" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add Service Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Novo Serviço</h2>
        <form @submit.prevent="addService" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome do serviço</label>
            <input 
              v-model="newService.name"
              type="text"
              placeholder="Ex: Corte Degradê"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Descrição</label>
            <textarea 
              v-model="newService.description"
              rows="3"
              placeholder="Descreva o serviço..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Preço (R$)</label>
              <input 
                v-model="newService.price"
                type="number"
                placeholder="0,00"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Duração (min)</label>
              <input 
                v-model="newService.duration"
                type="number"
                placeholder="30"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Categoria</label>
            <select 
              v-model="newService.category"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="showAddModal = false"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const activeTab = ref('all')
const showAddModal = ref(false)

const tabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Cortes', value: 'Corte' },
  { label: 'Barba', value: 'Barba' },
  { label: 'Combos', value: 'Combo' },
  { label: 'Tratamentos', value: 'Tratamento' }
]

const categories = [
  { name: 'Corte', count: 5, bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
  { name: 'Barba', count: 3, bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
  { name: 'Combo', count: 4, bgClass: 'bg-violet-500/20', textClass: 'text-violet-400' },
  { name: 'Tratamento', count: 3, bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' }
]

const services = ref([
  { id: '1', name: 'Corte Degradê', description: 'Corte moderno com degradê perfeito nas laterais', price: '55', duration: 30, category: 'Corte', icon: 'lucide:scissors', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500', monthlyBookings: 142, commission: 50, active: true },
  { id: '2', name: 'Corte Social', description: 'Corte clássico e elegante para todas as ocasiões', price: '50', duration: 30, category: 'Corte', icon: 'lucide:scissors', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500', monthlyBookings: 89, commission: 50, active: true },
  { id: '3', name: 'Barba Completa', description: 'Barba aparada e desenhada com navalha', price: '35', duration: 25, category: 'Barba', icon: 'mdi:face-man-shimmer', iconBg: 'bg-amber-500/20', iconColor: 'text-amber-500', monthlyBookings: 67, commission: 50, active: true },
  { id: '4', name: 'Corte + Barba', description: 'Combo de corte de cabelo e barba completa', price: '70', duration: 50, category: 'Combo', icon: 'lucide:package', iconBg: 'bg-violet-500/20', iconColor: 'text-violet-500', monthlyBookings: 156, commission: 45, active: true },
  { id: '5', name: 'Combo Premium', description: 'Corte, barba, sobrancelha e hidratação facial', price: '120', duration: 90, category: 'Combo', icon: 'lucide:crown', iconBg: 'bg-violet-500/20', iconColor: 'text-violet-500', monthlyBookings: 45, commission: 45, active: true },
  { id: '6', name: 'Hidratação Capilar', description: 'Tratamento intensivo para cabelos ressecados', price: '60', duration: 40, category: 'Tratamento', icon: 'lucide:droplet', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-500', monthlyBookings: 23, commission: 40, active: true },
  { id: '7', name: 'Relaxamento', description: 'Redução de volume com produtos profissionais', price: '100', duration: 60, category: 'Tratamento', icon: 'lucide:sparkles', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-500', monthlyBookings: 18, commission: 40, active: true },
  { id: '8', name: 'Pigmentação', description: 'Preenchimento e correção de falhas na barba', price: '80', duration: 45, category: 'Tratamento', icon: 'lucide:palette', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-500', monthlyBookings: 12, commission: 40, active: false },
  { id: '9', name: 'Corte Infantil', description: 'Corte especial para crianças até 12 anos', price: '35', duration: 25, category: 'Corte', icon: 'lucide:baby', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500', monthlyBookings: 34, commission: 50, active: true }
])

const filteredServices = computed(() => {
  if (activeTab.value === 'all') return services.value
  return services.value.filter(s => s.category === activeTab.value)
})

const newService = ref({
  name: '',
  description: '',
  price: '',
  duration: 30,
  category: 'Corte'
})

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    'Corte': 'bg-blue-500/20 text-blue-400',
    'Barba': 'bg-amber-500/20 text-amber-400',
    'Combo': 'bg-violet-500/20 text-violet-400',
    'Tratamento': 'bg-emerald-500/20 text-emerald-400'
  }
  return classes[category] || 'bg-neutral-700 text-neutral-400'
}

const toggleService = (service: any) => {
  service.active = !service.active
}

const addService = () => {
  // Add service logic
  showAddModal.value = false
}

useSeoMeta({
  title: 'Serviços - Painel BarberPlus'
})
</script>

