<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div class="flex items-center gap-4">
        <button 
          class="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          @click="previousDay"
        >
          <Icon name="lucide:chevron-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <div class="text-center">
          <h2 class="text-lg font-semibold text-white">{{ formattedDate }}</h2>
          <p class="text-sm text-neutral-500">{{ dayOfWeek }}</p>
        </div>
        <button 
          class="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          @click="nextDay"
        >
          <Icon name="lucide:chevron-right" class="w-5 h-5 text-neutral-400" />
        </button>
        <button 
          class="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium"
          @click="goToToday"
        >
          Hoje
        </button>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:filter" class="w-4 h-4" />
          Filtrar
        </button>
        <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>
    </div>

    <!-- Day Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Icon name="lucide:calendar" class="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-white">{{ dayStats.total }}</p>
          <p class="text-xs text-neutral-500">Total</p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-emerald-400">{{ dayStats.completed }}</p>
          <p class="text-xs text-neutral-500">Concluídos</p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Icon name="lucide:clock" class="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-amber-400">{{ dayStats.pending }}</p>
          <p class="text-xs text-neutral-500">Pendentes</p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Icon name="lucide:x-circle" class="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-red-400">{{ dayStats.cancelled }}</p>
          <p class="text-xs text-neutral-500">Cancelados</p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Icon name="lucide:dollar-sign" class="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-white">R$ {{ dayStats.revenue }}</p>
          <p class="text-xs text-neutral-500">Previsto</p>
        </div>
      </div>
    </div>

    <!-- Schedule Grid -->
    <div class="grid lg:grid-cols-4 gap-6">
      <!-- Professional Columns -->
      <div 
        v-for="professional in professionals" 
        :key="professional.id"
        class="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden"
      >
        <!-- Professional Header -->
        <div class="p-4 border-b border-neutral-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl overflow-hidden">
            <img :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ professional.name }}</p>
            <p class="text-xs text-neutral-500">{{ professional.appointments.length }} agendamentos</p>
          </div>
          <span 
            class="w-2.5 h-2.5 rounded-full"
            :class="professional.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'"
          />
        </div>

        <!-- Time Slots -->
        <div class="p-3 space-y-2 max-h-[500px] overflow-y-auto">
          <div 
            v-for="appointment in professional.appointments" 
            :key="appointment.id"
            :class="[
              'p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]',
              getAppointmentClass(appointment.status)
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold" :class="getTimeClass(appointment.status)">
                {{ appointment.time }}
              </span>
              <span 
                class="px-2 py-0.5 rounded text-[10px] font-medium"
                :class="getStatusBadgeClass(appointment.status)"
              >
                {{ getStatusLabel(appointment.status) }}
              </span>
            </div>
            <p class="text-sm font-medium text-white mb-1">{{ appointment.clientName }}</p>
            <p class="text-xs text-neutral-500 mb-2">{{ appointment.service }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-amber-400 font-medium">R$ {{ appointment.price }}</span>
              <div class="flex items-center gap-1">
                <button 
                  v-if="appointment.status === 'pending'"
                  class="p-1 rounded hover:bg-neutral-700 transition-colors"
                >
                  <Icon name="mdi:whatsapp" class="w-4 h-4 text-emerald-500" />
                </button>
                <button class="p-1 rounded hover:bg-neutral-700 transition-colors">
                  <Icon name="lucide:more-vertical" class="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>
            <!-- Signal indicator -->
            <div v-if="appointment.signalPaid" class="mt-2 pt-2 border-t border-neutral-700/50 flex items-center gap-1">
              <Icon name="lucide:shield-check" class="w-3 h-3 text-emerald-500" />
              <span class="text-[10px] text-emerald-400">Sinal pago - R$ 20</span>
            </div>
          </div>

          <!-- Empty slot -->
          <button 
            v-if="professional.appointments.length < 8"
            class="w-full p-3 rounded-xl border border-dashed border-neutral-700 text-neutral-500 hover:border-amber-500/50 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="lucide:plus" class="w-4 h-4" />
            <span class="text-sm">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  layout: 'painel'
})

const currentDate = ref(new Date())

const formattedDate = computed(() => format(currentDate.value, "d 'de' MMMM", { locale: ptBR }))
const dayOfWeek = computed(() => format(currentDate.value, 'EEEE', { locale: ptBR }))

const previousDay = () => { currentDate.value = subDays(currentDate.value, 1) }
const nextDay = () => { currentDate.value = addDays(currentDate.value, 1) }
const goToToday = () => { currentDate.value = new Date() }

const dayStats = ref({
  total: 18,
  completed: 12,
  pending: 5,
  cancelled: 1,
  revenue: '1.260'
})

const professionals = ref([
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'busy',
    appointments: [
      { id: '1', time: '09:00', clientName: 'João Silva', service: 'Corte + Barba', price: '70', status: 'completed', signalPaid: true },
      { id: '2', time: '10:00', clientName: 'Pedro Santos', service: 'Degradê', price: '55', status: 'completed', signalPaid: true },
      { id: '3', time: '11:00', clientName: 'Lucas Oliveira', service: 'Barba', price: '35', status: 'completed', signalPaid: false },
      { id: '4', time: '14:00', clientName: 'Rafael Costa', service: 'Combo Premium', price: '120', status: 'in_progress', signalPaid: true },
      { id: '5', time: '15:30', clientName: 'Thiago Souza', service: 'Corte', price: '45', status: 'pending', signalPaid: true },
      { id: '6', time: '16:30', clientName: 'Bruno Lima', service: 'Corte + Barba', price: '70', status: 'pending', signalPaid: false }
    ]
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'available',
    appointments: [
      { id: '7', time: '09:30', clientName: 'Marcos Almeida', service: 'Corte Social', price: '50', status: 'completed', signalPaid: true },
      { id: '8', time: '10:30', clientName: 'Felipe Dias', service: 'Relaxamento', price: '100', status: 'completed', signalPaid: true },
      { id: '9', time: '14:00', clientName: 'Gabriel Rocha', service: 'Degradê', price: '55', status: 'pending', signalPaid: true },
      { id: '10', time: '15:00', clientName: 'Diego Martins', service: 'Corte + Barba', price: '70', status: 'pending', signalPaid: false }
    ]
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'available',
    appointments: [
      { id: '11', time: '10:00', clientName: 'André Nunes', service: 'Corte Infantil', price: '35', status: 'completed', signalPaid: false },
      { id: '12', time: '11:00', clientName: 'Ricardo Freitas', service: 'Combo', price: '70', status: 'cancelled', signalPaid: true },
      { id: '13', time: '14:30', clientName: 'Gustavo Pereira', service: 'Barba', price: '35', status: 'pending', signalPaid: true }
    ]
  },
  {
    id: '4',
    name: 'Lucas Mendes',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    status: 'available',
    appointments: [
      { id: '14', time: '09:00', clientName: 'Vinícius Lopes', service: 'Corte', price: '45', status: 'completed', signalPaid: true },
      { id: '15', time: '10:00', clientName: 'Caio Ferreira', service: 'Corte', price: '45', status: 'completed', signalPaid: true }
    ]
  }
])

const getAppointmentClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'bg-emerald-500/10 border-emerald-500/30',
    'in_progress': 'bg-amber-500/10 border-amber-500/30',
    'pending': 'bg-neutral-800/50 border-neutral-700',
    'cancelled': 'bg-red-500/10 border-red-500/30 opacity-60'
  }
  return classes[status] || classes['pending']
}

const getTimeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'text-emerald-400',
    'in_progress': 'text-amber-400',
    'pending': 'text-neutral-400',
    'cancelled': 'text-red-400 line-through'
  }
  return classes[status] || classes['pending']
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'bg-emerald-500/20 text-emerald-400',
    'in_progress': 'bg-amber-500/20 text-amber-400',
    'pending': 'bg-neutral-700 text-neutral-300',
    'cancelled': 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes['pending']
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'completed': 'Concluído',
    'in_progress': 'Atendendo',
    'pending': 'Aguardando',
    'cancelled': 'Cancelado'
  }
  return labels[status] || 'Pendente'
}

useSeoMeta({
  title: 'Agendamentos - Painel BarberPlus'
})
</script>

