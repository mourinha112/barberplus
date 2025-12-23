<template>
  <div class="space-y-6">
    <!-- Connection Status -->
    <div 
      class="p-6 rounded-2xl border"
      :class="connected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div 
            class="w-14 h-14 rounded-2xl flex items-center justify-center"
            :class="connected ? 'bg-emerald-500/20' : 'bg-red-500/20'"
          >
            <Icon name="mdi:whatsapp" class="w-8 h-8" :class="connected ? 'text-emerald-500' : 'text-red-500'" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">WhatsApp Business</h2>
            <div class="flex items-center gap-2">
              <span 
                class="w-2 h-2 rounded-full"
                :class="connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'"
              />
              <span class="text-sm" :class="connected ? 'text-emerald-400' : 'text-red-400'">
                {{ connected ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>
          </div>
        </div>
        <button 
          class="px-4 py-2 rounded-xl font-semibold transition-colors"
          :class="connected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500 text-white hover:bg-emerald-400'"
        >
          {{ connected ? 'Desconectar' : 'Conectar' }}
        </button>
      </div>

      <div v-if="connected" class="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-3 gap-4">
        <div>
          <p class="text-xs text-neutral-500">Número conectado</p>
          <p class="text-sm font-medium text-white">+55 79 99999-1234</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Mensagens hoje</p>
          <p class="text-sm font-medium text-emerald-400">{{ stats.messagesToday }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Última atividade</p>
          <p class="text-sm font-medium text-white">há 2 minutos</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <Icon name="lucide:send" class="w-6 h-6 text-blue-500 mb-3" />
        <p class="text-2xl font-bold text-white">{{ stats.totalSent }}</p>
        <p class="text-xs text-neutral-500">Mensagens enviadas</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <Icon name="lucide:check-check" class="w-6 h-6 text-emerald-500 mb-3" />
        <p class="text-2xl font-bold text-emerald-400">{{ stats.confirmations }}</p>
        <p class="text-xs text-neutral-500">Confirmações recebidas</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <Icon name="lucide:calendar-check" class="w-6 h-6 text-amber-500 mb-3" />
        <p class="text-2xl font-bold text-amber-400">{{ stats.reminders }}</p>
        <p class="text-xs text-neutral-500">Lembretes enviados</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <Icon name="lucide:percent" class="w-6 h-6 text-violet-500 mb-3" />
        <p class="text-2xl font-bold text-white">{{ stats.responseRate }}%</p>
        <p class="text-xs text-neutral-500">Taxa de resposta</p>
      </div>
    </div>

    <!-- Automation Settings -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <h3 class="text-lg font-semibold text-white mb-6">Automações</h3>
      
      <div class="space-y-4">
        <div 
          v-for="automation in automations" 
          :key="automation.id"
          class="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="automation.iconBg">
              <Icon :name="automation.icon" class="w-5 h-5" :class="automation.iconColor" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{{ automation.name }}</p>
              <p class="text-xs text-neutral-500">{{ automation.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs text-neutral-400">{{ automation.trigger }}</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="automation.active" class="sr-only peer" @change="toggleAutomation(automation)">
              <div class="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Templates -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Templates de Mensagem</h3>
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Novo Template
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div 
          v-for="template in templates" 
          :key="template.id"
          class="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="template.typeClass">
              {{ template.type }}
            </span>
            <div class="flex items-center gap-1">
              <button class="p-1.5 rounded-lg hover:bg-neutral-700">
                <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
              </button>
              <button class="p-1.5 rounded-lg hover:bg-neutral-700">
                <Icon name="lucide:copy" class="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
          <h4 class="text-sm font-medium text-white mb-2">{{ template.name }}</h4>
          <p class="text-xs text-neutral-500 whitespace-pre-line line-clamp-3">{{ template.message }}</p>
          <div class="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
            <span class="text-xs text-neutral-500">Variáveis: {{ template.variables.join(', ') }}</span>
            <button class="text-xs text-amber-400 hover:text-amber-300">Testar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Mensagens Recentes</h3>
        <button class="text-sm text-amber-500 hover:text-amber-400">Ver todas</button>
      </div>

      <div class="space-y-3">
        <div 
          v-for="message in recentMessages" 
          :key="message.id"
          class="flex items-start gap-4 p-4 rounded-xl bg-neutral-800/50"
        >
          <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img :src="message.avatar" :alt="message.client" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-sm font-medium text-white">{{ message.client }}</p>
              <span class="text-xs text-neutral-500">{{ message.time }}</span>
            </div>
            <p class="text-sm text-neutral-400">{{ message.content }}</p>
          </div>
          <span 
            class="px-2 py-1 rounded-lg text-[10px] font-medium flex-shrink-0"
            :class="message.direction === 'sent' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'"
          >
            {{ message.direction === 'sent' ? 'Enviada' : 'Recebida' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const connected = ref(true)

const stats = ref({
  messagesToday: 47,
  totalSent: 1248,
  confirmations: 892,
  reminders: 356,
  responseRate: 71
})

const automations = ref([
  { id: '1', name: 'Confirmação de Agendamento', description: 'Envia mensagem ao confirmar agendamento', icon: 'lucide:calendar-check', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-500', trigger: 'Ao agendar', active: true },
  { id: '2', name: 'Lembrete 24h', description: 'Lembra o cliente 24h antes do horário', icon: 'lucide:bell', iconBg: 'bg-amber-500/20', iconColor: 'text-amber-500', trigger: '24h antes', active: true },
  { id: '3', name: 'Lembrete 1h', description: 'Lembra o cliente 1h antes do horário', icon: 'lucide:clock', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500', trigger: '1h antes', active: true },
  { id: '4', name: 'Pós-atendimento', description: 'Solicita avaliação após o serviço', icon: 'lucide:star', iconBg: 'bg-violet-500/20', iconColor: 'text-violet-500', trigger: 'Após atendimento', active: false },
  { id: '5', name: 'Cliente Inativo', description: 'Envia mensagem para clientes sem visita há 30 dias', icon: 'lucide:user-x', iconBg: 'bg-red-500/20', iconColor: 'text-red-500', trigger: '30 dias sem visita', active: true },
  { id: '6', name: 'Aniversário', description: 'Parabeniza o cliente no aniversário', icon: 'lucide:cake', iconBg: 'bg-pink-500/20', iconColor: 'text-pink-500', trigger: 'Data de aniversário', active: true }
])

const templates = ref([
  { 
    id: '1', 
    name: 'Confirmação de Agendamento', 
    type: 'Confirmação',
    typeClass: 'bg-emerald-500/20 text-emerald-400',
    message: '✅ Agendamento confirmado!\n\n📅 Data: {data}\n⏰ Horário: {horario}\n💈 Serviço: {servico}\n👤 Profissional: {profissional}\n\nTe esperamos! 🔥',
    variables: ['{data}', '{horario}', '{servico}', '{profissional}']
  },
  { 
    id: '2', 
    name: 'Lembrete 24h', 
    type: 'Lembrete',
    typeClass: 'bg-amber-500/20 text-amber-400',
    message: '⏰ Lembrete: Seu horário é amanhã!\n\n📅 {data} às {horario}\n💈 {servico}\n\nConfirme sua presença respondendo OK',
    variables: ['{data}', '{horario}', '{servico}']
  },
  { 
    id: '3', 
    name: 'Pós-atendimento', 
    type: 'Avaliação',
    typeClass: 'bg-violet-500/20 text-violet-400',
    message: 'Olá {nome}! 👋\n\nComo foi seu atendimento hoje?\n\nDe 1 a 5, qual sua nota? ⭐',
    variables: ['{nome}']
  },
  { 
    id: '4', 
    name: 'Promoção', 
    type: 'Marketing',
    typeClass: 'bg-blue-500/20 text-blue-400',
    message: '🔥 PROMOÇÃO EXCLUSIVA!\n\n{descricao}\n\nAgende agora e garanta seu desconto!\n\nVálido até {validade}',
    variables: ['{descricao}', '{validade}']
  }
])

const recentMessages = ref([
  { id: '1', client: 'João Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', content: 'OK, confirmado!', time: '14:32', direction: 'received' },
  { id: '2', client: 'Pedro Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: '⏰ Lembrete: Seu horário é amanhã às 15:00...', time: '14:30', direction: 'sent' },
  { id: '3', client: 'Lucas Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', content: '✅ Agendamento confirmado! 📅 Data: 23/12...', time: '14:15', direction: 'sent' },
  { id: '4', client: 'Rafael Costa', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', content: 'Posso trocar o horário para 16h?', time: '13:45', direction: 'received' }
])

const toggleAutomation = (automation: any) => {
  automation.active = !automation.active
}

useSeoMeta({
  title: 'WhatsApp Bot - Painel BarberPlus'
})
</script>

