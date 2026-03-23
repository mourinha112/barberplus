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
        </div>
        <p class="text-2xl font-bold text-white mb-1">R$ {{ stats.todayRevenue.toLocaleString('pt-BR') }}</p>
        <p class="text-xs text-neutral-500">Faturamento hoje</p>
      </div>

      <!-- Agendamentos Hoje -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Icon name="lucide:calendar-check" class="w-5 h-5 text-blue-500" />
          </div>
          <span v-if="stats.totalAppointments > 0" class="text-xs text-neutral-500">
            {{ stats.completedAppointments }}/{{ stats.totalAppointments }}
          </span>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ stats.totalAppointments }}</p>
        <p class="text-xs text-neutral-500">Agendamentos hoje</p>
        <!-- Progress bar -->
        <div v-if="stats.totalAppointments > 0" class="mt-2 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            class="h-full bg-blue-500 rounded-full transition-all"
            :style="{ width: `${(stats.completedAppointments / stats.totalAppointments) * 100}%` }"
          />
        </div>
      </div>

      <!-- Clientes -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Icon name="lucide:users" class="w-5 h-5 text-violet-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ stats.totalClients }}</p>
        <p class="text-xs text-neutral-500">Clientes cadastrados</p>
      </div>

      <!-- Serviços -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Icon name="lucide:scissors" class="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white mb-1">{{ stats.totalServices }}</p>
        <p class="text-xs text-neutral-500">Serviços ativos</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Ações Rápidas -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Primeiros Passos</h3>

        <div class="grid sm:grid-cols-2 gap-4">
          <NuxtLink
            to="/painel/configuracoes"
            class="p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Icon name="lucide:settings" class="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p class="font-medium text-white">Configurar Barbearia</p>
                <p class="text-sm text-neutral-500">Logo, endereço, horários</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/painel/servicos"
            class="p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Icon name="lucide:scissors" class="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p class="font-medium text-white">Cadastrar Serviços</p>
                <p class="text-sm text-neutral-500">Cortes, barbas, combos</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/painel/equipe"
            class="p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                <Icon name="lucide:users" class="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <p class="font-medium text-white">Adicionar Equipe</p>
                <p class="text-sm text-neutral-500">Barbeiros e profissionais</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/painel/link-bio"
            class="p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Icon name="lucide:link" class="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p class="font-medium text-white">Criar Link Bio</p>
                <p class="text-sm text-neutral-500">Página de agendamento</p>
              </div>
            </div>
          </NuxtLink>
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
            <div class="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ appointment.clientInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ appointment.clientName }}</p>
              <p class="text-xs text-neutral-500">{{ appointment.serviceName }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-amber-400">{{ appointment.time }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="upcomingAppointments.length === 0" class="text-center py-8">
          <Icon name="lucide:calendar-x" class="w-12 h-12 text-neutral-700 mx-auto mb-2" />
          <p class="text-sm text-neutral-500">Nenhum agendamento</p>
          <p class="text-xs text-neutral-600">Os agendamentos aparecerão aqui</p>
        </div>
      </div>
    </div>

    <!-- Dicas -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900/50 to-neutral-900/50 border border-amber-500/20">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon name="lucide:lightbulb" class="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Dica do Sistema</h3>
          <p class="text-neutral-400 text-sm">
            Configure sua barbearia completamente para aparecer no marketplace e começar a receber agendamentos online.
            Adicione fotos, serviços com preços, horários de funcionamento e sua equipe de profissionais.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const currentBarbershop = inject<Ref<any>>('currentBarbershop')
const { authHeaders } = useAuth()

// Stats - dados reais (zerados por padrão)
const stats = ref({
  todayRevenue: 0,
  totalAppointments: 0,
  completedAppointments: 0,
  totalClients: 0,
  totalServices: 0
})

// Próximos agendamentos - vazio por padrão
const upcomingAppointments = ref<any[]>([])

// Buscar dados quando tiver barbearia selecionada
watch(currentBarbershop, async (barbershop) => {
  if (barbershop?.id) {
    await fetchStats()
    await fetchUpcomingAppointments()
  }
}, { immediate: true })

const fetchStats = async () => {
  if (!currentBarbershop?.value?.id) return

  try {
    const response = await $fetch('/api/painel/dashboard/stats', {
      headers: authHeaders.value,
      params: { barbershopId: currentBarbershop.value.id }
    }) as any

    if (response.success && response.data) {
      stats.value = {
        todayRevenue: response.data.todayRevenue || 0,
        totalAppointments: response.data.totalAppointments || 0,
        completedAppointments: response.data.completedAppointments || 0,
        totalClients: response.data.totalClients || 0,
        totalServices: response.data.totalServices || 0
      }
    }
  } catch {
    // Stats ficam zeradas se der erro
  }
}

const fetchUpcomingAppointments = async () => {
  if (!currentBarbershop?.value?.id) return

  try {
    const response = await $fetch('/api/painel/appointments', {
      headers: authHeaders.value,
      params: {
        barbershopId: currentBarbershop.value.id,
        status: 'confirmed',
        limit: 5
      }
    }) as any

    if (response.success && response.data) {
      upcomingAppointments.value = (response.data || []).map((apt: any) => ({
        id: apt.id,
        clientName: apt.client_name || apt.clientName || 'Cliente',
        clientInitials: (apt.client_name || apt.clientName || 'C')[0].toUpperCase(),
        serviceName: apt.service_name || apt.serviceName || 'Serviço',
        time: apt.start_time ? new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
      }))
    }
  } catch {
    // Agendamentos ficam vazios se der erro
  }
}

useSeoMeta({
  title: 'Dashboard - Painel BarberPlus'
})
</script>
