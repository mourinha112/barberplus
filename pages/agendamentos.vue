<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="font-display text-2xl font-semibold text-white mb-2">
          Meus Agendamentos
        </h1>
        <p class="text-sm text-neutral-500">Gerencie seus horários marcados</p>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-2 mb-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeTab === tab.id 
              ? 'bg-amber-500 text-black' 
              : 'bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span 
            v-if="tab.count > 0"
            :class="[
              'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
              activeTab === tab.id ? 'bg-black/20' : 'bg-neutral-800'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Upcoming Appointments -->
      <div v-if="activeTab === 'upcoming'" class="space-y-4">
        <AppointmentCard 
          v-for="appointment in upcomingAppointments" 
          :key="appointment.id"
          :appointment="appointment"
          @cancel="cancelAppointment"
          @reschedule="rescheduleAppointment"
        />

        <!-- Empty State -->
        <div v-if="upcomingAppointments.length === 0" class="text-center py-16">
          <Icon name="lucide:calendar-x" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-white mb-2">Nenhum agendamento</h3>
          <p class="text-sm text-neutral-500 mb-4">Você não tem nenhum agendamento próximo</p>
          <NuxtLink 
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          >
            <Icon name="lucide:search" class="w-4 h-4" />
            Encontrar barbearia
          </NuxtLink>
        </div>
      </div>

      <!-- Past Appointments -->
      <div v-if="activeTab === 'history'" class="space-y-4">
        <AppointmentCard 
          v-for="appointment in pastAppointments" 
          :key="appointment.id"
          :appointment="appointment"
          :is-past="true"
          @rate="rateAppointment"
          @book-again="bookAgain"
        />

        <div v-if="pastAppointments.length === 0" class="text-center py-16">
          <Icon name="lucide:history" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-white mb-2">Sem histórico</h3>
          <p class="text-sm text-neutral-500">Você ainda não realizou nenhum agendamento</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('upcoming')

const tabs = computed(() => [
  { id: 'upcoming', label: 'Próximos', count: upcomingAppointments.value.length },
  { id: 'history', label: 'Histórico', count: pastAppointments.value.length }
])

const upcomingAppointments = ref([
  {
    id: '1',
    barbershop: {
      name: 'Barbearia Premium',
      logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
      address: 'Av. Barão de Maruim, 245'
    },
    service: 'Corte + Barba',
    professional: 'Carlos Silva',
    date: '2025-12-24',
    time: '14:30',
    price: 70,
    status: 'confirmed'
  },
  {
    id: '2',
    barbershop: {
      name: 'Barber Kings',
      logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop',
      address: 'Rua São Cristóvão, 890'
    },
    service: 'Corte Degradê',
    professional: 'João Santos',
    date: '2025-12-28',
    time: '10:00',
    price: 55,
    status: 'pending'
  }
])

const pastAppointments = ref([
  {
    id: '3',
    barbershop: {
      name: 'Barbearia Premium',
      logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
      address: 'Av. Barão de Maruim, 245'
    },
    service: 'Combo Premium',
    professional: 'Carlos Silva',
    date: '2025-12-15',
    time: '16:00',
    price: 120,
    status: 'completed',
    rated: true
  },
  {
    id: '4',
    barbershop: {
      name: 'Classic Cuts',
      logo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop',
      address: 'Praça da Bandeira, 56'
    },
    service: 'Corte Clássico',
    professional: 'Pedro Oliveira',
    date: '2025-12-10',
    time: '11:30',
    price: 45,
    status: 'completed',
    rated: false
  }
])

const cancelAppointment = (id: string) => {
  const index = upcomingAppointments.value.findIndex(a => a.id === id)
  if (index > -1) {
    upcomingAppointments.value.splice(index, 1)
    useToast().add({
      title: 'Agendamento cancelado',
      icon: 'i-lucide-check',
      color: 'green'
    })
  }
}

const rescheduleAppointment = (id: string) => {
  console.log('Reschedule:', id)
}

const rateAppointment = (id: string) => {
  console.log('Rate:', id)
}

const bookAgain = (id: string) => {
  console.log('Book again:', id)
}

useSeoMeta({
  title: 'Meus Agendamentos - BarberPlus'
})
</script>

