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

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-neutral-800" />
            <div class="flex-1">
              <div class="h-4 w-32 bg-neutral-800 rounded mb-2" />
              <div class="h-3 w-48 bg-neutral-800 rounded" />
            </div>
          </div>
          <div class="h-3 w-full bg-neutral-800 rounded" />
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div v-else-if="activeTab === 'upcoming'" class="space-y-4">
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
      <div v-else-if="activeTab === 'history'" class="space-y-4">
        <AppointmentCard
          v-for="appointment in pastAppointments"
          :key="appointment.id"
          :appointment="appointment"
          :is-past="true"
          @rate="openRatingModal"
          @book-again="bookAgain"
        />

        <div v-if="pastAppointments.length === 0" class="text-center py-16">
          <Icon name="lucide:history" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-white mb-2">Sem histórico</h3>
          <p class="text-sm text-neutral-500">Você ainda não realizou nenhum agendamento</p>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <UModal v-model="showCancelModal" :ui="{ width: 'max-w-sm' }">
      <div class="p-6 text-center">
        <Icon name="lucide:alert-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Cancelar agendamento?</h3>
        <p class="text-sm text-neutral-400 mb-6">Esta ação não pode ser desfeita. O horário ficará disponível para outros clientes.</p>
        <div class="flex gap-3">
          <button
            class="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
            @click="showCancelModal = false"
          >
            Manter
          </button>
          <button
            class="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            :disabled="cancelling"
            @click="confirmCancel"
          >
            {{ cancelling ? 'Cancelando...' : 'Cancelar' }}
          </button>
        </div>
      </div>
    </UModal>

    <!-- Rating Modal -->
    <UModal v-model="showRatingModal" :ui="{ width: 'max-w-sm' }">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-white mb-4 text-center">Avalie o atendimento</h3>
        <div class="flex items-center justify-center gap-2 mb-4">
          <button
            v-for="i in 5"
            :key="i"
            @click="ratingValue = i"
          >
            <Icon
              name="lucide:star"
              :class="['w-8 h-8 transition-colors', i <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-neutral-700']"
            />
          </button>
        </div>
        <textarea
          v-model="ratingComment"
          placeholder="Conte como foi a experiência (opcional)"
          rows="3"
          class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors resize-none mb-4"
        />
        <button
          class="w-full btn-premium"
          :disabled="ratingValue === 0 || submittingRating"
          @click="submitRating"
        >
          {{ submittingRating ? 'Enviando...' : 'Enviar avaliação' }}
        </button>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated } = useAuth()
const api = useApi()
const toast = useToast()

const activeTab = ref('upcoming')
const loading = ref(true)
const appointments = ref<any[]>([])

// Cancel modal
const showCancelModal = ref(false)
const cancellingId = ref('')
const cancelling = ref(false)

// Rating modal
const showRatingModal = ref(false)
const ratingAppointmentId = ref('')
const ratingValue = ref(0)
const ratingComment = ref('')
const submittingRating = ref(false)

const upcomingAppointments = computed(() => {
  const now = new Date()
  return appointments.value.filter(a => {
    const appointmentDate = new Date(`${a.date}T${a.time || '00:00'}`)
    return appointmentDate >= now && !['completed', 'cancelled', 'no_show'].includes(a.status)
  })
})

const pastAppointments = computed(() => {
  const now = new Date()
  return appointments.value.filter(a => {
    const appointmentDate = new Date(`${a.date}T${a.time || '00:00'}`)
    return appointmentDate < now || ['completed', 'cancelled', 'no_show'].includes(a.status)
  })
})

const tabs = computed(() => [
  { id: 'upcoming', label: 'Próximos', count: upcomingAppointments.value.length },
  { id: 'history', label: 'Histórico', count: pastAppointments.value.length }
])

const fetchAppointments = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await api.user.getAppointments() as any
    if (response.success) {
      appointments.value = (response.data || []).map((a: any) => ({
        id: a.id,
        barbershop: {
          name: a.barbershop?.name || a.barbershop_name || 'Barbearia',
          logo: a.barbershop?.logo_url || a.barbershop?.logoUrl || '',
          address: a.barbershop?.address || ''
        },
        service: a.services?.map((s: any) => s.name).join(', ') || a.service_name || 'Serviço',
        professional: a.professional?.name || a.professional_name || '',
        date: a.date,
        time: a.start_time || a.time || '',
        price: a.total_price || a.price || 0,
        status: a.status,
        rated: !!a.review_id,
        barbershopSlug: a.barbershop?.slug || ''
      }))
    }
  } catch {
    // Silently handle - show empty state
  } finally {
    loading.value = false
  }
}

const cancelAppointment = (id: string) => {
  cancellingId.value = id
  showCancelModal.value = true
}

const confirmCancel = async () => {
  cancelling.value = true
  try {
    const response = await api.patch(`/api/user/appointments/${cancellingId.value}`, { status: 'cancelled' }) as any
    if (response.success !== false) {
      const index = appointments.value.findIndex(a => a.id === cancellingId.value)
      if (index > -1) {
        appointments.value[index].status = 'cancelled'
      }
      toast.add({ title: 'Agendamento cancelado', icon: 'i-lucide-check', color: 'green' })
    }
  } catch {
    toast.add({ title: 'Erro ao cancelar', description: 'Tente novamente', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    cancelling.value = false
    showCancelModal.value = false
  }
}

const rescheduleAppointment = (id: string) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment?.barbershopSlug) {
    navigateTo(`/barbearia/${appointment.barbershopSlug}`)
  }
}

const openRatingModal = (id: string) => {
  ratingAppointmentId.value = id
  ratingValue.value = 0
  ratingComment.value = ''
  showRatingModal.value = true
}

const submitRating = async () => {
  submittingRating.value = true
  try {
    const appointment = appointments.value.find(a => a.id === ratingAppointmentId.value)
    await api.reviews.create({
      appointmentId: ratingAppointmentId.value,
      rating: ratingValue.value,
      comment: ratingComment.value,
      barbershopId: appointment?.barbershopId
    })

    const index = appointments.value.findIndex(a => a.id === ratingAppointmentId.value)
    if (index > -1) {
      appointments.value[index].rated = true
    }

    toast.add({ title: 'Avaliação enviada!', icon: 'i-lucide-star', color: 'green' })
    showRatingModal.value = false
  } catch {
    toast.add({ title: 'Erro ao enviar avaliação', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    submittingRating.value = false
  }
}

const bookAgain = (id: string) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment?.barbershopSlug) {
    navigateTo(`/barbearia/${appointment.barbershopSlug}`)
  } else {
    navigateTo('/')
  }
}

onMounted(() => {
  fetchAppointments()
})

useSeoMeta({
  title: 'Meus Agendamentos - BarberPlus'
})
</script>
