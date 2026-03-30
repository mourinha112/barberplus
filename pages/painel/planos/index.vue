<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-white">
        Escolha o plano ideal para sua
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">barbearia</span>
      </h1>
      <p class="text-neutral-400 mt-3 text-lg">
        Comece grátis e evolua conforme sua necessidade
      </p>
    </div>

    <!-- Plano Atual -->
    <div v-if="currentPlan && currentPlan !== 'free'" class="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <Icon name="lucide:crown" class="w-5 h-5 text-amber-400" />
      <span class="text-amber-300 font-medium">
        Seu plano atual: <strong class="text-amber-400">{{ planNames[currentPlan] || currentPlan }}</strong>
      </span>
      <button
        @click="showCancelModal = true"
        class="ml-4 text-sm text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
      >
        Cancelar plano
      </button>
    </div>

    <!-- Cards de Planos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Gratuito -->
      <div class="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-white">Gratuito</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-4xl font-bold text-white">Grátis</span>
          </div>
          <p class="text-neutral-500 text-sm mt-2">Até 1 funcionário</p>
        </div>

        <ul class="space-y-3 flex-1">
          <li v-for="feature in allFeatures" :key="feature.key" class="flex items-center gap-3 text-sm">
            <Icon
              :name="freePlanFeatures.includes(feature.key) ? 'lucide:check' : 'lucide:x'"
              :class="freePlanFeatures.includes(feature.key) ? 'text-emerald-400 w-4 h-4 flex-shrink-0' : 'text-neutral-600 w-4 h-4 flex-shrink-0'"
            />
            <span :class="freePlanFeatures.includes(feature.key) ? 'text-neutral-300' : 'text-neutral-600'">
              {{ feature.label }}
            </span>
          </li>
        </ul>

        <button
          :disabled="currentPlan === 'free'"
          :class="currentPlan === 'free'
            ? 'mt-6 w-full py-3 rounded-xl bg-neutral-800 text-neutral-500 font-semibold cursor-not-allowed'
            : 'mt-6 w-full py-3 rounded-xl border border-neutral-700 text-white font-semibold hover:bg-neutral-800 transition-colors'"
        >
          {{ currentPlan === 'free' ? 'Plano atual' : 'Começar grátis' }}
        </button>
      </div>

      <!-- Profissional -->
      <div class="relative rounded-2xl border-2 border-amber-500/50 bg-neutral-900/80 p-6 flex flex-col ring-1 ring-amber-500/20">
        <!-- Badge Popular -->
        <div class="absolute -top-3 left-1/2 -translate-x-1/2">
          <span class="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold uppercase tracking-wider">
            Mais popular
          </span>
        </div>

        <div class="mb-6 mt-2">
          <h3 class="text-xl font-bold text-white">Profissional</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-4xl font-bold text-white">R$99</span>
            <span class="text-lg text-neutral-400">,90/mês</span>
          </div>
          <p class="text-neutral-500 text-sm mt-2">Até 2 funcionários</p>
        </div>

        <ul class="space-y-3 flex-1">
          <li v-for="feature in allFeatures" :key="feature.key" class="flex items-center gap-3 text-sm">
            <Icon
              :name="professionalPlanFeatures.includes(feature.key) ? 'lucide:check' : 'lucide:x'"
              :class="professionalPlanFeatures.includes(feature.key) ? 'text-amber-400 w-4 h-4 flex-shrink-0' : 'text-neutral-600 w-4 h-4 flex-shrink-0'"
            />
            <span :class="professionalPlanFeatures.includes(feature.key) ? 'text-neutral-300' : 'text-neutral-600'">
              {{ feature.label }}
            </span>
          </li>
        </ul>

        <div class="mt-6 space-y-2">
          <button
            @click="selectPlan('professional')"
            :disabled="subscribing || currentPlan === 'professional'"
            :class="currentPlan === 'professional'
              ? 'w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 font-semibold cursor-not-allowed'
              : 'w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20'"
          >
            <span v-if="subscribing && selectedPlan === 'professional'" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              Processando...
            </span>
            <span v-else>
              {{ currentPlan === 'professional' ? 'Plano atual' : 'Assinar agora' }}
            </span>
          </button>
          <p v-if="currentPlan !== 'professional'" class="text-center text-xs text-neutral-500">
            Testar 14 dias grátis
          </p>
        </div>
      </div>

      <!-- Pro -->
      <div class="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-white">Pro</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-4xl font-bold text-white">R$199</span>
            <span class="text-lg text-neutral-400">,90/mês</span>
          </div>
          <p class="text-neutral-500 text-sm mt-2">Até 5 funcionários</p>
        </div>

        <ul class="space-y-3 flex-1">
          <li v-for="feature in allFeatures" :key="feature.key" class="flex items-center gap-3 text-sm">
            <Icon
              name="lucide:check"
              class="text-emerald-400 w-4 h-4 flex-shrink-0"
            />
            <span class="text-neutral-300">{{ feature.label }}</span>
          </li>
        </ul>

        <button
          @click="selectPlan('pro')"
          :disabled="subscribing || currentPlan === 'pro'"
          :class="currentPlan === 'pro'
            ? 'mt-6 w-full py-3 rounded-xl bg-neutral-800 text-neutral-500 font-semibold cursor-not-allowed'
            : 'mt-6 w-full py-3 rounded-xl border border-amber-500 text-amber-400 font-semibold hover:bg-amber-500/10 transition-colors'"
        >
          <span v-if="subscribing && selectedPlan === 'pro'" class="flex items-center justify-center gap-2">
            <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            Processando...
          </span>
          <span v-else>
            {{ currentPlan === 'pro' ? 'Plano atual' : 'Assinar agora' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Comparação de Features -->
    <div class="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
      <div class="p-6 border-b border-neutral-800">
        <h2 class="text-xl font-bold text-white">Comparação completa</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-800">
              <th class="text-left text-sm font-medium text-neutral-400 p-4">Recurso</th>
              <th class="text-center text-sm font-medium text-neutral-400 p-4">Gratuito</th>
              <th class="text-center text-sm font-medium text-amber-400 p-4">Profissional</th>
              <th class="text-center text-sm font-medium text-neutral-400 p-4">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-neutral-800/50">
              <td class="p-4 text-sm text-neutral-300">Funcionários</td>
              <td class="p-4 text-center text-sm text-neutral-400">1</td>
              <td class="p-4 text-center text-sm text-amber-400 font-medium">2</td>
              <td class="p-4 text-center text-sm text-neutral-300 font-medium">5</td>
            </tr>
            <tr v-for="feature in allFeatures" :key="feature.key" class="border-b border-neutral-800/50">
              <td class="p-4 text-sm text-neutral-300">{{ feature.label }}</td>
              <td class="p-4 text-center">
                <Icon
                  :name="freePlanFeatures.includes(feature.key) ? 'lucide:check' : 'lucide:x'"
                  :class="freePlanFeatures.includes(feature.key) ? 'text-emerald-400 w-4 h-4 inline' : 'text-neutral-700 w-4 h-4 inline'"
                />
              </td>
              <td class="p-4 text-center">
                <Icon
                  :name="professionalPlanFeatures.includes(feature.key) ? 'lucide:check' : 'lucide:x'"
                  :class="professionalPlanFeatures.includes(feature.key) ? 'text-amber-400 w-4 h-4 inline' : 'text-neutral-700 w-4 h-4 inline'"
                />
              </td>
              <td class="p-4 text-center">
                <Icon name="lucide:check" class="text-emerald-400 w-4 h-4 inline" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal CPF/CNPJ -->
    <UModal v-model="showCpfModal" :ui="{ width: 'max-w-md' }">
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Icon name="lucide:credit-card" class="w-7 h-7 text-black" />
          </div>
          <h3 class="text-lg font-bold text-white">Confirmar assinatura</h3>
          <p class="text-neutral-400 text-sm mt-1">
            Plano <strong class="text-amber-400">{{ planNames[selectedPlan] }}</strong> — R${{ selectedPlan === 'professional' ? '99,90' : '199,90' }}/mês
          </p>
        </div>

        <form @submit.prevent="subscribe" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">CPF ou CNPJ *</label>
            <input
              v-model="cpfCnpj"
              type="text"
              placeholder="000.000.000-00"
              maxlength="18"
              @input="formatCpfCnpj"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              required
            />
            <p class="text-xs text-neutral-500 mt-1">Necessário para emissão da cobrança</p>
          </div>

          <p v-if="subscribeError" class="text-red-400 text-sm text-center">{{ subscribeError }}</p>

          <button
            type="submit"
            :disabled="subscribing || !cpfCnpj"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Icon v-if="subscribing" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <span>{{ subscribing ? 'Processando...' : 'Confirmar e pagar' }}</span>
          </button>

          <p class="text-xs text-neutral-500 text-center">
            Pagamento seguro via Asaas. Pix, cartão ou boleto.
          </p>
        </form>
      </div>
    </UModal>

    <!-- Modal Cancelar -->
    <UModal v-model="showCancelModal" :ui="{ width: 'max-w-md' }">
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Icon name="lucide:alert-triangle" class="w-7 h-7 text-red-400" />
          </div>
          <h3 class="text-lg font-bold text-white">Cancelar assinatura</h3>
          <p class="text-neutral-400 text-sm mt-2">
            Tem certeza? Você perderá acesso aos recursos premium e voltará para o plano gratuito.
          </p>
        </div>

        <p v-if="cancelError" class="text-red-400 text-sm text-center mb-4">{{ cancelError }}</p>

        <div class="flex gap-3">
          <button
            @click="showCancelModal = false"
            class="flex-1 py-3 rounded-xl border border-neutral-700 text-white font-semibold hover:bg-neutral-800 transition-colors"
          >
            Manter plano
          </button>
          <button
            @click="cancelSubscription"
            :disabled="cancelling"
            class="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Icon v-if="cancelling" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span>{{ cancelling ? 'Cancelando...' : 'Cancelar' }}</span>
          </button>
        </div>
      </div>
    </UModal>

    <!-- Toast de Sucesso -->
    <Transition name="fade">
      <div v-if="successMessage" class="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium shadow-2xl flex items-center gap-3">
        <Icon name="lucide:check-circle" class="w-5 h-5" />
        {{ successMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'painel' })

const { currentBarbershop } = useAuth()
const api = useApi()

const currentPlan = ref('free')
const selectedPlan = ref('')
const cpfCnpj = ref('')
const showCpfModal = ref(false)
const showCancelModal = ref(false)
const subscribing = ref(false)
const cancelling = ref(false)
const subscribeError = ref('')
const cancelError = ref('')
const successMessage = ref('')

const planNames: Record<string, string> = {
  free: 'Gratuito',
  professional: 'Profissional',
  pro: 'Pro',
}

const allFeatures = [
  { key: 'agendamentos', label: 'Agendamentos online' },
  { key: 'clientes', label: 'Gestão de clientes' },
  { key: 'fila', label: 'Fila virtual' },
  { key: 'link_bio', label: 'Link Bio' },
  { key: 'caixa', label: 'Caixa do dia' },
  { key: 'financeiro', label: 'Relatórios financeiros' },
  { key: 'whatsapp', label: 'WhatsApp Bot' },
  { key: 'fidelidade', label: 'Programa de fidelidade' },
  { key: 'avaliacoes', label: 'Avaliações e respostas' },
  { key: 'suporte_prioritario', label: 'Suporte prioritário' },
]

const freePlanFeatures = ['agendamentos', 'clientes', 'fila', 'link_bio', 'caixa']
const professionalPlanFeatures = ['agendamentos', 'clientes', 'fila', 'link_bio', 'caixa', 'financeiro', 'whatsapp', 'fidelidade']

// Buscar plano atual
const fetchSubscription = async () => {
  if (!currentBarbershop.value?.id) return
  try {
    const res = await api.get('/api/painel/subscription', {
      barbershopId: currentBarbershop.value.id
    })
    if (res.success) {
      currentPlan.value = res.data.plan || 'free'
    }
  } catch (e) {
    console.error('Erro ao buscar assinatura:', e)
  }
}

const selectPlan = (plan: string) => {
  selectedPlan.value = plan
  subscribeError.value = ''
  cpfCnpj.value = ''
  showCpfModal.value = true
}

const formatCpfCnpj = () => {
  let v = cpfCnpj.value.replace(/\D/g, '')
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    v = v.replace(/^(\d{2})(\d)/, '$1.$2')
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  }
  cpfCnpj.value = v
}

const subscribe = async () => {
  if (!currentBarbershop.value?.id || !selectedPlan.value) return

  subscribing.value = true
  subscribeError.value = ''

  try {
    const res = await api.post('/api/painel/subscription/subscribe', {
      barbershopId: currentBarbershop.value.id,
      plan: selectedPlan.value,
      cpfCnpj: cpfCnpj.value,
    })

    if (res.success) {
      showCpfModal.value = false
      currentPlan.value = res.data.plan

      if (res.data.invoiceUrl) {
        window.open(res.data.invoiceUrl, '_blank')
        successMessage.value = 'Assinatura criada! Complete o pagamento na nova aba.'
      } else {
        successMessage.value = res.data.message || 'Plano ativado com sucesso!'
      }

      setTimeout(() => { successMessage.value = '' }, 5000)
    }
  } catch (e: any) {
    subscribeError.value = e.data?.message || e.message || 'Erro ao processar assinatura'
  } finally {
    subscribing.value = false
  }
}

const cancelSubscription = async () => {
  if (!currentBarbershop.value?.id) return

  cancelling.value = true
  cancelError.value = ''

  try {
    const res = await api.post('/api/painel/subscription/cancel', {
      barbershopId: currentBarbershop.value.id,
    })

    if (res.success) {
      showCancelModal.value = false
      currentPlan.value = 'free'
      successMessage.value = 'Assinatura cancelada.'
      setTimeout(() => { successMessage.value = '' }, 5000)
    }
  } catch (e: any) {
    cancelError.value = e.data?.message || e.message || 'Erro ao cancelar'
  } finally {
    cancelling.value = false
  }
}

watch(() => currentBarbershop.value?.id, (id) => {
  if (id) fetchSubscription()
}, { immediate: true })

useSeoMeta({
  title: 'Planos - Painel BarberPlus'
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
