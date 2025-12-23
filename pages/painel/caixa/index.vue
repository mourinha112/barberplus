<template>
  <div class="space-y-6">
    <!-- Date Selector -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          class="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          @click="previousDay"
        >
          <Icon name="lucide:chevron-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <div class="text-center">
          <h2 class="text-lg font-semibold text-white">{{ formattedDate }}</h2>
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
          <Icon name="lucide:download" class="w-4 h-4" />
          Exportar
        </button>
        <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
          <Icon name="lucide:lock" class="w-4 h-4" />
          Fechar Caixa
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:trending-up" class="w-5 h-5 text-emerald-500" />
          <span class="text-xs text-neutral-500">Entradas</span>
        </div>
        <p class="text-2xl font-bold text-emerald-400">R$ {{ totalIncome.toLocaleString('pt-BR') }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:trending-down" class="w-5 h-5 text-red-500" />
          <span class="text-xs text-neutral-500">Saídas</span>
        </div>
        <p class="text-2xl font-bold text-red-400">R$ {{ totalExpense.toLocaleString('pt-BR') }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:wallet" class="w-5 h-5 text-amber-500" />
          <span class="text-xs text-neutral-500">Comissões</span>
        </div>
        <p class="text-2xl font-bold text-amber-400">R$ {{ totalCommission.toLocaleString('pt-BR') }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:receipt" class="w-5 h-5 text-blue-500" />
          <span class="text-xs text-neutral-500">Atendimentos</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ totalAppointments }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:banknote" class="w-5 h-5 text-violet-500" />
          <span class="text-xs text-neutral-500">Saldo</span>
        </div>
        <p class="text-2xl font-bold" :class="balance >= 0 ? 'text-emerald-400' : 'text-red-400'">
          R$ {{ balance.toLocaleString('pt-BR') }}
        </p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Transactions -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Movimentações do Dia</h3>
          <button 
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
            @click="showAddTransaction = true"
          >
            <Icon name="lucide:plus" class="w-4 h-4" />
            Nova
          </button>
        </div>

        <div class="space-y-3">
          <div 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          >
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'"
            >
              <Icon 
                :name="transaction.type === 'income' ? 'lucide:arrow-down-left' : 'lucide:arrow-up-right'" 
                class="w-5 h-5"
                :class="transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ transaction.description }}</p>
              <p class="text-xs text-neutral-500">
                {{ transaction.time }} • {{ transaction.paymentMethod }}
                <span v-if="transaction.professional"> • {{ transaction.professional }}</span>
              </p>
            </div>
            <div class="text-right">
              <p 
                class="text-sm font-semibold"
                :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}R$ {{ transaction.amount }}
              </p>
              <p v-if="transaction.commission" class="text-[10px] text-amber-400">
                Comissão: R$ {{ transaction.commission }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods Breakdown -->
      <div class="space-y-6">
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Por Forma de Pagamento</h3>
          <div class="space-y-4">
            <div v-for="method in paymentBreakdown" :key="method.name">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <Icon :name="method.icon" class="w-4 h-4" :class="method.iconColor" />
                  <span class="text-sm text-neutral-300">{{ method.name }}</span>
                </div>
                <span class="text-sm font-semibold text-white">R$ {{ method.amount }}</span>
              </div>
              <div class="h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all"
                  :class="method.barColor"
                  :style="{ width: `${(method.amount / totalIncome) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Performance -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Por Profissional</h3>
          <div class="space-y-3">
            <div 
              v-for="professional in professionalBreakdown" 
              :key="professional.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
            >
              <div class="w-8 h-8 rounded-lg overflow-hidden">
                <img :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                <p class="text-[10px] text-neutral-500">{{ professional.appointments }} atend.</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-emerald-400">R$ {{ professional.revenue }}</p>
                <p class="text-[10px] text-amber-400">-R$ {{ professional.commission }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <UModal v-model="showAddTransaction">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">Nova Movimentação</h2>
        <form @submit.prevent="addTransaction" class="space-y-4">
          <div class="flex gap-2">
            <button 
              type="button"
              :class="[
                'flex-1 py-3 rounded-xl font-medium transition-colors',
                newTransaction.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'
              ]"
              @click="newTransaction.type = 'income'"
            >
              Entrada
            </button>
            <button 
              type="button"
              :class="[
                'flex-1 py-3 rounded-xl font-medium transition-colors',
                newTransaction.type === 'expense' ? 'bg-red-500 text-white' : 'bg-neutral-800 text-neutral-400'
              ]"
              @click="newTransaction.type = 'expense'"
            >
              Saída
            </button>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Descrição</label>
            <input 
              v-model="newTransaction.description"
              type="text"
              placeholder="Descrição da movimentação"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Valor (R$)</label>
            <input 
              v-model="newTransaction.amount"
              type="number"
              placeholder="0,00"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Forma de pagamento</label>
            <select 
              v-model="newTransaction.paymentMethod"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão Crédito">Cartão Crédito</option>
              <option value="Cartão Débito">Cartão Débito</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="showAddTransaction = false"
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
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  layout: 'painel'
})

const currentDate = ref(new Date())
const showAddTransaction = ref(false)

const formattedDate = computed(() => format(currentDate.value, "EEEE, d 'de' MMMM", { locale: ptBR }))

const previousDay = () => { currentDate.value = subDays(currentDate.value, 1) }
const nextDay = () => { currentDate.value = addDays(currentDate.value, 1) }
const goToToday = () => { currentDate.value = new Date() }

const transactions = ref([
  { id: '1', description: 'Corte + Barba - João Silva', amount: '70', type: 'income', time: '09:30', paymentMethod: 'Pix', professional: 'Carlos', commission: '35' },
  { id: '2', description: 'Degradê - Pedro Santos', amount: '55', type: 'income', time: '10:00', paymentMethod: 'Cartão Débito', professional: 'João', commission: '27,50' },
  { id: '3', description: 'Combo Premium - Lucas Oliveira', amount: '120', type: 'income', time: '11:00', paymentMethod: 'Pix', professional: 'Carlos', commission: '54' },
  { id: '4', description: 'Produtos de limpeza', amount: '85', type: 'expense', time: '12:00', paymentMethod: 'Pix', professional: null, commission: null },
  { id: '5', description: 'Barba - Rafael Costa', amount: '35', type: 'income', time: '14:00', paymentMethod: 'Dinheiro', professional: 'Pedro', commission: '14' },
  { id: '6', description: 'Corte Social - Thiago Souza', amount: '50', type: 'income', time: '14:30', paymentMethod: 'Cartão Crédito', professional: 'João', commission: '22,50' },
  { id: '7', description: 'Corte + Barba - Bruno Lima', amount: '70', type: 'income', time: '15:30', paymentMethod: 'Pix', professional: 'Carlos', commission: '35' }
])

const totalIncome = computed(() => transactions.value.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0))
const totalExpense = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0))
const totalCommission = computed(() => transactions.value.filter(t => t.commission).reduce((acc, t) => acc + parseFloat(t.commission!.replace(',', '.')), 0))
const balance = computed(() => totalIncome.value - totalExpense.value - totalCommission.value)
const totalAppointments = computed(() => transactions.value.filter(t => t.type === 'income' && t.professional).length)

const paymentBreakdown = computed(() => [
  { name: 'Pix', icon: 'mdi:qrcode', iconColor: 'text-emerald-500', barColor: 'bg-emerald-500', amount: 295 },
  { name: 'Cartão Crédito', icon: 'lucide:credit-card', iconColor: 'text-blue-500', barColor: 'bg-blue-500', amount: 50 },
  { name: 'Cartão Débito', icon: 'lucide:credit-card', iconColor: 'text-violet-500', barColor: 'bg-violet-500', amount: 55 },
  { name: 'Dinheiro', icon: 'lucide:banknote', iconColor: 'text-amber-500', barColor: 'bg-amber-500', amount: 35 }
])

const professionalBreakdown = ref([
  { id: '1', name: 'Carlos Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', appointments: 3, revenue: 260, commission: 124 },
  { id: '2', name: 'João Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', appointments: 2, revenue: 105, commission: 50 },
  { id: '3', name: 'Pedro Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', appointments: 1, revenue: 35, commission: 14 }
])

const newTransaction = ref({
  description: '',
  amount: '',
  type: 'income',
  paymentMethod: 'Pix'
})

const addTransaction = () => {
  showAddTransaction.value = false
}

useSeoMeta({
  title: 'Caixa do Dia - Painel BarberPlus'
})
</script>

