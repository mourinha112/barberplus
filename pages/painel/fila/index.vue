<template>
  <div class="space-y-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:users" class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ queue.length }}</p>
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
        <p class="text-3xl font-bold text-emerald-400">{{ todayServed }}</p>
        <p class="text-sm text-neutral-500">Atendidos hoje</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:timer" class="w-6 h-6 text-violet-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ estimatedEndTime }}</p>
        <p class="text-sm text-neutral-500">Previsão de término</p>
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
        <button 
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          <Icon name="lucide:qr-code" class="w-4 h-4" />
          QR Code da Fila
        </button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-neutral-500">Status da fila:</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="queueActive" class="sr-only peer">
          <div class="w-14 h-7 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
        <span class="text-sm font-medium" :class="queueActive ? 'text-emerald-400' : 'text-neutral-500'">
          {{ queueActive ? 'Ativa' : 'Pausada' }}
        </span>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Queue List -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Now Serving -->
        <div v-if="nowServing" class="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/30">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold animate-pulse">ATENDENDO AGORA</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800">
              <img :src="nowServing.avatar" :alt="nowServing.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-lg font-semibold text-white">{{ nowServing.name }}</p>
              <p class="text-sm text-neutral-400">{{ nowServing.service }} • {{ nowServing.professional }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-neutral-500">Chegou às</p>
              <p class="text-lg font-semibold text-amber-400">{{ nowServing.arrivedAt }}</p>
            </div>
            <button class="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors">
              Finalizar
            </button>
          </div>
        </div>

        <!-- Queue Items -->
        <div class="space-y-3">
          <div 
            v-for="(person, index) in queue" 
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
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800">
                <img :src="person.avatar" :alt="person.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-white">{{ person.name }}</p>
                  <span v-if="person.vip" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">VIP</span>
                </div>
                <p class="text-sm text-neutral-500">{{ person.service }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-xs text-neutral-600">Chegou: {{ person.arrivedAt }}</span>
                  <span class="text-xs text-neutral-600">•</span>
                  <span class="text-xs" :class="index === 0 ? 'text-amber-400' : 'text-neutral-400'">
                    Espera: ~{{ person.waitTime }} min
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="index === 0"
                  class="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                >
                  Chamar
                </button>
                <button 
                  class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                  @click="sendWhatsApp(person)"
                >
                  <Icon name="mdi:whatsapp" class="w-5 h-5 text-emerald-500" />
                </button>
                <button class="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                  <Icon name="lucide:more-vertical" class="w-5 h-5 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="queue.length === 0" class="text-center py-12">
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
          <h3 class="text-lg font-semibold text-white mb-4">Status dos Profissionais</h3>
          <div class="space-y-3">
            <div 
              v-for="professional in professionals" 
              :key="professional.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
            >
              <div class="relative">
                <div class="w-10 h-10 rounded-xl overflow-hidden">
                  <img :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover" />
                </div>
                <span 
                  class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-800"
                  :class="getStatusColor(professional.status)"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                <p class="text-xs" :class="getStatusTextColor(professional.status)">
                  {{ getStatusText(professional.status) }}
                </p>
              </div>
              <p class="text-xs text-neutral-500">{{ professional.queueCount }} na fila</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          <div class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
              <Icon name="lucide:megaphone" class="w-5 h-5 text-amber-500" />
              <span class="text-sm text-neutral-300">Chamar próximo cliente</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
              <Icon name="mdi:whatsapp" class="w-5 h-5 text-emerald-500" />
              <span class="text-sm text-neutral-300">Avisar fila pelo WhatsApp</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
              <Icon name="lucide:clock" class="w-5 h-5 text-blue-500" />
              <span class="text-sm text-neutral-300">Atualizar tempos</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add to Queue Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Adicionar à Fila</h2>
        <form @submit.prevent="addToQueue" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Cliente</label>
            <input 
              v-model="newQueueEntry.name"
              type="text"
              placeholder="Nome do cliente"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Telefone</label>
            <input 
              v-model="newQueueEntry.phone"
              type="tel"
              placeholder="(79) 99999-9999"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Serviço</label>
            <select 
              v-model="newQueueEntry.service"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="Corte">Corte - R$ 55</option>
              <option value="Corte + Barba">Corte + Barba - R$ 70</option>
              <option value="Barba">Barba - R$ 35</option>
              <option value="Combo Premium">Combo Premium - R$ 120</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Profissional (opcional)</label>
            <select 
              v-model="newQueueEntry.professional"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Qualquer disponível</option>
              <option value="Carlos">Carlos Silva</option>
              <option value="João">João Santos</option>
              <option value="Pedro">Pedro Oliveira</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              v-model="newQueueEntry.vip"
              id="vip"
              class="w-4 h-4 rounded bg-neutral-700 border-neutral-600 text-amber-500 focus:ring-amber-500/50"
            />
            <label for="vip" class="text-sm text-neutral-400">Cliente VIP (prioridade)</label>
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

const queueActive = ref(true)
const showAddModal = ref(false)
const averageWait = ref(25)
const todayServed = ref(18)
const estimatedEndTime = ref('18:30')

const nowServing = ref({
  id: '0',
  name: 'Rafael Costa',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
  service: 'Combo Premium',
  professional: 'Carlos Silva',
  arrivedAt: '14:15'
})

const queue = ref([
  { id: '1', name: 'Marcos Almeida', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', service: 'Corte Degradê', arrivedAt: '14:30', waitTime: 10, vip: false },
  { id: '2', name: 'Bruno Lima', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', service: 'Corte + Barba', arrivedAt: '14:35', waitTime: 35, vip: true },
  { id: '3', name: 'Thiago Souza', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', service: 'Barba', arrivedAt: '14:40', waitTime: 55, vip: false },
  { id: '4', name: 'Diego Martins', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', service: 'Corte', arrivedAt: '14:50', waitTime: 70, vip: false }
])

const professionals = ref([
  { id: '1', name: 'Carlos Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', status: 'busy', queueCount: 2 },
  { id: '2', name: 'João Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', status: 'available', queueCount: 1 },
  { id: '3', name: 'Pedro Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', status: 'break', queueCount: 1 }
])

const newQueueEntry = ref({
  name: '',
  phone: '',
  service: 'Corte',
  professional: '',
  vip: false
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'available': 'bg-emerald-500',
    'busy': 'bg-amber-500',
    'break': 'bg-red-500',
    'offline': 'bg-neutral-500'
  }
  return colors[status] || 'bg-neutral-500'
}

const getStatusTextColor = (status: string) => {
  const colors: Record<string, string> = {
    'available': 'text-emerald-400',
    'busy': 'text-amber-400',
    'break': 'text-red-400',
    'offline': 'text-neutral-500'
  }
  return colors[status] || 'text-neutral-500'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'available': 'Disponível',
    'busy': 'Atendendo',
    'break': 'Em pausa',
    'offline': 'Offline'
  }
  return texts[status] || 'Offline'
}

const sendWhatsApp = (person: any) => {
  // Send WhatsApp notification
}

const addToQueue = () => {
  // Add to queue logic
  showAddModal.value = false
}

useSeoMeta({
  title: 'Fila Virtual - Painel BarberPlus'
})
</script>

