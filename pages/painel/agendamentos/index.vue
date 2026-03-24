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
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="openNewAppointmentModal"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <template v-else>
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

      <!-- Empty State -->
      <div v-if="appointments.length === 0" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-800 flex items-center justify-center">
          <Icon name="lucide:calendar" class="w-10 h-10 text-neutral-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Nenhum agendamento</h3>
        <p class="text-neutral-500 mb-6">Não há agendamentos para este dia.</p>
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="openNewAppointmentModal"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          Criar agendamento
        </button>
      </div>

      <!-- Schedule Grid by Professional -->
      <div v-else class="grid lg:grid-cols-4 gap-6">
        <div
          v-for="prof in groupedByProfessional"
          :key="prof.id"
          class="rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden"
        >
          <div class="p-4 border-b border-neutral-800 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800">
              <img v-if="prof.avatar_url" :src="prof.avatar_url" :alt="prof.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:user" class="w-5 h-5 text-neutral-500" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ prof.name }}</p>
              <p class="text-xs text-neutral-500">{{ prof.appointments.length }} agendamentos</p>
            </div>
          </div>

          <div class="p-3 space-y-2 max-h-[500px] overflow-y-auto">
            <div
              v-for="apt in prof.appointments"
              :key="apt.id"
              :class="[
                'p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]',
                getAppointmentClass(apt.status)
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold" :class="getTimeClass(apt.status)">
                  {{ apt.start_time?.substring(0, 5) }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-medium"
                  :class="getStatusBadgeClass(apt.status)"
                >
                  {{ getStatusLabel(apt.status) }}
                </span>
              </div>
              <p class="text-sm font-medium text-white mb-1">{{ apt.client?.name || 'Cliente não informado' }}</p>
              <p class="text-xs text-neutral-500 mb-2">{{ apt.services?.map((s: any) => s.service_name).join(', ') || 'Serviço' }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-amber-400 font-medium">R$ {{ Number(apt.total_price || 0).toFixed(2).replace('.', ',') }}</span>
                <div class="flex items-center gap-1">
                  <button
                    v-if="apt.status === 'pending' || apt.status === 'confirmed'"
                    class="p-1 rounded hover:bg-neutral-700 transition-colors"
                    @click.stop="updateStatus(apt.id, 'completed')"
                    title="Marcar como concluído"
                  >
                    <Icon name="lucide:check" class="w-4 h-4 text-emerald-500" />
                  </button>
                  <button
                    v-if="apt.status === 'pending' || apt.status === 'confirmed'"
                    class="p-1 rounded hover:bg-neutral-700 transition-colors"
                    @click.stop="updateStatus(apt.id, 'cancelled')"
                    title="Cancelar"
                  >
                    <Icon name="lucide:x" class="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div v-if="apt.deposit_amount > 0" class="mt-2 pt-2 border-t border-neutral-700/50 flex items-center gap-1">
                <Icon name="lucide:shield-check" class="w-3 h-3 text-emerald-500" />
                <span class="text-[10px] text-emerald-400">Sinal pago - R$ {{ Number(apt.deposit_amount).toFixed(0) }}</span>
              </div>
            </div>

            <button
              class="w-full p-3 rounded-xl border border-dashed border-neutral-700 text-neutral-500 hover:border-amber-500/50 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
              @click="openNewAppointmentModal(prof.id)"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span class="text-sm">Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- New Appointment Modal -->
    <UModal v-model="showNewModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Novo Agendamento</h2>
        <form @submit.prevent="saveAppointment" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Cliente</label>
            <select
              v-model="appointmentForm.clientId"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Selecione um cliente...</option>
              <option v-for="c in clientsList" :key="c.id" :value="c.id">{{ c.name }} - {{ c.phone || 'Sem telefone' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Profissional *</label>
            <select
              v-model="appointmentForm.professionalId"
              required
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
              @change="fetchAvailableSlots"
            >
              <option value="">Selecione...</option>
              <option v-for="p in professionalsList" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Serviços *</label>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <label
                v-for="s in servicesList"
                :key="s.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="s.id"
                  v-model="appointmentForm.services"
                  class="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500"
                  @change="fetchAvailableSlots"
                />
                <span class="text-sm text-neutral-300 flex-1">{{ s.name }}</span>
                <span class="text-sm text-amber-400">R$ {{ Number(s.promotional_price || s.price).toFixed(2).replace('.', ',') }}</span>
                <span class="text-xs text-neutral-500">{{ s.duration_minutes }}min</span>
              </label>
            </div>
            <p v-if="servicesList.length === 0" class="text-sm text-neutral-500">Nenhum serviço cadastrado</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Data *</label>
              <input
                v-model="appointmentForm.date"
                type="date"
                required
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
                @change="fetchAvailableSlots"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Horário *</label>
              <select
                v-model="appointmentForm.startTime"
                required
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
              >
                <option value="">Selecione...</option>
                <option v-for="slot in availableSlots" :key="slot" :value="slot">{{ slot }}</option>
              </select>
              <p v-if="loadingSlots" class="text-xs text-neutral-500 mt-1">Carregando horários...</p>
              <p v-else-if="appointmentForm.professionalId && appointmentForm.date && availableSlots.length === 0" class="text-xs text-red-400 mt-1">Nenhum horário disponível</p>
            </div>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Observações</label>
            <textarea
              v-model="appointmentForm.clientNotes"
              rows="2"
              placeholder="Observações sobre o agendamento..."
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
              @click="showNewModal = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Criando...' : 'Criar Agendamento' }}
            </button>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  layout: 'painel'
})

const { currentBarbershop, authHeaders } = useAuth()

const currentDate = ref(new Date())
const loading = ref(true)
const saving = ref(false)
const showNewModal = ref(false)
const formError = ref('')
const loadingSlots = ref(false)

const appointments = ref<any[]>([])
const professionalsList = ref<any[]>([])
const clientsList = ref<any[]>([])
const servicesList = ref<any[]>([])
const availableSlots = ref<string[]>([])

const formattedDate = computed(() => format(currentDate.value, "d 'de' MMMM", { locale: ptBR }))
const dayOfWeek = computed(() => format(currentDate.value, 'EEEE', { locale: ptBR }))
const currentDateStr = computed(() => format(currentDate.value, 'yyyy-MM-dd'))

const appointmentForm = ref({
  clientId: '',
  professionalId: '',
  services: [] as string[],
  date: format(new Date(), 'yyyy-MM-dd'),
  startTime: '',
  clientNotes: ''
})

const previousDay = () => { currentDate.value = subDays(currentDate.value, 1) }
const nextDay = () => { currentDate.value = addDays(currentDate.value, 1) }
const goToToday = () => { currentDate.value = new Date() }

// Computed stats
const dayStats = computed(() => {
  const total = appointments.value.length
  const completed = appointments.value.filter(a => a.status === 'completed').length
  const pending = appointments.value.filter(a => a.status === 'pending' || a.status === 'confirmed').length
  const cancelled = appointments.value.filter(a => a.status === 'cancelled').length
  const revenue = appointments.value
    .filter(a => a.status !== 'cancelled' && a.status !== 'no_show')
    .reduce((acc, a) => acc + Number(a.total_price || 0), 0)
  return {
    total,
    completed,
    pending,
    cancelled,
    revenue: revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
})

// Group appointments by professional
const groupedByProfessional = computed(() => {
  const map = new Map<string, any>()

  // Add all professionals first
  for (const prof of professionalsList.value) {
    map.set(prof.id, {
      id: prof.id,
      name: prof.name,
      avatar_url: prof.avatar_url,
      appointments: []
    })
  }

  // Assign appointments to their professional
  for (const apt of appointments.value) {
    const profId = apt.professional_id
    if (map.has(profId)) {
      map.get(profId).appointments.push(apt)
    } else {
      map.set(profId, {
        id: profId,
        name: apt.professional?.name || 'Desconhecido',
        avatar_url: apt.professional?.avatar_url,
        appointments: [apt]
      })
    }
  }

  return Array.from(map.values()).filter(p => p.appointments.length > 0 || professionalsList.value.some(pr => pr.id === p.id))
})

// Fetch appointments for current day
const fetchAppointments = async () => {
  if (!currentBarbershop.value?.id) return

  loading.value = true
  try {
    const response = await $fetch<any>('/api/painel/appointments', {
      query: {
        barbershopId: currentBarbershop.value.id,
        date: currentDateStr.value
      },
      headers: authHeaders.value
    })

    if (response.success) {
      appointments.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    appointments.value = []
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

// Fetch services
const fetchServices = async () => {
  if (!currentBarbershop.value?.id) return
  try {
    const response = await $fetch<any>('/api/painel/services', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    if (response.success) {
      servicesList.value = (response.data || []).filter((s: any) => s.is_active !== false)
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
  }
}

// Fetch available time slots
const fetchAvailableSlots = async () => {
  const { professionalId, date, services } = appointmentForm.value
  if (!professionalId || !date || !currentBarbershop.value?.id) {
    availableSlots.value = []
    return
  }

  const totalDuration = servicesList.value
    .filter(s => services.includes(s.id))
    .reduce((acc, s) => acc + (s.duration_minutes || 30), 0) || 30

  loadingSlots.value = true
  try {
    const response = await $fetch<any>('/api/painel/appointments/available-slots', {
      query: {
        barbershopId: currentBarbershop.value.id,
        professionalId,
        date,
        duration: totalDuration
      },
      headers: authHeaders.value
    })
    if (response.success) {
      availableSlots.value = response.data || []
    }
  } catch {
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

// Open new appointment modal
const openNewAppointmentModal = (preselectedProfessionalId?: string) => {
  appointmentForm.value = {
    clientId: '',
    professionalId: typeof preselectedProfessionalId === 'string' ? preselectedProfessionalId : '',
    services: [],
    date: currentDateStr.value,
    startTime: '',
    clientNotes: ''
  }
  formError.value = ''
  availableSlots.value = []
  showNewModal.value = true

  if (appointmentForm.value.professionalId) {
    fetchAvailableSlots()
  }
}

// Save appointment
const saveAppointment = async () => {
  if (!currentBarbershop.value?.id) return

  const { professionalId, services, date, startTime } = appointmentForm.value
  if (!professionalId || !services.length || !date || !startTime) {
    formError.value = 'Preencha todos os campos obrigatórios'
    return
  }

  formError.value = ''
  saving.value = true

  try {
    await $fetch('/api/painel/appointments', {
      method: 'POST',
      body: {
        barbershopId: currentBarbershop.value.id,
        clientId: appointmentForm.value.clientId || null,
        professionalId,
        date,
        startTime,
        services,
        clientNotes: appointmentForm.value.clientNotes || null
      },
      headers: authHeaders.value
    })

    showNewModal.value = false
    await fetchAppointments()
  } catch (error: any) {
    formError.value = error.data?.message || 'Erro ao criar agendamento'
  } finally {
    saving.value = false
  }
}

// Update appointment status
const updateStatus = async (id: string, status: string) => {
  try {
    await $fetch(`/api/painel/appointments/${id}`, {
      method: 'PATCH',
      body: { status },
      headers: authHeaders.value
    })
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}

const getAppointmentClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'bg-emerald-500/10 border-emerald-500/30',
    'in_progress': 'bg-amber-500/10 border-amber-500/30',
    'confirmed': 'bg-blue-500/10 border-blue-500/30',
    'pending': 'bg-neutral-800/50 border-neutral-700',
    'cancelled': 'bg-red-500/10 border-red-500/30 opacity-60'
  }
  return classes[status] || classes['pending']
}

const getTimeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'text-emerald-400',
    'in_progress': 'text-amber-400',
    'confirmed': 'text-blue-400',
    'pending': 'text-neutral-400',
    'cancelled': 'text-red-400 line-through'
  }
  return classes[status] || classes['pending']
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'bg-emerald-500/20 text-emerald-400',
    'in_progress': 'bg-amber-500/20 text-amber-400',
    'confirmed': 'bg-blue-500/20 text-blue-400',
    'pending': 'bg-neutral-700 text-neutral-300',
    'cancelled': 'bg-red-500/20 text-red-400'
  }
  return classes[status] || classes['pending']
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'completed': 'Concluído',
    'in_progress': 'Atendendo',
    'confirmed': 'Confirmado',
    'pending': 'Pendente',
    'cancelled': 'Cancelado',
    'no_show': 'Não compareceu'
  }
  return labels[status] || 'Pendente'
}

// Watch date changes to refetch
watch(currentDateStr, () => {
  fetchAppointments()
})

// Watch barbershop changes
watch(() => currentBarbershop.value?.id, async (id) => {
  if (id) {
    await Promise.all([
      fetchAppointments(),
      fetchProfessionals(),
      fetchClients(),
      fetchServices()
    ])
  }
}, { immediate: true })

useSeoMeta({
  title: 'Agendamentos - Painel BarberPlus'
})
</script>
