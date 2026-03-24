<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div class="relative flex-1 max-w-md">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar cliente por nome ou telefone..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
          @input="debouncedSearch"
        />
      </div>
      <button
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        @click="openAddModal"
      >
        <Icon name="lucide:user-plus" class="w-4 h-4" />
        Novo Cliente
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p class="text-xs text-neutral-500 mb-1">Total de clientes</p>
          <p class="text-2xl font-bold text-white">{{ pagination.total }}</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p class="text-xs text-neutral-500 mb-1">Com telefone</p>
          <p class="text-2xl font-bold text-emerald-400">{{ clients.filter(c => c.phone).length }}</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p class="text-xs text-neutral-500 mb-1">Com email</p>
          <p class="text-2xl font-bold text-amber-400">{{ clients.filter(c => c.email).length }}</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p class="text-xs text-neutral-500 mb-1">Exibindo</p>
          <p class="text-2xl font-bold text-white">{{ clients.length }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="clients.length === 0 && !searchQuery" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-800 flex items-center justify-center">
          <Icon name="lucide:users" class="w-10 h-10 text-neutral-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Nenhum cliente cadastrado</h3>
        <p class="text-neutral-500 mb-6">Comece adicionando seus clientes.</p>
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="openAddModal"
        >
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          Adicionar primeiro cliente
        </button>
      </div>

      <div v-else-if="clients.length === 0 && searchQuery" class="text-center py-16">
        <p class="text-neutral-500">Nenhum cliente encontrado para "{{ searchQuery }}"</p>
      </div>

      <!-- Clients Table -->
      <div v-else class="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-800">
                <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Cliente</th>
                <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Contato</th>
                <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Última visita</th>
                <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Total gasto</th>
                <th class="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800">
              <tr
                v-for="client in clients"
                :key="client.id"
                class="hover:bg-neutral-800/30 transition-colors cursor-pointer"
                @click="openClientDetail(client)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                      <img v-if="client.avatar_url" :src="client.avatar_url" :alt="client.name" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:user" class="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">{{ client.name }}</p>
                      <p class="text-xs text-neutral-500">{{ client.total_visits || 0 }} visitas</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-neutral-300">{{ client.phone || '-' }}</p>
                  <p class="text-xs text-neutral-500">{{ client.email || '-' }}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-neutral-300">{{ client.last_visit ? formatDate(client.last_visit) : 'Nunca' }}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-semibold text-emerald-400">R$ {{ Number(client.total_spent || 0).toFixed(2).replace('.', ',') }}</p>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="client.phone"
                      class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                      @click.stop="sendWhatsApp(client)"
                    >
                      <Icon name="mdi:whatsapp" class="w-4 h-4 text-emerald-500" />
                    </button>
                    <button
                      class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                      @click.stop="openEditModal(client)"
                    >
                      <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Add/Edit Client Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">
          {{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}
        </h2>
        <form @submit.prevent="saveClient" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome completo *</label>
            <input
              v-model="clientForm.name"
              type="text"
              placeholder="Nome do cliente"
              required
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Telefone</label>
              <input
                v-model="clientForm.phone"
                type="tel"
                placeholder="(79) 99999-9999"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Email</label>
              <input
                v-model="clientForm.email"
                type="email"
                placeholder="email@exemplo.com"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Data de nascimento</label>
            <input
              v-model="clientForm.birthDate"
              type="date"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Observações</label>
            <textarea
              v-model="clientForm.notes"
              rows="2"
              placeholder="Preferências, alergias, observações..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
            />
          </div>

          <div v-if="formError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-sm text-red-400">{{ formError }}</p>
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
              :disabled="saving"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Salvando...' : (editingClient ? 'Salvar' : 'Adicionar') }}
            </button>
          </div>
        </form>
      </div>
    </UModal>

    <!-- Client Detail Modal -->
    <UModal v-model="showClientModal" :ui="{ width: 'max-w-2xl' }">
      <div class="p-6" v-if="selectedClient">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 flex items-center justify-center">
            <img v-if="selectedClient.avatar_url" :src="selectedClient.avatar_url" :alt="selectedClient.name" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:user" class="w-8 h-8 text-neutral-500" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-white">{{ selectedClient.name }}</h2>
            <p v-if="selectedClient.created_at" class="text-sm text-neutral-500">Cliente desde {{ formatDate(selectedClient.created_at) }}</p>
            <div class="flex items-center gap-4 mt-2">
              <span v-if="selectedClient.phone" class="flex items-center gap-1 text-sm text-neutral-400">
                <Icon name="lucide:phone" class="w-4 h-4" />
                {{ selectedClient.phone }}
              </span>
              <span v-if="selectedClient.email" class="flex items-center gap-1 text-sm text-neutral-400">
                <Icon name="lucide:mail" class="w-4 h-4" />
                {{ selectedClient.email }}
              </span>
            </div>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-neutral-800"
            @click="showClientModal = false"
          >
            <Icon name="lucide:x" class="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-white">{{ selectedClient.total_visits || 0 }}</p>
            <p class="text-xs text-neutral-500">Visitas</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-emerald-400">R$ {{ Number(selectedClient.total_spent || 0).toFixed(2).replace('.', ',') }}</p>
            <p class="text-xs text-neutral-500">Total gasto</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-amber-400">{{ selectedClient.loyalty_points || 0 }}</p>
            <p class="text-xs text-neutral-500">Fidelidade</p>
          </div>
        </div>

        <div v-if="selectedClient.notes" class="p-4 rounded-xl bg-neutral-800/50 mb-6">
          <p class="text-xs text-neutral-500 mb-1">Observações</p>
          <p class="text-sm text-neutral-300">{{ selectedClient.notes }}</p>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-neutral-800">
          <button
            v-if="selectedClient.phone"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            @click="sendWhatsApp(selectedClient)"
          >
            <Icon name="mdi:whatsapp" class="w-5 h-5" />
            WhatsApp
          </button>
          <button
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
            @click="showClientModal = false; openEditModal(selectedClient)"
          >
            <Icon name="lucide:edit" class="w-5 h-5" />
            Editar
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const { currentBarbershop, authHeaders } = useAuth()

const searchQuery = ref('')
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const showClientModal = ref(false)
const formError = ref('')

const clients = ref<any[]>([])
const selectedClient = ref<any>(null)
const editingClient = ref<any>(null)
const pagination = ref({ total: 0, page: 1, totalPages: 0 })

const clientForm = ref({
  name: '',
  phone: '',
  email: '',
  birthDate: '',
  notes: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchClients()
  }, 400)
}

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

// Fetch clients from API
const fetchClients = async () => {
  if (!currentBarbershop.value?.id) return

  loading.value = true
  try {
    const response = await $fetch<any>('/api/painel/clients', {
      query: {
        barbershopId: currentBarbershop.value.id,
        search: searchQuery.value || undefined
      },
      headers: authHeaders.value
    })

    if (response.success) {
      clients.value = response.data || []
      pagination.value = response.pagination || { total: clients.value.length, page: 1, totalPages: 1 }
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    clients.value = []
  } finally {
    loading.value = false
  }
}

// Open add modal
const openAddModal = () => {
  editingClient.value = null
  clientForm.value = {
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: ''
  }
  formError.value = ''
  showAddModal.value = true
}

// Open edit modal
const openEditModal = (client: any) => {
  editingClient.value = client
  clientForm.value = {
    name: client.name || '',
    phone: client.phone || '',
    email: client.email || '',
    birthDate: client.birth_date || '',
    notes: client.notes || ''
  }
  formError.value = ''
  showAddModal.value = true
}

// Save client
const saveClient = async () => {
  if (!currentBarbershop.value?.id) return

  if (!clientForm.value.name.trim()) {
    formError.value = 'Nome é obrigatório'
    return
  }

  formError.value = ''
  saving.value = true

  try {
    const payload = {
      barbershopId: currentBarbershop.value.id,
      name: clientForm.value.name,
      phone: clientForm.value.phone || null,
      email: clientForm.value.email || null,
      birthDate: clientForm.value.birthDate || null,
      notes: clientForm.value.notes || null
    }

    if (editingClient.value) {
      await $fetch(`/api/painel/clients/${editingClient.value.id}`, {
        method: 'PATCH',
        body: payload,
        headers: authHeaders.value
      })
    } else {
      await $fetch('/api/painel/clients', {
        method: 'POST',
        body: payload,
        headers: authHeaders.value
      })
    }

    showAddModal.value = false
    await fetchClients()
  } catch (error: any) {
    formError.value = error.data?.message || 'Erro ao salvar cliente'
  } finally {
    saving.value = false
  }
}

// Open client detail
const openClientDetail = (client: any) => {
  selectedClient.value = client
  showClientModal.value = true
}

// Send WhatsApp
const sendWhatsApp = (client: any) => {
  if (!client.phone) return
  const phone = client.phone.replace(/\D/g, '')
  window.open(`https://wa.me/55${phone}`, '_blank')
}

// Watch barbershop changes
watch(() => currentBarbershop.value?.id, (id) => {
  if (id) fetchClients()
}, { immediate: true })

useSeoMeta({
  title: 'Clientes - Painel BarberPlus'
})
</script>
