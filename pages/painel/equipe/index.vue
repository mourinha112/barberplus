<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div>
        <p class="text-sm text-neutral-500">Gerencie sua equipe e comissões</p>
      </div>
      <button class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
        <Icon name="lucide:user-plus" class="w-4 h-4" />
        Adicionar Profissional
      </button>
    </div>

    <!-- Team Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Icon name="lucide:users" class="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ team.length }}</p>
        <p class="text-xs text-neutral-500">Profissionais ativos</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon name="lucide:dollar-sign" class="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-emerald-400">R$ {{ totalRevenue.toLocaleString('pt-BR') }}</p>
        <p class="text-xs text-neutral-500">Faturamento do mês</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-amber-400">R$ {{ totalCommissions.toLocaleString('pt-BR') }}</p>
        <p class="text-xs text-neutral-500">Total em comissões</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Icon name="lucide:scissors" class="w-5 h-5 text-violet-500" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ totalAppointments }}</p>
        <p class="text-xs text-neutral-500">Atendimentos do mês</p>
      </div>
    </div>

    <!-- Team Members -->
    <div class="grid md:grid-cols-2 gap-6">
      <div 
        v-for="member in team" 
        :key="member.id"
        class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-start gap-4 mb-6">
          <div class="relative">
            <div class="w-16 h-16 rounded-2xl overflow-hidden">
              <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
            </div>
            <span 
              class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900"
              :class="member.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-600'"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">{{ member.name }}</h3>
            <p class="text-sm text-neutral-500">{{ member.role }}</p>
            <div class="flex items-center gap-2 mt-1">
              <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="text-sm text-white">{{ member.rating }}</span>
              <span class="text-xs text-neutral-500">({{ member.reviews }} avaliações)</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
              <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
            </button>
            <button class="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
              <Icon name="lucide:more-vertical" class="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        <!-- Commission Info -->
        <div class="p-4 rounded-xl bg-neutral-800/50 mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-neutral-400">Taxa de comissão</span>
            <span class="text-sm font-bold text-amber-400">{{ member.commissionRate }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-400">Tipo</span>
            <span 
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="member.type === 'fixo' ? 'bg-blue-500/20 text-blue-400' : 'bg-violet-500/20 text-violet-400'"
            >
              {{ member.type === 'fixo' ? 'Salário Fixo' : 'Comissionado' }}
            </span>
          </div>
        </div>

        <!-- This Month Stats -->
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="text-center p-3 rounded-xl bg-neutral-800/30">
            <p class="text-lg font-bold text-white">{{ member.monthlyAppointments }}</p>
            <p class="text-[10px] text-neutral-500">Atendimentos</p>
          </div>
          <div class="text-center p-3 rounded-xl bg-neutral-800/30">
            <p class="text-lg font-bold text-emerald-400">R$ {{ member.monthlyRevenue.toLocaleString('pt-BR') }}</p>
            <p class="text-[10px] text-neutral-500">Faturado</p>
          </div>
          <div class="text-center p-3 rounded-xl bg-neutral-800/30">
            <p class="text-lg font-bold text-amber-400">R$ {{ member.monthlyCommission.toLocaleString('pt-BR') }}</p>
            <p class="text-[10px] text-neutral-500">Comissão</p>
          </div>
        </div>

        <!-- Today Stats -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div class="flex items-center gap-2">
            <Icon name="lucide:calendar-check" class="w-4 h-4 text-emerald-500" />
            <span class="text-sm text-neutral-300">Hoje</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-white">{{ member.todayAppointments }} atend.</span>
            <span class="text-sm font-semibold text-emerald-400">R$ {{ member.todayRevenue }}</span>
          </div>
        </div>

        <!-- Specialties -->
        <div class="mt-4">
          <p class="text-xs text-neutral-500 mb-2">Especialidades</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="specialty in member.specialties" 
              :key="specialty"
              class="px-2 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300"
            >
              {{ specialty }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Commission Breakdown -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Resumo de Comissões - Dezembro/2024</h3>
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:download" class="w-4 h-4" />
          Exportar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-800">
              <th class="text-left px-4 py-3 text-xs font-medium text-neutral-500">Profissional</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Atendimentos</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Faturamento</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Taxa</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Comissão</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr v-for="member in team" :key="member.id" class="hover:bg-neutral-800/30">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg overflow-hidden">
                    <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm text-white">{{ member.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right text-sm text-neutral-300">{{ member.monthlyAppointments }}</td>
              <td class="px-4 py-3 text-right text-sm text-emerald-400 font-medium">R$ {{ member.monthlyRevenue.toLocaleString('pt-BR') }}</td>
              <td class="px-4 py-3 text-right text-sm text-neutral-300">{{ member.commissionRate }}%</td>
              <td class="px-4 py-3 text-right text-sm text-amber-400 font-bold">R$ {{ member.monthlyCommission.toLocaleString('pt-BR') }}</td>
              <td class="px-4 py-3 text-right">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="member.paid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'"
                >
                  {{ member.paid ? 'Pago' : 'Pendente' }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-neutral-700">
              <td class="px-4 py-4 font-semibold text-white">Total</td>
              <td class="px-4 py-4 text-right font-semibold text-white">{{ totalAppointments }}</td>
              <td class="px-4 py-4 text-right font-semibold text-emerald-400">R$ {{ totalRevenue.toLocaleString('pt-BR') }}</td>
              <td class="px-4 py-4"></td>
              <td class="px-4 py-4 text-right font-bold text-amber-400 text-lg">R$ {{ totalCommissions.toLocaleString('pt-BR') }}</td>
              <td class="px-4 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const team = ref([
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    role: 'Barbeiro Master',
    rating: 4.9,
    reviews: 127,
    status: 'online',
    commissionRate: 50,
    type: 'comissao',
    monthlyAppointments: 89,
    monthlyRevenue: 6230,
    monthlyCommission: 3115,
    todayAppointments: 6,
    todayRevenue: 420,
    specialties: ['Degradê', 'Barba Navalhada', 'Pigmentação'],
    paid: false
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    role: 'Barbeiro Sênior',
    rating: 4.8,
    reviews: 89,
    status: 'online',
    commissionRate: 45,
    type: 'comissao',
    monthlyAppointments: 67,
    monthlyRevenue: 4690,
    monthlyCommission: 2110,
    todayAppointments: 4,
    todayRevenue: 280,
    specialties: ['Corte Social', 'Relaxamento', 'Hidratação'],
    paid: false
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    role: 'Barbeiro',
    rating: 4.7,
    reviews: 45,
    status: 'offline',
    commissionRate: 40,
    type: 'comissao',
    monthlyAppointments: 52,
    monthlyRevenue: 3380,
    monthlyCommission: 1352,
    todayAppointments: 0,
    todayRevenue: 0,
    specialties: ['Corte Infantil', 'Combo'],
    paid: true
  },
  {
    id: '4',
    name: 'Lucas Mendes',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=200&h=200&fit=crop',
    role: 'Barbeiro Jr.',
    rating: 4.5,
    reviews: 23,
    status: 'online',
    commissionRate: 35,
    type: 'fixo',
    monthlyAppointments: 38,
    monthlyRevenue: 2280,
    monthlyCommission: 1500,
    todayAppointments: 2,
    todayRevenue: 110,
    specialties: ['Corte Básico', 'Barba'],
    paid: false
  }
])

const totalRevenue = computed(() => team.value.reduce((acc, m) => acc + m.monthlyRevenue, 0))
const totalCommissions = computed(() => team.value.reduce((acc, m) => acc + m.monthlyCommission, 0))
const totalAppointments = computed(() => team.value.reduce((acc, m) => acc + m.monthlyAppointments, 0))

useSeoMeta({
  title: 'Equipe - Painel BarberPlus'
})
</script>

