<template>
  <div class="space-y-6">
    <!-- Period Selector -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div class="flex items-center gap-2">
        <button 
          v-for="period in periods" 
          :key="period.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            selectedPeriod === period.value 
              ? 'bg-amber-500 text-black' 
              : 'bg-neutral-800 text-neutral-400 hover:text-white'
          ]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
      <button class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">
        <Icon name="lucide:download" class="w-4 h-4" />
        Exportar Relatório
      </button>
    </div>

    <!-- Main Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:trending-up" class="w-6 h-6 text-emerald-500" />
          <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            +18%
          </span>
        </div>
        <p class="text-3xl font-bold text-white">R$ {{ totalRevenue.toLocaleString('pt-BR') }}</p>
        <p class="text-sm text-neutral-500 mt-1">Receita total</p>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:trending-down" class="w-6 h-6 text-red-500" />
          <span class="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium">
            -5%
          </span>
        </div>
        <p class="text-3xl font-bold text-white">R$ {{ totalExpenses.toLocaleString('pt-BR') }}</p>
        <p class="text-sm text-neutral-500 mt-1">Despesas</p>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:wallet" class="w-6 h-6 text-amber-500" />
        </div>
        <p class="text-3xl font-bold text-amber-400">R$ {{ totalCommissions.toLocaleString('pt-BR') }}</p>
        <p class="text-sm text-neutral-500 mt-1">Comissões</p>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:piggy-bank" class="w-6 h-6 text-violet-500" />
          <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            +25%
          </span>
        </div>
        <p class="text-3xl font-bold text-emerald-400">R$ {{ netProfit.toLocaleString('pt-BR') }}</p>
        <p class="text-sm text-neutral-500 mt-1">Lucro líquido</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Receita vs Despesas</h3>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500" />
              <span class="text-xs text-neutral-400">Receita</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500" />
              <span class="text-xs text-neutral-400">Despesas</span>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="flex items-end justify-between h-48 gap-3">
          <div 
            v-for="(data, index) in chartData" 
            :key="index"
            class="flex-1 flex flex-col items-center gap-1"
          >
            <div class="w-full flex gap-1 items-end justify-center h-40">
              <div 
                class="w-5 rounded-t bg-emerald-500"
                :style="{ height: `${(data.revenue / maxValue) * 100}%` }"
              />
              <div 
                class="w-5 rounded-t bg-red-500/70"
                :style="{ height: `${(data.expense / maxValue) * 100}%` }"
              />
            </div>
            <span class="text-xs text-neutral-500">{{ data.label }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Formas de Pagamento</h3>
        
        <div class="space-y-4">
          <div v-for="method in paymentMethods" :key="method.name" class="flex items-center gap-3">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="method.bgColor"
            >
              <Icon :name="method.icon" class="w-5 h-5" :class="method.iconColor" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-neutral-300">{{ method.name }}</span>
                <span class="text-sm font-semibold text-white">{{ method.percentage }}%</span>
              </div>
              <div class="h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all"
                  :class="method.barColor"
                  :style="{ width: `${method.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-neutral-800">
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-400">Total recebido</span>
            <span class="font-bold text-white">R$ {{ totalRevenue.toLocaleString('pt-BR') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Últimas Transações</h3>
        <button class="text-sm text-amber-500 hover:text-amber-400">Ver todas</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-800">
              <th class="text-left px-4 py-3 text-xs font-medium text-neutral-500">Descrição</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-neutral-500">Categoria</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-neutral-500">Data</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-neutral-500">Pagamento</th>
              <th class="text-right px-4 py-3 text-xs font-medium text-neutral-500">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-neutral-800/30">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'"
                  >
                    <Icon 
                      :name="transaction.type === 'income' ? 'lucide:arrow-down-left' : 'lucide:arrow-up-right'" 
                      class="w-4 h-4"
                      :class="transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'"
                    />
                  </div>
                  <div>
                    <p class="text-sm text-white">{{ transaction.description }}</p>
                    <p class="text-xs text-neutral-500">{{ transaction.client }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300">
                  {{ transaction.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-neutral-400">{{ transaction.date }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <Icon :name="getPaymentIcon(transaction.payment)" class="w-4 h-4 text-neutral-400" />
                  <span class="text-sm text-neutral-300">{{ transaction.payment }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span 
                  class="text-sm font-semibold"
                  :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}R$ {{ transaction.amount }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Expenses Breakdown -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Despesas por Categoria</h3>
        <div class="space-y-4">
          <div v-for="expense in expenseCategories" :key="expense.name" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Icon :name="expense.icon" class="w-5 h-5 text-red-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-neutral-300">{{ expense.name }}</span>
                <span class="text-sm font-semibold text-white">R$ {{ expense.amount.toLocaleString('pt-BR') }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  class="h-full rounded-full bg-red-500"
                  :style="{ width: `${(expense.amount / totalExpenses) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Metas do Mês</h3>
        <div class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-neutral-400">Meta de Faturamento</span>
              <span class="text-sm text-white">R$ {{ totalRevenue.toLocaleString('pt-BR') }} / R$ 20.000</span>
            </div>
            <div class="h-3 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                :style="{ width: `${(totalRevenue / 20000) * 100}%` }"
              />
            </div>
            <p class="text-xs text-emerald-400 mt-1">{{ Math.round((totalRevenue / 20000) * 100) }}% alcançado</p>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-neutral-400">Meta de Atendimentos</span>
              <span class="text-sm text-white">246 / 300</span>
            </div>
            <div class="h-3 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                style="width: 82%"
              />
            </div>
            <p class="text-xs text-blue-400 mt-1">82% alcançado</p>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-neutral-400">Meta de Lucro</span>
              <span class="text-sm text-white">R$ {{ netProfit.toLocaleString('pt-BR') }} / R$ 10.000</span>
            </div>
            <div class="h-3 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                :style="{ width: `${(netProfit / 10000) * 100}%` }"
              />
            </div>
            <p class="text-xs text-violet-400 mt-1">{{ Math.round((netProfit / 10000) * 100) }}% alcançado</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const selectedPeriod = ref('month')

const periods = [
  { label: 'Hoje', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
  { label: 'Ano', value: 'year' }
]

const totalRevenue = ref(16580)
const totalExpenses = ref(4850)
const totalCommissions = ref(6577)
const netProfit = computed(() => totalRevenue.value - totalExpenses.value - totalCommissions.value)

const chartData = [
  { label: 'Jan', revenue: 14200, expense: 4100 },
  { label: 'Fev', revenue: 12800, expense: 3900 },
  { label: 'Mar', revenue: 15500, expense: 4200 },
  { label: 'Abr', revenue: 13900, expense: 4000 },
  { label: 'Mai', revenue: 16100, expense: 4500 },
  { label: 'Jun', revenue: 15200, expense: 4300 },
  { label: 'Jul', revenue: 16580, expense: 4850 }
]

const maxValue = computed(() => Math.max(...chartData.flatMap(d => [d.revenue, d.expense])))

const paymentMethods = [
  { name: 'Pix', percentage: 45, icon: 'mdi:qrcode', bgColor: 'bg-emerald-500/20', iconColor: 'text-emerald-500', barColor: 'bg-emerald-500' },
  { name: 'Cartão Crédito', percentage: 28, icon: 'lucide:credit-card', bgColor: 'bg-blue-500/20', iconColor: 'text-blue-500', barColor: 'bg-blue-500' },
  { name: 'Cartão Débito', percentage: 15, icon: 'lucide:credit-card', bgColor: 'bg-violet-500/20', iconColor: 'text-violet-500', barColor: 'bg-violet-500' },
  { name: 'Dinheiro', percentage: 12, icon: 'lucide:banknote', bgColor: 'bg-amber-500/20', iconColor: 'text-amber-500', barColor: 'bg-amber-500' }
]

const transactions = ref([
  { id: '1', description: 'Corte + Barba', client: 'João Silva', category: 'Serviço', date: '22/12/2024', payment: 'Pix', amount: '70,00', type: 'income' },
  { id: '2', description: 'Produtos de Barba', client: '', category: 'Despesa', date: '22/12/2024', payment: 'Cartão', amount: '250,00', type: 'expense' },
  { id: '3', description: 'Combo Premium', client: 'Pedro Santos', category: 'Serviço', date: '22/12/2024', payment: 'Cartão', amount: '120,00', type: 'income' },
  { id: '4', description: 'Degradê', client: 'Lucas Oliveira', category: 'Serviço', date: '21/12/2024', payment: 'Dinheiro', amount: '55,00', type: 'income' },
  { id: '5', description: 'Conta de Luz', client: '', category: 'Despesa', date: '20/12/2024', payment: 'Pix', amount: '380,00', type: 'expense' }
])

const expenseCategories = [
  { name: 'Comissões', amount: 6577, icon: 'lucide:users' },
  { name: 'Aluguel', amount: 2500, icon: 'lucide:home' },
  { name: 'Produtos', amount: 890, icon: 'lucide:package' },
  { name: 'Energia', amount: 380, icon: 'lucide:zap' },
  { name: 'Marketing', amount: 500, icon: 'lucide:megaphone' },
  { name: 'Outros', amount: 580, icon: 'lucide:more-horizontal' }
]

const getPaymentIcon = (payment: string) => {
  const icons: Record<string, string> = {
    'Pix': 'mdi:qrcode',
    'Cartão': 'lucide:credit-card',
    'Dinheiro': 'lucide:banknote'
  }
  return icons[payment] || 'lucide:circle'
}

useSeoMeta({
  title: 'Financeiro - Painel BarberPlus'
})
</script>

