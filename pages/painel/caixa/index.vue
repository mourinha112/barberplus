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
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          :disabled="transactions.length === 0"
          @click="exportCaixa"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          Exportar
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors"
          :class="cashRegisterOpen ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-500 text-black hover:bg-amber-400'"
          @click="toggleCashRegister"
        >
          <Icon :name="cashRegisterOpen ? 'lucide:lock' : 'lucide:unlock'" class="w-4 h-4" />
          {{ cashRegisterOpen ? 'Fechar Caixa' : 'Abrir Caixa' }}
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
        <p class="text-2xl font-bold text-emerald-400">R$ {{ totalIncome.toFixed(2) }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:trending-down" class="w-5 h-5 text-red-500" />
          <span class="text-xs text-neutral-500">Saídas</span>
        </div>
        <p class="text-2xl font-bold text-red-400">R$ {{ totalExpense.toFixed(2) }}</p>
      </div>
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:wallet" class="w-5 h-5 text-amber-500" />
          <span class="text-xs text-neutral-500">Comissões</span>
        </div>
        <p class="text-2xl font-bold text-amber-400">R$ {{ totalCommission.toFixed(2) }}</p>
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
          R$ {{ balance.toFixed(2) }}
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

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50 animate-pulse">
            <div class="w-10 h-10 rounded-xl bg-neutral-700" />
            <div class="flex-1">
              <div class="h-4 w-40 bg-neutral-700 rounded mb-2" />
              <div class="h-3 w-24 bg-neutral-700 rounded" />
            </div>
          </div>
        </div>

        <div v-else-if="transactions.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="lucide:inbox" class="w-12 h-12 text-neutral-700 mb-3" />
          <p class="text-neutral-500">Nenhuma movimentação hoje</p>
          <p class="text-sm text-neutral-600 mt-1">Clique em "Nova" para adicionar uma movimentação</p>
        </div>

        <div v-else class="space-y-3">
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
                {{ transaction.time }} {{ getPaymentLabel(transaction.payment_method || transaction.paymentMethod) }}
                <span v-if="transaction.professional"> {{ transaction.professional }}</span>
              </p>
            </div>
            <div class="text-right">
              <p
                class="text-sm font-semibold"
                :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}R$ {{ parseFloat(transaction.amount).toFixed(2) }}
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
                <span class="text-sm font-semibold text-white">R$ {{ method.amount.toFixed(2) }}</span>
              </div>
              <div class="h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="method.barColor"
                  :style="{ width: totalIncome > 0 ? `${(method.amount / totalIncome) * 100}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Performance -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Por Profissional</h3>

          <div v-if="professionalBreakdown.length === 0" class="flex flex-col items-center justify-center py-6 text-center">
            <Icon name="lucide:users" class="w-8 h-8 text-neutral-700 mb-2" />
            <p class="text-sm text-neutral-500">Sem atendimentos hoje</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="professional in professionalBreakdown"
              :key="professional.name"
              class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
            >
              <div class="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center text-amber-500 text-xs font-bold">
                {{ professional.name?.charAt(0) || '?' }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                <p class="text-[10px] text-neutral-500">{{ professional.count }} atend.</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-emerald-400">R$ {{ professional.revenue.toFixed(2) }}</p>
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
              required
              placeholder="Descrição da movimentação"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Valor (R$)</label>
            <input
              v-model="newTransaction.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
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
              <option value="pix">Pix</option>
              <option value="cash">Dinheiro</option>
              <option value="credit_card">Cartão Crédito</option>
              <option value="debit_card">Cartão Débito</option>
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
              :disabled="addingTransaction"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
            >
              {{ addingTransaction ? 'Adicionando...' : 'Adicionar' }}
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

const api = useApi()
const toast = useToast()

const currentDate = ref(new Date())
const showAddTransaction = ref(false)
const loading = ref(true)
const addingTransaction = ref(false)
const cashRegisterOpen = ref(false)

const formattedDate = computed(() => format(currentDate.value, "EEEE, d 'de' MMMM", { locale: ptBR }))

const previousDay = () => { currentDate.value = subDays(currentDate.value, 1); fetchData() }
const nextDay = () => { currentDate.value = addDays(currentDate.value, 1); fetchData() }
const goToToday = () => { currentDate.value = new Date(); fetchData() }

const transactions = ref<any[]>([])

const totalIncome = computed(() => transactions.value.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0))
const totalExpense = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0))
const totalCommission = computed(() => transactions.value.filter(t => t.type === 'commission').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0))
const balance = computed(() => totalIncome.value - totalExpense.value - totalCommission.value)
const totalAppointments = computed(() => transactions.value.filter(t => t.type === 'income' && t.professional).length)

const getPaymentLabel = (method: string) => {
  const labels: Record<string, string> = {
    pix: 'Pix', cash: 'Dinheiro', credit_card: 'Cartão Crédito',
    debit_card: 'Cartão Débito', transfer: 'Transferência'
  }
  return method ? `• ${labels[method] || method}` : ''
}

const paymentBreakdown = computed(() => {
  const methods = [
    { name: 'Pix', key: 'pix', icon: 'mdi:qrcode', iconColor: 'text-emerald-500', barColor: 'bg-emerald-500', amount: 0 },
    { name: 'Cartão Crédito', key: 'credit_card', icon: 'lucide:credit-card', iconColor: 'text-blue-500', barColor: 'bg-blue-500', amount: 0 },
    { name: 'Cartão Débito', key: 'debit_card', icon: 'lucide:credit-card', iconColor: 'text-violet-500', barColor: 'bg-violet-500', amount: 0 },
    { name: 'Dinheiro', key: 'cash', icon: 'lucide:banknote', iconColor: 'text-amber-500', barColor: 'bg-amber-500', amount: 0 }
  ]
  transactions.value.filter(t => t.type === 'income').forEach(t => {
    const pm = t.payment_method || t.paymentMethod || ''
    const method = methods.find(m => m.key === pm || m.name === pm)
    if (method) method.amount += parseFloat(t.amount || 0)
  })
  return methods
})

const professionalBreakdown = computed(() => {
  const map = new Map<string, { name: string; revenue: number; count: number }>()
  transactions.value.filter(t => t.type === 'income' && t.professional).forEach(t => {
    const existing = map.get(t.professional) || { name: t.professional, revenue: 0, count: 0 }
    existing.revenue += parseFloat(t.amount || 0)
    existing.count++
    map.set(t.professional, existing)
  })
  return Array.from(map.values())
})

const newTransaction = ref({
  description: '',
  amount: '',
  type: 'income',
  paymentMethod: 'pix'
})

const fetchData = async () => {
  loading.value = true
  try {
    const dateStr = format(currentDate.value, 'yyyy-MM-dd')

    const [transRes, cashRes] = await Promise.all([
      api.painel.getTransactions({ date: dateStr }).catch(() => ({ success: false })),
      api.painel.getCashRegister({ date: dateStr }).catch(() => ({ success: false }))
    ]) as any[]

    if (transRes.success) {
      transactions.value = (transRes.data || []).map((t: any) => ({
        id: t.id,
        description: t.description || '',
        amount: t.amount || 0,
        type: t.type || 'income',
        time: t.transaction_date ? format(new Date(t.transaction_date), 'HH:mm') : '',
        payment_method: t.payment_method || '',
        professional: t.professional?.name || '',
        commission: t.commission_amount || 0
      }))
    }

    if (cashRes.success && cashRes.data) {
      cashRegisterOpen.value = cashRes.data.is_open || false
    }
  } catch {
    // Show empty state
  } finally {
    loading.value = false
  }
}

const addTransaction = async () => {
  if (!newTransaction.value.description || !newTransaction.value.amount) return

  addingTransaction.value = true
  try {
    const response = await api.painel.createTransaction({
      description: newTransaction.value.description,
      amount: parseFloat(newTransaction.value.amount),
      type: newTransaction.value.type,
      payment_method: newTransaction.value.paymentMethod,
      transaction_date: new Date().toISOString()
    }) as any

    if (response.success !== false) {
      transactions.value.unshift({
        id: response.data?.id || Date.now(),
        description: newTransaction.value.description,
        amount: newTransaction.value.amount,
        type: newTransaction.value.type,
        time: format(new Date(), 'HH:mm'),
        payment_method: newTransaction.value.paymentMethod
      })
      toast.add({ title: 'Movimentação adicionada', icon: 'i-lucide-check', color: 'green' })
      showAddTransaction.value = false
      newTransaction.value = { description: '', amount: '', type: 'income', paymentMethod: 'pix' }
    }
  } catch {
    toast.add({ title: 'Erro ao adicionar', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    addingTransaction.value = false
  }
}

const toggleCashRegister = async () => {
  try {
    const action = cashRegisterOpen.value ? 'close' : 'open'
    await api.painel.manageCashRegister({ action, date: format(currentDate.value, 'yyyy-MM-dd') })
    cashRegisterOpen.value = !cashRegisterOpen.value
    toast.add({ title: cashRegisterOpen.value ? 'Caixa aberto' : 'Caixa fechado', icon: 'i-lucide-check', color: 'green' })
  } catch {
    toast.add({ title: 'Erro ao gerenciar caixa', icon: 'i-lucide-alert-circle', color: 'red' })
  }
}

const exportCaixa = () => {
  if (transactions.value.length === 0) return

  const lines = [
    `Caixa do Dia - ${formattedDate.value}`,
    '',
    'RESUMO',
    `Entradas;R$ ${totalIncome.value.toFixed(2)}`,
    `Saídas;R$ ${totalExpense.value.toFixed(2)}`,
    `Comissões;R$ ${totalCommission.value.toFixed(2)}`,
    `Saldo;R$ ${balance.value.toFixed(2)}`,
    `Atendimentos;${totalAppointments.value}`,
    '',
    'MOVIMENTAÇÕES',
    'Descrição;Valor;Tipo;Horário;Pagamento;Profissional',
    ...transactions.value.map(t =>
      `${t.description};R$ ${parseFloat(t.amount).toFixed(2)};${t.type === 'income' ? 'Entrada' : 'Saída'};${t.time};${getPaymentLabel(t.payment_method)};${t.professional || '-'}`
    )
  ]

  const csvContent = lines.join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `caixa-${format(currentDate.value, 'yyyy-MM-dd')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchData()
})

useSeoMeta({
  title: 'Caixa do Dia - Painel BarberPlus'
})
</script>
