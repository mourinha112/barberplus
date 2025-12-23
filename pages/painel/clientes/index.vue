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
        />
      </div>
      <button class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
        <Icon name="lucide:user-plus" class="w-4 h-4" />
        Novo Cliente
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <p class="text-xs text-neutral-500 mb-1">Total de clientes</p>
        <p class="text-2xl font-bold text-white">248</p>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <p class="text-xs text-neutral-500 mb-1">Novos este mês</p>
        <p class="text-2xl font-bold text-emerald-400">+23</p>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <p class="text-xs text-neutral-500 mb-1">Clientes fiéis</p>
        <p class="text-2xl font-bold text-amber-400">67</p>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <p class="text-xs text-neutral-500 mb-1">Ticket médio</p>
        <p class="text-2xl font-bold text-white">R$ 72</p>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-800">
              <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Cliente</th>
              <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Contato</th>
              <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Última visita</th>
              <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Total gasto</th>
              <th class="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Fidelidade</th>
              <th class="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr 
              v-for="client in filteredClients" 
              :key="client.id"
              class="hover:bg-neutral-800/30 transition-colors cursor-pointer"
              @click="openClientDetail(client)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800">
                    <img :src="client.avatar" :alt="client.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ client.name }}</p>
                    <p class="text-xs text-neutral-500">{{ client.totalVisits }} visitas</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-neutral-300">{{ client.phone }}</p>
                <p class="text-xs text-neutral-500">{{ client.email }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-neutral-300">{{ client.lastVisit }}</p>
                <p class="text-xs text-neutral-500">{{ client.lastService }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-emerald-400">R$ {{ client.totalSpent }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 max-w-[80px]">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs text-neutral-500">{{ client.loyaltyPoints }}/10</span>
                    </div>
                    <div class="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div 
                        class="h-full bg-amber-500 rounded-full"
                        :style="{ width: `${(client.loyaltyPoints / 10) * 100}%` }"
                      />
                    </div>
                  </div>
                  <Icon 
                    v-if="client.loyaltyPoints >= 10" 
                    name="lucide:gift" 
                    class="w-4 h-4 text-amber-500" 
                  />
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    @click.stop="sendWhatsApp(client)"
                  >
                    <Icon name="mdi:whatsapp" class="w-4 h-4 text-emerald-500" />
                  </button>
                  <button 
                    class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    @click.stop="bookClient(client)"
                  >
                    <Icon name="lucide:calendar-plus" class="w-4 h-4 text-amber-500" />
                  </button>
                  <button class="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                    <Icon name="lucide:more-vertical" class="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Client Detail Modal -->
    <UModal v-model="showClientModal" :ui="{ width: 'max-w-2xl' }">
      <div class="p-6" v-if="selectedClient">
        <!-- Header -->
        <div class="flex items-start gap-4 mb-6">
          <div class="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800">
            <img :src="selectedClient.avatar" :alt="selectedClient.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-white">{{ selectedClient.name }}</h2>
            <p class="text-sm text-neutral-500">Cliente desde {{ selectedClient.since }}</p>
            <div class="flex items-center gap-4 mt-2">
              <span class="flex items-center gap-1 text-sm text-neutral-400">
                <Icon name="lucide:phone" class="w-4 h-4" />
                {{ selectedClient.phone }}
              </span>
              <span class="flex items-center gap-1 text-sm text-neutral-400">
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

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-white">{{ selectedClient.totalVisits }}</p>
            <p class="text-xs text-neutral-500">Visitas</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-emerald-400">R$ {{ selectedClient.totalSpent }}</p>
            <p class="text-xs text-neutral-500">Total gasto</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-800/50 text-center">
            <p class="text-2xl font-bold text-amber-400">{{ selectedClient.loyaltyPoints }}/10</p>
            <p class="text-xs text-neutral-500">Fidelidade</p>
          </div>
        </div>

        <!-- Histórico de Cortes -->
        <div>
          <h3 class="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
            <Icon name="lucide:history" class="w-4 h-4" />
            Histórico de Cortes
          </h3>
          <div class="space-y-3">
            <div 
              v-for="cut in selectedClient.cutHistory" 
              :key="cut.id"
              class="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50"
            >
              <div class="w-16 h-16 rounded-xl bg-neutral-700 overflow-hidden flex-shrink-0">
                <img v-if="cut.photo" :src="cut.photo" alt="Corte" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="lucide:image" class="w-6 h-6 text-neutral-600" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ cut.service }}</p>
                <p class="text-xs text-neutral-500">{{ cut.date }} • {{ cut.professional }}</p>
                <p v-if="cut.notes" class="text-xs text-amber-400 mt-1 italic">"{{ cut.notes }}"</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-white">R$ {{ cut.price }}</p>
                <button class="text-xs text-amber-500 hover:text-amber-400 mt-1">
                  Repetir corte
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-800">
          <button class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
            <Icon name="mdi:whatsapp" class="w-5 h-5" />
            WhatsApp
          </button>
          <button class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
            <Icon name="lucide:calendar-plus" class="w-5 h-5" />
            Agendar
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

const searchQuery = ref('')
const showClientModal = ref(false)
const selectedClient = ref<any>(null)

const clients = ref([
  {
    id: '1',
    name: 'João Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    phone: '(79) 99999-1234',
    email: 'joao@email.com',
    lastVisit: '20/12/2024',
    lastService: 'Corte + Barba',
    totalVisits: 24,
    totalSpent: 1680,
    loyaltyPoints: 8,
    since: 'Mar/2024',
    cutHistory: [
      { id: '1', service: 'Corte + Barba', date: '20/12/2024', professional: 'Carlos', price: 70, photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop', notes: 'Degradê médio, lateral 1, tesoura em cima' },
      { id: '2', service: 'Degradê', date: '05/12/2024', professional: 'Carlos', price: 55, photo: null, notes: 'Degradê baixo' },
      { id: '3', service: 'Combo Premium', date: '18/11/2024', professional: 'João', price: 120, photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop', notes: 'Corte social, barba completa, hidratação' }
    ]
  },
  {
    id: '2',
    name: 'Pedro Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    phone: '(79) 98888-5678',
    email: 'pedro@email.com',
    lastVisit: '18/12/2024',
    lastService: 'Degradê',
    totalVisits: 12,
    totalSpent: 840,
    loyaltyPoints: 10,
    since: 'Jun/2024',
    cutHistory: [
      { id: '1', service: 'Degradê', date: '18/12/2024', professional: 'João', price: 55, photo: null, notes: null }
    ]
  },
  {
    id: '3',
    name: 'Lucas Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    phone: '(79) 97777-9012',
    email: 'lucas@email.com',
    lastVisit: '15/12/2024',
    lastService: 'Barba',
    totalVisits: 8,
    totalSpent: 420,
    loyaltyPoints: 4,
    since: 'Set/2024',
    cutHistory: []
  },
  {
    id: '4',
    name: 'Rafael Costa',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    phone: '(79) 96666-3456',
    email: 'rafael@email.com',
    lastVisit: '22/12/2024',
    lastService: 'Combo Premium',
    totalVisits: 31,
    totalSpent: 2480,
    loyaltyPoints: 7,
    since: 'Jan/2024',
    cutHistory: []
  },
  {
    id: '5',
    name: 'Thiago Souza',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    phone: '(79) 95555-7890',
    email: 'thiago@email.com',
    lastVisit: '10/12/2024',
    lastService: 'Corte Social',
    totalVisits: 5,
    totalSpent: 250,
    loyaltyPoints: 2,
    since: 'Nov/2024',
    cutHistory: []
  }
])

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.phone.includes(query) ||
    c.email.toLowerCase().includes(query)
  )
})

const openClientDetail = (client: any) => {
  selectedClient.value = client
  showClientModal.value = true
}

const sendWhatsApp = (client: any) => {
  const phone = client.phone.replace(/\D/g, '')
  window.open(`https://wa.me/55${phone}`, '_blank')
}

const bookClient = (client: any) => {
  // Navigate to booking with client pre-selected
  navigateTo(`/painel/agendamentos/novo?cliente=${client.id}`)
}

useSeoMeta({
  title: 'Clientes - Painel BarberPlus'
})
</script>

