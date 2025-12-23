<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
          activeTab === tab.value 
            ? 'bg-amber-500 text-black' 
            : 'bg-neutral-800 text-neutral-400 hover:text-white'
        ]"
        @click="activeTab = tab.value"
      >
        <Icon :name="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Informações da Barbearia -->
    <div v-if="activeTab === 'info'" class="space-y-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Informações Básicas</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome da barbearia</label>
            <input 
              v-model="settings.name"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">CNPJ</label>
            <input 
              v-model="settings.cnpj"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Telefone</label>
            <input 
              v-model="settings.phone"
              type="tel"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Email</label>
            <input 
              v-model="settings.email"
              type="email"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-neutral-400 mb-2">Descrição</label>
            <textarea 
              v-model="settings.description"
              rows="3"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Endereço</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">CEP</label>
            <input 
              v-model="settings.address.cep"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Rua</label>
            <input 
              v-model="settings.address.street"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Número</label>
            <input 
              v-model="settings.address.number"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Bairro</label>
            <input 
              v-model="settings.address.neighborhood"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Cidade</label>
            <input 
              v-model="settings.address.city"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Estado</label>
            <input 
              v-model="settings.address.state"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Horários -->
    <div v-if="activeTab === 'hours'" class="space-y-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Horário de Funcionamento</h3>
        <div class="space-y-4">
          <div 
            v-for="day in settings.hours" 
            :key="day.day"
            class="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50"
          >
            <label class="flex items-center gap-3 min-w-[140px]">
              <input 
                type="checkbox" 
                v-model="day.active"
                class="w-4 h-4 rounded bg-neutral-700 border-neutral-600 text-amber-500 focus:ring-amber-500/50"
              />
              <span class="text-sm font-medium" :class="day.active ? 'text-white' : 'text-neutral-500'">
                {{ day.day }}
              </span>
            </label>
            <div class="flex items-center gap-2" v-if="day.active">
              <input 
                v-model="day.open"
                type="time"
                class="px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm focus:border-amber-500/50 focus:outline-none"
              />
              <span class="text-neutral-500">até</span>
              <input 
                v-model="day.close"
                type="time"
                class="px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <span v-else class="text-sm text-neutral-500">Fechado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistema Anti-Falta -->
    <div v-if="activeTab === 'antifalta'" class="space-y-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-white">Sistema Anti-Falta</h3>
            <p class="text-sm text-neutral-500">Proteja sua agenda contra faltas</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.antiFalta.active" class="sr-only peer">
            <div class="w-14 h-7 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div v-if="settings.antiFalta.active" class="space-y-6">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Valor do Sinal (R$)</label>
            <input 
              v-model="settings.antiFalta.signalValue"
              type="number"
              class="w-full max-w-xs px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
            <p class="text-xs text-neutral-500 mt-2">Valor cobrado antecipadamente para confirmar o agendamento</p>
          </div>

          <div>
            <label class="block text-sm text-neutral-400 mb-2">Prazo de cancelamento</label>
            <select 
              v-model="settings.antiFalta.cancelDeadline"
              class="w-full max-w-xs px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            >
              <option value="1">1 hora antes</option>
              <option value="2">2 horas antes</option>
              <option value="4">4 horas antes</option>
              <option value="12">12 horas antes</option>
              <option value="24">24 horas antes</option>
            </select>
            <p class="text-xs text-neutral-500 mt-2">Cliente pode cancelar e receber reembolso até este prazo</p>
          </div>

          <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <h4 class="text-sm font-semibold text-amber-400 mb-2">Como funciona?</h4>
            <ul class="text-xs text-neutral-400 space-y-1">
              <li>• Cliente paga R$ {{ settings.antiFalta.signalValue }} ao agendar</li>
              <li>• Valor é descontado do serviço no dia</li>
              <li>• Se faltar, você fica com o sinal como compensação</li>
              <li>• Cancelamentos até {{ settings.antiFalta.cancelDeadline }}h antes são reembolsados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagamentos -->
    <div v-if="activeTab === 'payments'" class="space-y-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Formas de Pagamento Aceitas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <input 
              type="checkbox" 
              v-model="method.active"
              class="w-4 h-4 rounded bg-neutral-700 border-neutral-600 text-amber-500 focus:ring-amber-500/50"
            />
            <Icon :name="method.icon" class="w-5 h-5" :class="method.iconColor" />
            <span class="text-sm text-white">{{ method.name }}</span>
          </label>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Chave Pix</h3>
        <div class="flex items-center gap-4">
          <select 
            v-model="settings.pix.type"
            class="px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
          >
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
            <option value="email">Email</option>
            <option value="phone">Telefone</option>
            <option value="random">Chave aleatória</option>
          </select>
          <input 
            v-model="settings.pix.key"
            type="text"
            placeholder="Digite sua chave Pix"
            class="flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Notificações -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Preferências de Notificação</h3>
        <div class="space-y-4">
          <div 
            v-for="notification in settings.notifications" 
            :key="notification.id"
            class="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50"
          >
            <div class="flex items-center gap-3">
              <Icon :name="notification.icon" class="w-5 h-5 text-neutral-400" />
              <div>
                <p class="text-sm font-medium text-white">{{ notification.name }}</p>
                <p class="text-xs text-neutral-500">{{ notification.description }}</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notification.active" class="sr-only peer">
              <div class="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button class="px-8 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
        Salvar Alterações
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const activeTab = ref('info')

const tabs = [
  { value: 'info', label: 'Informações', icon: 'lucide:building' },
  { value: 'hours', label: 'Horários', icon: 'lucide:clock' },
  { value: 'antifalta', label: 'Anti-Falta', icon: 'lucide:shield' },
  { value: 'payments', label: 'Pagamentos', icon: 'lucide:credit-card' },
  { value: 'notifications', label: 'Notificações', icon: 'lucide:bell' }
]

const settings = ref({
  name: 'Barbearia Premium',
  cnpj: '12.345.678/0001-90',
  phone: '(79) 99999-1234',
  email: 'contato@barbeariapremium.com',
  description: 'A melhor barbearia da cidade. Especializada em cortes modernos, degradê perfeito e barba impecável.',
  address: {
    cep: '49000-000',
    street: 'Rua das Palmeiras',
    number: '123',
    neighborhood: 'Centro',
    city: 'Aracaju',
    state: 'SE'
  },
  hours: [
    { day: 'Segunda-feira', active: true, open: '09:00', close: '19:00' },
    { day: 'Terça-feira', active: true, open: '09:00', close: '19:00' },
    { day: 'Quarta-feira', active: true, open: '09:00', close: '19:00' },
    { day: 'Quinta-feira', active: true, open: '09:00', close: '19:00' },
    { day: 'Sexta-feira', active: true, open: '09:00', close: '20:00' },
    { day: 'Sábado', active: true, open: '08:00', close: '18:00' },
    { day: 'Domingo', active: false, open: '09:00', close: '13:00' }
  ],
  antiFalta: {
    active: true,
    signalValue: 20,
    cancelDeadline: '2'
  },
  pix: {
    type: 'cnpj',
    key: '12.345.678/0001-90'
  },
  notifications: [
    { id: '1', name: 'Novo agendamento', description: 'Receber notificação quando houver novo agendamento', icon: 'lucide:calendar-plus', active: true },
    { id: '2', name: 'Cancelamento', description: 'Receber notificação quando cliente cancelar', icon: 'lucide:calendar-x', active: true },
    { id: '3', name: 'Nova avaliação', description: 'Receber notificação quando receber avaliação', icon: 'lucide:star', active: true },
    { id: '4', name: 'Fila virtual', description: 'Notificações sobre a fila virtual', icon: 'lucide:users', active: false },
    { id: '5', name: 'Relatório diário', description: 'Receber resumo diário por email', icon: 'lucide:mail', active: true }
  ]
})

const paymentMethods = ref([
  { id: '1', name: 'Pix', icon: 'mdi:qrcode', iconColor: 'text-emerald-500', active: true },
  { id: '2', name: 'Dinheiro', icon: 'lucide:banknote', iconColor: 'text-green-500', active: true },
  { id: '3', name: 'Crédito', icon: 'lucide:credit-card', iconColor: 'text-blue-500', active: true },
  { id: '4', name: 'Débito', icon: 'lucide:credit-card', iconColor: 'text-violet-500', active: true }
])

useSeoMeta({
  title: 'Configurações - Painel BarberPlus'
})
</script>

