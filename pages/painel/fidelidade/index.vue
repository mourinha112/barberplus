<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
          <Icon name="lucide:gift" class="w-5 h-5 text-amber-500" />
        </div>
        <p class="text-2xl font-bold text-white">{{ stats.activeCards }}</p>
        <p class="text-xs text-neutral-500">Cartões ativos</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
          <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-500" />
        </div>
        <p class="text-2xl font-bold text-emerald-400">{{ stats.completedCards }}</p>
        <p class="text-xs text-neutral-500">Cartões completados</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
          <Icon name="lucide:trophy" class="w-5 h-5 text-violet-500" />
        </div>
        <p class="text-2xl font-bold text-white">{{ stats.freeServicesGiven }}</p>
        <p class="text-xs text-neutral-500">Serviços grátis dados</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
          <Icon name="lucide:repeat" class="w-5 h-5 text-blue-500" />
        </div>
        <p class="text-2xl font-bold text-blue-400">{{ stats.returnRate }}%</p>
        <p class="text-xs text-neutral-500">Taxa de retorno</p>
      </div>
    </div>

    <!-- Program Settings -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-white">Configuração do Programa</h3>
          <p class="text-sm text-neutral-500">Defina as regras do cartão fidelidade</p>
        </div>
        <button class="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors">
          Salvar alterações
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Cortes para completar</label>
          <div class="flex items-center gap-3">
            <button 
              class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
              @click="programSettings.cutsRequired = Math.max(5, programSettings.cutsRequired - 1)"
            >
              <Icon name="lucide:minus" class="w-4 h-4 text-neutral-400" />
            </button>
            <div class="flex-1 text-center">
              <span class="text-3xl font-bold text-amber-400">{{ programSettings.cutsRequired }}</span>
              <p class="text-xs text-neutral-500">cortes</p>
            </div>
            <button 
              class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
              @click="programSettings.cutsRequired++"
            >
              <Icon name="lucide:plus" class="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm text-neutral-400 mb-2">Recompensa</label>
          <select 
            v-model="programSettings.reward"
            class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
          >
            <option value="free_cut">Corte grátis</option>
            <option value="free_combo">Combo grátis</option>
            <option value="50_off">50% de desconto</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-neutral-400 mb-2">Validade do cartão</label>
          <select 
            v-model="programSettings.validity"
            class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
          >
            <option value="unlimited">Sem validade</option>
            <option value="6_months">6 meses</option>
            <option value="1_year">1 ano</option>
          </select>
        </div>
      </div>

      <!-- Visual Card Preview -->
      <div class="mt-8 pt-6 border-t border-neutral-800">
        <p class="text-sm text-neutral-400 mb-4">Pré-visualização do cartão</p>
        <div class="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/30">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Icon name="lucide:scissors" class="w-6 h-6 text-black" />
            </div>
            <div>
              <h4 class="font-semibold text-white">Barbearia Premium</h4>
              <p class="text-xs text-amber-400">Cartão Fidelidade</p>
            </div>
          </div>
          <div class="grid grid-cols-5 gap-2 mb-4">
            <div 
              v-for="i in programSettings.cutsRequired" 
              :key="i"
              class="aspect-square rounded-lg border-2 flex items-center justify-center"
              :class="i <= 7 ? 'border-amber-500 bg-amber-500/20' : 'border-neutral-700 bg-neutral-800'"
            >
              <Icon 
                v-if="i <= 7"
                name="lucide:check" 
                class="w-5 h-5 text-amber-500" 
              />
              <span v-else class="text-xs text-neutral-600">{{ i }}</span>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm text-neutral-400">7 de {{ programSettings.cutsRequired }} cortes</p>
            <p class="text-xs text-amber-400 mt-1">Falta {{ programSettings.cutsRequired - 7 }} para ganhar!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Clients Near Completion -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-white">Clientes perto de completar</h3>
          <p class="text-sm text-neutral-500">Envie uma mensagem para incentivá-los!</p>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 transition-colors">
          <Icon name="mdi:whatsapp" class="w-4 h-4" />
          Enviar para todos
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="client in clientsNearCompletion" 
          :key="client.id"
          class="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl overflow-hidden">
              <img :src="client.avatar" :alt="client.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ client.name }}</p>
              <p class="text-xs text-neutral-500">Última visita: {{ client.lastVisit }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <div class="flex-1 h-2 rounded-full bg-neutral-700 overflow-hidden">
              <div 
                class="h-full bg-amber-500 rounded-full"
                :style="{ width: `${(client.points / programSettings.cutsRequired) * 100}%` }"
              />
            </div>
            <span class="text-sm font-semibold text-amber-400">{{ client.points }}/{{ programSettings.cutsRequired }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors">
              <Icon name="mdi:whatsapp" class="w-4 h-4" />
              WhatsApp
            </button>
            <button class="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs hover:bg-amber-500/30 transition-colors">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Redemptions -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <h3 class="text-lg font-semibold text-white mb-6">Resgates recentes</h3>
      <div class="space-y-3">
        <div 
          v-for="redemption in recentRedemptions" 
          :key="redemption.id"
          class="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50"
        >
          <div class="w-10 h-10 rounded-xl overflow-hidden">
            <img :src="redemption.avatar" :alt="redemption.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ redemption.name }}</p>
            <p class="text-xs text-neutral-500">{{ redemption.date }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-amber-400 font-medium">{{ redemption.reward }}</p>
            <p class="text-xs text-neutral-500">Valor: R$ {{ redemption.value }}</p>
          </div>
          <Icon name="lucide:gift" class="w-5 h-5 text-amber-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const stats = ref({
  activeCards: 156,
  completedCards: 42,
  freeServicesGiven: 42,
  returnRate: 78
})

const programSettings = ref({
  cutsRequired: 10,
  reward: 'free_cut',
  validity: 'unlimited'
})

const clientsNearCompletion = ref([
  { id: '1', name: 'João Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', points: 8, lastVisit: '20/12' },
  { id: '2', name: 'Pedro Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', points: 9, lastVisit: '18/12' },
  { id: '3', name: 'Lucas Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', points: 8, lastVisit: '15/12' },
  { id: '4', name: 'Rafael Costa', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', points: 9, lastVisit: '22/12' },
  { id: '5', name: 'Thiago Souza', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', points: 7, lastVisit: '10/12' },
  { id: '6', name: 'Bruno Lima', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop', points: 8, lastVisit: '19/12' }
])

const recentRedemptions = ref([
  { id: '1', name: 'Marcos Almeida', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', date: '22/12/2024', reward: 'Corte grátis', value: '55' },
  { id: '2', name: 'Felipe Dias', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', date: '20/12/2024', reward: 'Corte grátis', value: '55' },
  { id: '3', name: 'Gabriel Rocha', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', date: '18/12/2024', reward: 'Corte grátis', value: '55' }
])

useSeoMeta({
  title: 'Fidelidade - Painel BarberPlus'
})
</script>

