<template>
  <div class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
    <!-- Header -->
    <div class="flex items-start gap-3 mb-4">
      <img 
        :src="appointment.barbershop.logo" 
        :alt="appointment.barbershop.name"
        class="w-14 h-14 rounded-xl object-cover"
      />
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-white truncate">{{ appointment.barbershop.name }}</h3>
        <p class="text-sm text-neutral-500 truncate">{{ appointment.barbershop.address }}</p>
      </div>
      <span 
        :class="[
          'px-2.5 py-1 rounded-lg text-xs font-medium',
          statusStyles[appointment.status]
        ]"
      >
        {{ statusLabels[appointment.status] }}
      </span>
    </div>

    <!-- Details -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="flex items-center gap-2 text-sm">
        <Icon name="lucide:scissors" class="w-4 h-4 text-amber-500" />
        <span class="text-neutral-300">{{ appointment.service }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Icon name="lucide:user" class="w-4 h-4 text-amber-500" />
        <span class="text-neutral-300">{{ appointment.professional }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Icon name="lucide:calendar" class="w-4 h-4 text-amber-500" />
        <span class="text-neutral-300">{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Icon name="lucide:clock" class="w-4 h-4 text-amber-500" />
        <span class="text-neutral-300">{{ appointment.time }}</span>
      </div>
    </div>

    <!-- Price -->
    <div class="flex items-center justify-between py-3 border-t border-neutral-800">
      <span class="text-sm text-neutral-500">Valor</span>
      <span class="text-lg font-bold text-gold-gradient">R$ {{ appointment.price.toFixed(2) }}</span>
    </div>

    <!-- Actions -->
    <div v-if="!isPast" class="flex items-center gap-3 mt-3">
      <button 
        class="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-medium"
        @click="$emit('reschedule', appointment.id)"
      >
        Reagendar
      </button>
      <button 
        class="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
        @click="$emit('cancel', appointment.id)"
      >
        Cancelar
      </button>
    </div>

    <div v-else class="flex items-center gap-3 mt-3">
      <button 
        v-if="!appointment.rated"
        class="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-sm flex items-center justify-center gap-2"
        @click="$emit('rate', appointment.id)"
      >
        <Icon name="lucide:star" class="w-4 h-4" />
        Avaliar
      </button>
      <button 
        class="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-medium"
        @click="$emit('book-again', appointment.id)"
      >
        Agendar novamente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Appointment {
  id: string
  barbershop: {
    name: string
    logo: string
    address: string
  }
  service: string
  professional: string
  date: string
  time: string
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  rated?: boolean
}

const props = defineProps<{
  appointment: Appointment
  isPast?: boolean
}>()

defineEmits<{
  (e: 'cancel', id: string): void
  (e: 'reschedule', id: string): void
  (e: 'rate', id: string): void
  (e: 'book-again', id: string): void
}>()

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado'
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/30'
}

const formattedDate = computed(() => {
  return format(parseISO(props.appointment.date), "d 'de' MMMM", { locale: ptBR })
})
</script>

