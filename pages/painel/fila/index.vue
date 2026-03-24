<template>
  <div class="space-y-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:users" class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ waitingQueue.length }}</p>
        <p class="text-sm text-neutral-500">Na fila agora</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:clock" class="w-6 h-6 text-amber-500" />
        </div>
        <p class="text-3xl font-bold text-amber-400">~{{ averageWait }} min</p>
        <p class="text-sm text-neutral-500">Tempo médio de espera</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:check-circle" class="w-6 h-6 text-emerald-500" />
        </div>
        <p class="text-3xl font-bold text-emerald-400">{{ servingNow.length }}</p>
        <p class="text-sm text-neutral-500">Atendendo agora</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:timer" class="w-6 h-6 text-violet-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ queue.length }}</p>
        <p class="text-sm text-neutral-500">Total na fila hoje</p>
      </div>
    </div>

    <!-- Queue Actions -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="showAddModal = true"
        >
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          Adicionar à Fila
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <template v-else>
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Queue List -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Now Serving -->
          <div
            v-for="serving in servingNow"
            :key="serving.id"
            class="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/30"
          >
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold animate-pulse">ATENDENDO AGORA</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                <img v-if="serving.client?.avatar_url" :src="serving.client.avatar_url" :alt="serving.client_name" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-6 h-6 text-neutral-500" />
              </div>
              <div class="flex-1">
                <p class="text-lg font-semibold text-white">{{ serving.client?.name || serving.client_name }}</p>
                <p class="text-sm text-neutral-400">{{ serving.professional?.name || 'Profissional' }}</p>
              </div>
              <button
                class="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
                @click="updateQueueStatus(serving.id, 'completed')"
              >
                Finalizar
              </button>
            </div>
          </div>

          <!-- Queue Items -->
          <div class="space-y-3">
            <div
              v-for="(person, index) in waitingQueue"
              :key="person.id"
              class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
              :class="{ 'ring-2 ring-amber-500/50': index === 0 }"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  :class="index === 0 ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ index + 1 }}
                </div>
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                  <img v-if="person.client?.avatar_url" :src="person.client.avatar_url" :alt="person.client_name" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:user" class="w-6 h-6 text-neutral-500" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="font-medium text-white">{{ person.client?.name || person.client_name }}</p>
                  </div>
                  <p class="text-sm text-neutral-500">{{ person.professional?.name || 'Qualquer profissional' }}</p>
                  <div class="flex items-center gap-3 mt-1">
                    <span class="text-xs text-neutral-600">Espera: ~{{ person.estimatedWaitMinutes || 0 }} min</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="index === 0"
                    class="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                    @click="updateQueueStatus(person.id, 'in_service')"
                  >
                    Chamar
                  </button>
                  <button
                    v-if="person.client_phone || person.client?.phone"
                    class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    @click="sendWhatsApp(person)"
                  >
                    <Icon name="mdi:whatsapp" class="w-5 h-5 text-emerald-500" />
                  </button>
                  <button
                    class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    @click="removeFromQueue(person.id)"
                  >
                    <Icon name="lucide:x" class="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="waitingQueue.length === 0 && servingNow.length === 0" class="text-center py-12">
            <div class="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:check-circle" class="w-10 h-10 text-emerald-500" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Fila vazia!</h3>
            <p class="text-sm text-neutral-500">Nenhum cliente aguardando no momento.</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Professionals Status -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 class="text-lg font-semibold text-white mb-4">Profissionais</h3>
            <div class="space-y-3">
              <div
                v-for="professional in professionalsList"
                :key="professional.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
              >
                <div class="w-10 h-10 rounded-xl overflow-hidden bg-neutral-700 flex items-center justify-center">
                  <img v-if="professional.avatar_url" :src="professional.avatar_url" :alt="professional.name" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:user" class="w-5 h-5 text-neutral-400" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                </div>
              </div>
              <p v-if="professionalsList.length === 0" class="text-sm text-neutral-500 text-center py-4">Nenhum profissional</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Add to Queue Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Adicionar à Fila</h2>
        <form @submit.prevent="addToQueue" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Cliente existente</label>
            <select
              v-model="newQueueEntry.clientId"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Novo cliente (preencher abaixo)</option>
              <option v-for="c in clientsList" :key="c.id" :value="c.id">{{ c.name }} - {{ c.phone || 'Sem telefone' }}</option>
            </select>
          </div>
          <div v-if="!newQueueEntry.clientId">
            <label class="block text-sm text-neutral-400 mb-2">Nome *</label>
            <input
              v-model="newQueueEntry.name"
              type="text"
              placeholder="Nome do cliente"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div v-if="!newQueueEntry.clientId">
            <label class="block text-sm text-neutral-400 mb-2">Telefone</label>
            <input
              v-model="newQueueEntry.phone"
              type="tel"
              placeholder="(79) 99999-9999"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Profissional (opcional)</label>
            <select
              v-model="newQueueEntry.professionalId"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Qualquer disponível</option>
              <option v-for="p in professionalsList" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
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
              {{ saving ? 'Adicionando...' : 'Adicionar' }}
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

const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const formError = ref('')

const queue = ref<any[]>([])
const professionalsList = ref<any[]>([])
const clientsList = ref<any[]>([])

const newQueueEntry = ref({
  clientId: '',
  name: '',
  phone: '',
  professionalId: ''
})

// Computed
const waitingQueue = computed(() => queue.value.filter(q => q.status === 'waiting' || q.status === 'called'))
const servingNow = computed(() => queue.value.filter(q => q.status === 'in_service'))
const averageWait = computed(() => {
  if (waitingQueue.value.length === 0) return 0
  const total = waitingQueue.value.reduce((acc, q) => acc + (q.estimatedWaitMinutes || 0), 0)
  return Math.round(total / waitingQueue.value.length)
})

// Fetch queue
const fetchQueue = async () => {
  if (!currentBarbershop.value?.id) return

  loading.value = true
  try {
    const response = await $fetch<any>('/api/painel/queue', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    if (response.success) {
      queue.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar fila:', error)
    queue.value = []
  } finally {
    loading.value = false
  }
}

// Fetch professionals
const fetchProfessionals = async () => {
  if (!currentBarbershop.value?.id) return
  try {
    const response = await $fetch<any>('/api/painel/professionals', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    if (response.success) {
      professionalsList.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
  }
}

// Fetch clients
const fetchClients = async () => {
  if (!currentBarbershop.value?.id) return
  try {
    const response = await $fetch<any>('/api/painel/clients', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    if (response.success) {
      clientsList.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
  }
}

// Add to queue
const addToQueue = async () => {
  if (!currentBarbershop.value?.id) return

  const { clientId, name, phone, professionalId } = newQueueEntry.value

  if (!clientId && !name.trim()) {
    formError.value = 'Selecione um cliente ou informe o nome'
    return
  }

  formError.value = ''
  saving.value = true

  try {
    const selectedClient = clientId ? clientsList.value.find(c => c.id === clientId) : null

    await $fetch('/api/painel/queue', {
      method: 'POST',
      body: {
        barbershopId: currentBarbershop.value.id,
        clientId: clientId || null,
        professionalId: professionalId || null,
        clientName: selectedClient?.name || name,
        clientPhone: selectedClient?.phone || phone || null
      },
      headers: authHeaders.value
    })

    showAddModal.value = false
    newQueueEntry.value = { clientId: '', name: '', phone: '', professionalId: '' }
    await fetchQueue()
  } catch (error: any) {
    formError.value = error.data?.message || 'Erro ao adicionar à fila'
  } finally {
    saving.value = false
  }
}

// Update queue item status
const updateQueueStatus = async (id: string, status: string) => {
  try {
    await $fetch(`/api/painel/queue/${id}`, {
      method: 'PATCH',
      body: { status },
      headers: authHeaders.value
    })
    await fetchQueue()
  } catch (error) {
    console.error('Erro ao atualizar fila:', error)
  }
}

// Remove from queue
const removeFromQueue = async (id: string) => {
  try {
    await $fetch(`/api/painel/queue/${id}`, {
      method: 'DELETE',
      headers: authHeaders.value
    })
    await fetchQueue()
  } catch (error) {
    console.error('Erro ao remover da fila:', error)
  }
}

// Send WhatsApp
const sendWhatsApp = (person: any) => {
  const phone = (person.client_phone || person.client?.phone || '').replace(/\D/g, '')
  if (phone) {
    window.open(`https://wa.me/55${phone}`, '_blank')
  }
}

// Watch barbershop changes
watch(() => currentBarbershop.value?.id, async (id) => {
  if (id) {
    await Promise.all([fetchQueue(), fetchProfessionals(), fetchClients()])
  }
}, { immediate: true })

useSeoMeta({
  title: 'Fila Virtual - Painel BarberPlus'
})
</script>
