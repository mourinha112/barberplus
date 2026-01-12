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
        @click="openAddModal"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Novo Serviço
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-neutral-800" />
            <div>
              <div class="w-24 h-4 bg-neutral-800 rounded mb-2" />
              <div class="w-16 h-3 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
        <div class="w-full h-4 bg-neutral-800 rounded mb-4" />
        <div class="w-3/4 h-4 bg-neutral-800 rounded mb-4" />
        <div class="flex justify-between pt-4 border-t border-neutral-800">
          <div class="w-20 h-6 bg-neutral-800 rounded" />
          <div class="w-16 h-6 bg-neutral-800 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredServices.length === 0" class="text-center py-16">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-800 flex items-center justify-center">
        <Icon name="lucide:scissors" class="w-10 h-10 text-neutral-600" />
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">Nenhum serviço cadastrado</h3>
      <p class="text-neutral-500 mb-6">Comece adicionando seus serviços para que seus clientes possam agendar.</p>
      <button 
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        @click="openAddModal"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Adicionar primeiro serviço
      </button>
    </div>

    <!-- Services Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="service in filteredServices" 
        :key="service.id"
        class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="getCategoryStyle(service.category).bgClass"
            >
              <Icon :name="getCategoryStyle(service.category).icon" class="w-6 h-6" :class="getCategoryStyle(service.category).iconClass" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">{{ service.name }}</h3>
              <span 
                class="px-2 py-0.5 rounded text-[10px] font-medium"
                :class="getCategoryClass(service.category)"
              >
                {{ service.category || 'Geral' }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              class="p-2 rounded-lg hover:bg-neutral-700"
              @click="openEditModal(service)"
            >
              <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
            </button>
            <button 
              class="p-2 rounded-lg hover:bg-neutral-700"
              @click="confirmDelete(service)"
            >
              <Icon name="lucide:trash" class="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        <p class="text-sm text-neutral-500 mb-4 line-clamp-2">{{ service.description || 'Sem descrição' }}</p>

        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center gap-2">
            <Icon name="lucide:clock" class="w-4 h-4 text-neutral-500" />
            <span class="text-sm text-neutral-400">{{ service.duration_minutes }} min</span>
          </div>
          <div v-if="service.is_featured" class="flex items-center gap-1">
            <Icon name="lucide:star" class="w-4 h-4 text-amber-500" />
            <span class="text-sm text-amber-500">Destaque</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div>
            <p class="text-2xl font-bold text-amber-400">R$ {{ formatPrice(service.price) }}</p>
            <p v-if="service.promotional_price" class="text-xs text-emerald-400">
              Promo: R$ {{ formatPrice(service.promotional_price) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span 
              class="px-2 py-1 rounded-lg text-xs font-medium"
              :class="service.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-neutral-400'"
            >
              {{ service.is_active ? 'Ativo' : 'Inativo' }}
            </span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                :checked="service.is_active" 
                class="sr-only peer" 
                @change="toggleService(service)"
              >
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
        <button 
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-sm hover:bg-neutral-700 transition-colors"
          @click="showCategoryModal = true"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          Nova Categoria
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="category in uniqueCategories" 
          :key="category"
          class="flex items-center gap-2 px-3 py-2 rounded-xl"
          :class="getCategoryClass(category)"
        >
          <span>{{ category }}</span>
          <span class="text-xs opacity-60">{{ getCategoryCount(category) }}</span>
        </div>
        <div v-if="uniqueCategories.length === 0" class="text-neutral-500 text-sm">
          Nenhuma categoria ainda
        </div>
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">
          {{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}
        </h2>
        <form @submit.prevent="saveService" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome do serviço *</label>
            <input 
              v-model="serviceForm.name"
              type="text"
              placeholder="Ex: Corte Degradê"
              required
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Descrição</label>
            <textarea 
              v-model="serviceForm.description"
              rows="3"
              placeholder="Descreva o serviço..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Preço (R$) *</label>
              <input 
                v-model="serviceForm.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                required
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Duração (min) *</label>
              <input 
                v-model="serviceForm.duration"
                type="number"
                min="5"
                step="5"
                placeholder="30"
                required
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Preço promocional</label>
              <input 
                v-model="serviceForm.promotionalPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Categoria</label>
              <select 
                v-model="serviceForm.category"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
              >
                <option value="">Selecione...</option>
                <option v-for="cat in defaultCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="serviceForm.isFeatured" class="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
              <span class="text-sm text-neutral-400">Serviço em destaque</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="serviceForm.requiresDeposit" class="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
              <span class="text-sm text-neutral-400">Requer depósito</span>
            </label>
          </div>
          
          <!-- Error message -->
          <div v-if="formError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-sm text-red-400">{{ formError }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Salvando...' : (editingService ? 'Salvar' : 'Adicionar') }}
            </button>
          </div>
        </form>
      </div>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Excluir serviço?</h3>
        <p class="text-neutral-400 mb-6">
          Tem certeza que deseja excluir <strong>{{ deletingService?.name }}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-center gap-3">
          <button 
            class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button 
            class="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors flex items-center gap-2"
            :disabled="deleting"
            @click="deleteService"
          >
            <Icon v-if="deleting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </UModal>

    <!-- Category Modal -->
    <UModal v-model="showCategoryModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Nova Categoria</h2>
        <form @submit.prevent="addCategory" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome da categoria</label>
            <input 
              v-model="newCategory"
              type="text"
              placeholder="Ex: Tratamentos"
              required
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button 
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="showCategoryModal = false"
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

const { currentBarbershop, authHeaders } = useAuth()

const activeTab = ref('all')
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const showCategoryModal = ref(false)
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const formError = ref('')
const newCategory = ref('')

const services = ref<any[]>([])
const editingService = ref<any>(null)
const deletingService = ref<any>(null)

const tabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Cortes', value: 'Corte' },
  { label: 'Barba', value: 'Barba' },
  { label: 'Combos', value: 'Combo' },
  { label: 'Tratamentos', value: 'Tratamento' }
]

const defaultCategories = ['Corte', 'Barba', 'Combo', 'Tratamento', 'Químico', 'Pigmentação', 'Massagem']

const serviceForm = ref({
  name: '',
  description: '',
  price: '',
  duration: 30,
  category: '',
  promotionalPrice: '',
  isFeatured: false,
  requiresDeposit: false
})

// Fetch services
const fetchServices = async () => {
  if (!currentBarbershop.value?.id) return
  
  loading.value = true
  try {
    const response = await $fetch<any>('/api/painel/services', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    
    if (response.success) {
      services.value = response.data
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
  } finally {
    loading.value = false
  }
}

// Watch for barbershop changes
watch(() => currentBarbershop.value?.id, fetchServices, { immediate: true })

const filteredServices = computed(() => {
  if (activeTab.value === 'all') return services.value
  return services.value.filter(s => s.category === activeTab.value)
})

const uniqueCategories = computed(() => {
  const categories = services.value.map(s => s.category).filter(Boolean)
  return [...new Set(categories)]
})

const getCategoryCount = (category: string) => {
  return services.value.filter(s => s.category === category).length
}

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',')
}

const getCategoryStyle = (category: string) => {
  const styles: Record<string, { icon: string; bgClass: string; iconClass: string }> = {
    'Corte': { icon: 'lucide:scissors', bgClass: 'bg-blue-500/20', iconClass: 'text-blue-500' },
    'Barba': { icon: 'mdi:face-man-shimmer', bgClass: 'bg-amber-500/20', iconClass: 'text-amber-500' },
    'Combo': { icon: 'lucide:package', bgClass: 'bg-violet-500/20', iconClass: 'text-violet-500' },
    'Tratamento': { icon: 'lucide:sparkles', bgClass: 'bg-emerald-500/20', iconClass: 'text-emerald-500' },
    'Químico': { icon: 'lucide:flask-conical', bgClass: 'bg-pink-500/20', iconClass: 'text-pink-500' },
    'Pigmentação': { icon: 'lucide:palette', bgClass: 'bg-cyan-500/20', iconClass: 'text-cyan-500' },
    'Massagem': { icon: 'lucide:hand', bgClass: 'bg-orange-500/20', iconClass: 'text-orange-500' }
  }
  return styles[category] || { icon: 'lucide:scissors', bgClass: 'bg-neutral-700', iconClass: 'text-neutral-400' }
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    'Corte': 'bg-blue-500/20 text-blue-400',
    'Barba': 'bg-amber-500/20 text-amber-400',
    'Combo': 'bg-violet-500/20 text-violet-400',
    'Tratamento': 'bg-emerald-500/20 text-emerald-400',
    'Químico': 'bg-pink-500/20 text-pink-400',
    'Pigmentação': 'bg-cyan-500/20 text-cyan-400',
    'Massagem': 'bg-orange-500/20 text-orange-400'
  }
  return classes[category] || 'bg-neutral-700 text-neutral-400'
}

const openAddModal = () => {
  editingService.value = null
  serviceForm.value = {
    name: '',
    description: '',
    price: '',
    duration: 30,
    category: '',
    promotionalPrice: '',
    isFeatured: false,
    requiresDeposit: false
  }
  formError.value = ''
  showAddModal.value = true
}

const openEditModal = (service: any) => {
  editingService.value = service
  serviceForm.value = {
    name: service.name,
    description: service.description || '',
    price: service.price.toString(),
    duration: service.duration_minutes,
    category: service.category || '',
    promotionalPrice: service.promotional_price?.toString() || '',
    isFeatured: service.is_featured,
    requiresDeposit: service.requires_deposit
  }
  formError.value = ''
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingService.value = null
}

const saveService = async () => {
  if (!currentBarbershop.value?.id) return
  
  formError.value = ''
  saving.value = true

  try {
    const payload = {
      barbershopId: currentBarbershop.value.id,
      name: serviceForm.value.name,
      description: serviceForm.value.description || null,
      category: serviceForm.value.category || null,
      price: parseFloat(serviceForm.value.price),
      promotionalPrice: serviceForm.value.promotionalPrice ? parseFloat(serviceForm.value.promotionalPrice) : null,
      durationMinutes: serviceForm.value.duration,
      isFeatured: serviceForm.value.isFeatured,
      requiresDeposit: serviceForm.value.requiresDeposit
    }

    if (editingService.value) {
      // Update
      await $fetch(`/api/painel/services/${editingService.value.id}`, {
        method: 'PATCH',
        body: payload,
        headers: authHeaders.value
      })
    } else {
      // Create
      await $fetch('/api/painel/services', {
        method: 'POST',
        body: payload,
        headers: authHeaders.value
      })
    }

    await fetchServices()
    closeModal()
  } catch (error: any) {
    formError.value = error.data?.message || 'Erro ao salvar serviço'
  } finally {
    saving.value = false
  }
}

const confirmDelete = (service: any) => {
  deletingService.value = service
  showDeleteModal.value = true
}

const deleteService = async () => {
  if (!deletingService.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/painel/services/${deletingService.value.id}`, {
      method: 'DELETE',
      headers: authHeaders.value
    })
    
    await fetchServices()
    showDeleteModal.value = false
    deletingService.value = null
  } catch (error: any) {
    console.error('Erro ao excluir:', error)
  } finally {
    deleting.value = false
  }
}

const toggleService = async (service: any) => {
  try {
    await $fetch(`/api/painel/services/${service.id}`, {
      method: 'PATCH',
      body: {
        barbershopId: currentBarbershop.value?.id,
        isActive: !service.is_active
      },
      headers: authHeaders.value
    })
    
    service.is_active = !service.is_active
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

const addCategory = () => {
  if (newCategory.value && !defaultCategories.includes(newCategory.value)) {
    defaultCategories.push(newCategory.value)
  }
  newCategory.value = ''
  showCategoryModal.value = false
}

useSeoMeta({
  title: 'Serviços - Painel BarberPlus'
})
</script>
