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
      <!-- Logo e Capa -->
      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Logo e Imagens</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Logo -->
          <div>
            <label class="block text-sm text-neutral-400 mb-3">Logo da Barbearia</label>
            <div class="flex items-center gap-4">
              <div class="relative">
                <div 
                  class="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden border-2 border-amber-500/30"
                >
                  <template v-if="settings.logoUrl">
                    <img :src="settings.logoUrl" alt="Logo" class="w-full h-full object-cover" />
                  </template>
                  <template v-else>
                    <Icon name="lucide:scissors" class="w-12 h-12 text-black" />
                  </template>
                </div>
                <button 
                  class="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-lg"
                  @click="openLogoUpload"
                >
                  <Icon name="lucide:camera" class="w-4 h-4" />
                </button>
              </div>
              <div class="flex-1">
                <input
                  v-model="settings.logoUrl"
                  type="url"
                  placeholder="Cole a URL do logo"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none text-sm"
                />
                <p class="text-xs text-neutral-500 mt-2">Tamanho recomendado: 200x200px</p>
              </div>
            </div>
          </div>

          <!-- Capa -->
          <div>
            <label class="block text-sm text-neutral-400 mb-3">Imagem de Capa</label>
            <div 
              class="relative h-32 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden group cursor-pointer"
              @click="openCoverUpload"
            >
              <template v-if="settings.coverUrl">
                <img :src="settings.coverUrl" alt="Capa" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <div class="w-full h-full flex flex-col items-center justify-center">
                  <Icon name="lucide:image" class="w-10 h-10 text-neutral-600 mb-2" />
                  <span class="text-xs text-neutral-500">Adicionar capa</span>
                </div>
              </template>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon name="lucide:camera" class="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              v-model="settings.coverUrl"
              type="url"
              placeholder="Cole a URL da capa"
              class="w-full mt-3 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6">Informações Básicas</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome da barbearia *</label>
            <input 
              v-model="settings.name"
              type="text"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Slug (URL) *</label>
            <div class="flex items-center">
              <span class="px-4 py-3 rounded-l-xl bg-neutral-700 text-neutral-400 text-sm border border-r-0 border-neutral-700">barberplus.com/</span>
              <input 
                v-model="settings.slug"
                type="text"
                class="flex-1 px-4 py-3 rounded-r-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
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
            <label class="block text-sm text-neutral-400 mb-2">WhatsApp</label>
            <input 
              v-model="settings.whatsapp"
              type="tel"
              placeholder="(79) 99999-9999"
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
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
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Website</label>
            <input 
              v-model="settings.website"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Instagram</label>
            <div class="flex items-center">
              <span class="px-4 py-3 rounded-l-xl bg-neutral-700 text-neutral-400 text-sm border border-r-0 border-neutral-700">@</span>
              <input 
                v-model="settings.instagram"
                type="text"
                placeholder="usuario"
                class="flex-1 px-4 py-3 rounded-r-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-neutral-400 mb-2">Descrição</label>
            <textarea 
              v-model="settings.description"
              rows="3"
              placeholder="Descreva sua barbearia..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
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
              @blur="fetchAddress"
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
            <label class="block text-sm text-neutral-400 mb-2">Complemento</label>
            <input 
              v-model="settings.address.complement"
              type="text"
              placeholder="Sala, andar..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
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

      <!-- Link Público -->
      <div class="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 class="text-lg font-semibold text-white flex items-center gap-2">
              <Icon name="lucide:link" class="w-5 h-5 text-amber-500" />
              Link Público da Barbearia
            </h3>
            <p class="text-sm text-neutral-400 mt-1">Compartilhe este link com seus clientes para agendamentos</p>
            <div class="mt-3 flex items-center gap-2">
              <code class="px-4 py-2 rounded-xl bg-neutral-800 text-amber-400 text-sm font-mono">
                barberplus.com/{{ settings.slug || 'sua-barbearia' }}
              </code>
              <button 
                class="p-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                @click="copyLink"
              >
                <Icon name="lucide:copy" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm hover:bg-neutral-700 transition-colors">
              <Icon name="lucide:qr-code" class="w-4 h-4" />
              QR Code
            </button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors">
              <Icon name="lucide:external-link" class="w-4 h-4" />
              Visitar
            </button>
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

    <!-- Success/Error Toast -->
    <div v-if="saveMessage" class="fixed bottom-6 right-6 z-50">
      <div 
        :class="[
          'px-6 py-3 rounded-xl shadow-lg flex items-center gap-2',
          saveSuccess ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        <Icon :name="saveSuccess ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        {{ saveMessage }}
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3">
      <button 
        class="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        @click="resetChanges"
      >
        Descartar
      </button>
      <button 
        :disabled="saving"
        class="px-8 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
        @click="saveSettings"
      >
        <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const { currentBarbershop, authHeaders } = useAuth()

const activeTab = ref('info')
const saving = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)

const tabs = [
  { value: 'info', label: 'Informações', icon: 'lucide:building' },
  { value: 'hours', label: 'Horários', icon: 'lucide:clock' },
  { value: 'antifalta', label: 'Anti-Falta', icon: 'lucide:shield' },
  { value: 'payments', label: 'Pagamentos', icon: 'lucide:credit-card' },
  { value: 'notifications', label: 'Notificações', icon: 'lucide:bell' }
]

const settings = ref({
  name: 'Barbearia Premium',
  slug: 'barbearia-premium',
  logoUrl: '',
  coverUrl: '',
  cnpj: '12.345.678/0001-90',
  whatsapp: '(79) 99999-1234',
  phone: '(79) 3333-4444',
  email: 'contato@barbeariapremium.com',
  website: '',
  instagram: 'barbeariapremium',
  description: 'A melhor barbearia da cidade. Especializada em cortes modernos, degradê perfeito e barba impecável.',
  address: {
    cep: '49000-000',
    street: 'Rua das Palmeiras',
    number: '123',
    complement: '',
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

// Fetch barbershop settings on mount
const fetchSettings = async () => {
  if (!currentBarbershop.value?.id) return
  
  try {
    const response = await $fetch<any>(`/api/painel/barbershop/${currentBarbershop.value.id}`, {
      headers: authHeaders.value
    })
    
    if (response.success && response.data) {
      const data = response.data
      settings.value = {
        ...settings.value,
        name: data.name || '',
        slug: data.slug || '',
        logoUrl: data.logo_url || '',
        coverUrl: data.cover_url || '',
        whatsapp: data.whatsapp || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        description: data.description || '',
        address: {
          cep: data.address_zip || '',
          street: data.address_street || '',
          number: data.address_number || '',
          complement: data.address_complement || '',
          neighborhood: data.address_neighborhood || '',
          city: data.address_city || '',
          state: data.address_state || ''
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
  }
}

watch(() => currentBarbershop.value?.id, fetchSettings, { immediate: true })

const openLogoUpload = () => {
  // TODO: Implement file upload
}

const openCoverUpload = () => {
  // TODO: Implement file upload
}

const fetchAddress = async () => {
  const cep = settings.value.address.cep.replace(/\D/g, '')
  if (cep.length !== 8) return
  
  try {
    const response = await $fetch<any>(`https://viacep.com.br/ws/${cep}/json/`)
    if (!response.erro) {
      settings.value.address.street = response.logradouro || ''
      settings.value.address.neighborhood = response.bairro || ''
      settings.value.address.city = response.localidade || ''
      settings.value.address.state = response.uf || ''
    }
  } catch {
    // Silently fail
  }
}

const copyLink = async () => {
  const link = `https://barberplus.com/${settings.value.slug}`
  await navigator.clipboard.writeText(link)
  showSaveMessage('Link copiado!', true)
}

const showSaveMessage = (message: string, success: boolean) => {
  saveMessage.value = message
  saveSuccess.value = success
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

const resetChanges = () => {
  fetchSettings()
}

const saveSettings = async () => {
  if (!currentBarbershop.value?.id) return
  
  saving.value = true
  try {
    await $fetch(`/api/painel/barbershop/${currentBarbershop.value.id}`, {
      method: 'PATCH',
      headers: authHeaders.value,
      body: {
        name: settings.value.name,
        slug: settings.value.slug,
        logoUrl: settings.value.logoUrl,
        coverUrl: settings.value.coverUrl,
        whatsapp: settings.value.whatsapp,
        phone: settings.value.phone,
        email: settings.value.email,
        website: settings.value.website,
        description: settings.value.description,
        addressStreet: settings.value.address.street,
        addressNumber: settings.value.address.number,
        addressComplement: settings.value.address.complement,
        addressNeighborhood: settings.value.address.neighborhood,
        addressCity: settings.value.address.city,
        addressState: settings.value.address.state,
        addressZip: settings.value.address.cep,
        antiFaultEnabled: settings.value.antiFalta.active,
        antiFaultDepositAmount: settings.value.antiFalta.signalValue,
        antiFaultHoursLimit: parseInt(settings.value.antiFalta.cancelDeadline)
      }
    })
    
    showSaveMessage('Configurações salvas com sucesso!', true)
  } catch (error: any) {
    showSaveMessage(error.data?.message || 'Erro ao salvar configurações', false)
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: 'Configurações - Painel BarberPlus'
})
</script>
