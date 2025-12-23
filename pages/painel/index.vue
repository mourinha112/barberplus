<template>
  <div class="space-y-6">
    <!-- Quick Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Faturamento Hoje -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon name="lucide:dollar-sign" class="w-5 h-5 text-emerald-500" />
          </div>
          <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
            <Icon name="lucide:trending-up" class="w-3 h-3" />
            +12%
          </span>
        </div>
        <p class="text-2xl font-bold text-white mb-1">R$ {{ todayRevenue.toLocaleString('pt-BR') }}</p>
        <p class="text-xs text-neutral-500">Faturamento hoje</p>
      </div>

      <!-- Agendamentos Hoje -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Icon name="lucide:calendar-check" class="w-5 h-5 text-blue-500" />
          </div>
          <span class="text-xs text-neutral-500">{{ completedAppointments }}/{{ totalAppointments }}</span>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ totalAppointments }}</p>
        <p class="text-xs text-neutral-500">Agendamentos hoje</p>
        <!-- Progress bar -->
        <div class="mt-2 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div 
            class="h-full bg-blue-500 rounded-full transition-all"
            :style="{ width: `${(completedAppointments / totalAppointments) * 100}%` }"
          />
        </div>
      </div>

      <!-- Clientes Novos -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Icon name="lucide:user-plus" class="w-5 h-5 text-violet-500" />
          </div>
          <span class="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-medium">
            Este mês
          </span>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ newClients }}</p>
        <p class="text-xs text-neutral-500">Clientes novos</p>
      </div>

      <!-- Taxa de Falta -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Icon name="lucide:user-x" class="w-5 h-5 text-red-500" />
          </div>
          <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
            <Icon name="lucide:trending-down" class="w-3 h-3" />
            -8%
          </span>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ noShowRate }}%</p>
        <p class="text-xs text-neutral-500">Taxa de falta</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Chart Section -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-white">Faturamento</h3>
            <p class="text-sm text-neutral-500">Últimos 7 dias</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-for="period in ['7D', '30D', '90D']" 
              :key="period"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                selectedPeriod === period 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              ]"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <!-- Simple Bar Chart -->
        <div class="flex items-end justify-between h-48 gap-2">
          <div 
            v-for="(day, index) in chartData" 
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <span class="text-xs text-neutral-500">R$ {{ day.value }}</span>
            <div 
              class="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-400 transition-all hover:from-amber-400 hover:to-amber-300"
              :style="{ height: `${(day.value / maxChartValue) * 100}%` }"
            />
            <span class="text-xs text-neutral-500">{{ day.label }}</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800">
          <div>
            <p class="text-xs text-neutral-500 mb-1">Total do período</p>
            <p class="text-xl font-bold text-white">R$ {{ weekTotal.toLocaleString('pt-BR') }}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Média diária</p>
            <p class="text-xl font-bold text-white">R$ {{ Math.round(weekTotal / 7).toLocaleString('pt-BR') }}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Melhor dia</p>
            <p class="text-xl font-bold text-amber-400">Sábado</p>
          </div>
        </div>
      </div>

      <!-- Próximos Agendamentos -->
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Próximos</h3>
          <NuxtLink to="/painel/agendamentos" class="text-xs text-amber-500 hover:text-amber-400">
            Ver todos
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div 
            v-for="appointment in upcomingAppointments" 
            :key="appointment.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-700 overflow-hidden">
              <img :src="appointment.clientAvatar" :alt="appointment.clientName" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ appointment.clientName }}</p>
              <p class="text-xs text-neutral-500">{{ appointment.service }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-amber-400">{{ appointment.time }}</p>
              <p class="text-xs text-neutral-500">{{ appointment.professional }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="upcomingAppointments.length === 0" class="text-center py-8">
          <Icon name="lucide:calendar-x" class="w-12 h-12 text-neutral-700 mx-auto mb-2" />
          <p class="text-sm text-neutral-500">Nenhum agendamento próximo</p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Equipe - Performance -->
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Performance da Equipe</h3>
          <span class="text-xs text-neutral-500">Hoje</span>
        </div>

        <div class="space-y-4">
          <div 
            v-for="member in teamPerformance" 
            :key="member.id"
            class="flex items-center gap-4"
          >
            <div class="w-10 h-10 rounded-xl overflow-hidden">
              <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-white">{{ member.name }}</p>
                <p class="text-sm text-emerald-400 font-semibold">R$ {{ member.revenue }}</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                    :style="{ width: `${member.progress}%` }"
                  />
                </div>
                <span class="text-xs text-neutral-500">{{ member.appointments }} atend.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Comissões -->
        <div class="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <span class="text-sm text-neutral-400">Total em comissões</span>
          <span class="text-lg font-bold text-amber-400">R$ {{ totalCommission.toLocaleString('pt-BR') }}</span>
        </div>
      </div>

      <!-- Fila Virtual -->
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Fila Virtual</h3>
          <span class="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
            {{ queue.length }} na fila
          </span>
        </div>

        <div class="space-y-3">
          <div 
            v-for="(person, index) in queue" 
            :key="person.id"
            class="flex items-center gap-3 p-3 rounded-xl border transition-colors"
            :class="index === 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-neutral-800/50 border-transparent'"
          >
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              :class="index === 0 ? 'bg-amber-500 text-black' : 'bg-neutral-700 text-neutral-400'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ person.name }}</p>
              <p class="text-xs text-neutral-500">{{ person.service }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-neutral-400">Espera</p>
              <p class="text-sm font-medium" :class="index === 0 ? 'text-amber-400' : 'text-neutral-300'">
                ~{{ person.waitTime }} min
              </p>
            </div>
            <button 
              v-if="index === 0"
              class="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
            >
              Chamar
            </button>
          </div>
        </div>

        <div v-if="queue.length === 0" class="text-center py-8">
          <Icon name="lucide:check-circle" class="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <p class="text-sm text-neutral-500">Nenhum cliente na fila</p>
        </div>
      </div>
    </div>

    <!-- Anti-Falta Stats -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-neutral-900/50 to-neutral-900/50 border border-red-500/20">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Icon name="lucide:shield-check" class="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">Sistema Anti-Falta</h3>
          <p class="text-sm text-neutral-500">Proteção ativa • Sinal de R$ 20,00</p>
        </div>
        <div class="ml-auto">
          <button class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors">
            Configurar
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-neutral-900/50">
          <p class="text-xs text-neutral-500 mb-1">Sinais recebidos</p>
          <p class="text-2xl font-bold text-white">R$ {{ signalsReceived }}</p>
          <p class="text-xs text-emerald-400">Este mês</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50">
          <p class="text-xs text-neutral-500 mb-1">Faltas evitadas</p>
          <p class="text-2xl font-bold text-emerald-400">{{ noShowsAvoided }}</p>
          <p class="text-xs text-neutral-500">Clientes</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50">
          <p class="text-xs text-neutral-500 mb-1">Dinheiro salvo</p>
          <p class="text-2xl font-bold text-amber-400">R$ {{ moneySaved }}</p>
          <p class="text-xs text-neutral-500">Estimativa</p>
        </div>
        <div class="p-4 rounded-xl bg-neutral-900/50">
          <p class="text-xs text-neutral-500 mb-1">Taxa de comparecimento</p>
          <p class="text-2xl font-bold text-white">{{ attendanceRate }}%</p>
          <p class="text-xs text-emerald-400">↑ 15% vs antes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const selectedPeriod = ref('7D')

// Stats
const todayRevenue = ref(1485)
const totalAppointments = ref(18)
const completedAppointments = ref(12)
const newClients = ref(23)
const noShowRate = ref(4)

// Chart data
const chartData = [
  { label: 'Seg', value: 980 },
  { label: 'Ter', value: 1250 },
  { label: 'Qua', value: 1100 },
  { label: 'Qui', value: 1380 },
  { label: 'Sex', value: 1650 },
  { label: 'Sáb', value: 2100 },
  { label: 'Dom', value: 0 }
]

const maxChartValue = computed(() => Math.max(...chartData.map(d => d.value)))
const weekTotal = computed(() => chartData.reduce((acc, d) => acc + d.value, 0))

// Upcoming appointments
const upcomingAppointments = ref([
  {
    id: '1',
    clientName: 'João Silva',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    service: 'Corte + Barba',
    time: '14:30',
    professional: 'Carlos'
  },
  {
    id: '2',
    clientName: 'Pedro Santos',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    service: 'Degradê',
    time: '15:00',
    professional: 'João'
  },
  {
    id: '3',
    clientName: 'Lucas Oliveira',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    service: 'Barba',
    time: '15:30',
    professional: 'Carlos'
  },
  {
    id: '4',
    clientName: 'Rafael Costa',
    clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    service: 'Combo Premium',
    time: '16:00',
    professional: 'Pedro'
  }
])

// Team performance
const teamPerformance = ref([
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    revenue: 650,
    appointments: 8,
    progress: 85
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    revenue: 480,
    appointments: 6,
    progress: 65
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    revenue: 355,
    appointments: 4,
    progress: 45
  }
])

const totalCommission = computed(() => {
  return teamPerformance.value.reduce((acc, m) => acc + Math.round(m.revenue * 0.5), 0)
})

// Queue
const queue = ref([
  { id: '1', name: 'Marcos Almeida', service: 'Corte Degradê', waitTime: 5 },
  { id: '2', name: 'Bruno Lima', service: 'Corte + Barba', waitTime: 35 },
  { id: '3', name: 'Thiago Souza', service: 'Barba', waitTime: 55 }
])

// Anti-falta stats
const signalsReceived = ref(840)
const noShowsAvoided = ref(42)
const moneySaved = ref(1890)
const attendanceRate = ref(96)

useSeoMeta({
  title: 'Dashboard - Painel BarberPlus'
})
</script>

