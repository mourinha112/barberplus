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
          :disabled="togglingBot"
          @click="toggleConnection"
        >
          <span v-if="togglingBot" class="flex items-center gap-2">
            <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            {{ connected ? 'Desconectando...' : 'Conectando...' }}
          </span>
          <span v-else>{{ connected ? 'Desconectar' : 'Conectar' }}</span>
        </button>
      </div>

      <div v-if="connected" class="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-3 gap-4">
        <div>
          <p class="text-xs text-neutral-500">Numero conectado</p>
          <p class="text-sm font-medium text-white">{{ connectionInfo.phone || '--' }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Mensagens hoje</p>
          <p class="text-sm font-medium text-emerald-400">{{ stats.messagesToday }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Ultima atividade</p>
          <p class="text-sm font-medium text-white">{{ connectionInfo.lastActivity || '--' }}</p>
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
        <p class="text-xs text-neutral-500">Confirmacoes recebidas</p>
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
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Automacoes</h3>
        <div v-if="loadingAutomations" class="flex items-center gap-2 text-neutral-400 text-sm">
          <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          Carregando...
        </div>
      </div>

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
              <input
                type="checkbox"
                :checked="automation.active"
                class="sr-only peer"
                :disabled="automation._toggling"
                @change="toggleAutomation(automation)"
              >
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
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
          @click="openTemplateModal()"
        >
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
              <button class="p-1.5 rounded-lg hover:bg-neutral-700" @click="openTemplateModal(template)">
                <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
              </button>
              <button class="p-1.5 rounded-lg hover:bg-neutral-700" @click="deleteTemplate(template)">
                <Icon name="lucide:trash-2" class="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
          <h4 class="text-sm font-medium text-white mb-2">{{ template.name }}</h4>
          <p class="text-xs text-neutral-500 whitespace-pre-line line-clamp-3">{{ template.message }}</p>
          <div class="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
            <span class="text-xs text-neutral-500">Variaveis: {{ template.variables.join(', ') }}</span>
            <button class="text-xs text-amber-400 hover:text-amber-300" @click="testTemplate(template)">Testar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Mensagens Recentes</h3>
        <button class="text-sm text-amber-500 hover:text-amber-400" @click="loadMoreMessages">Ver todas</button>
      </div>

      <div v-if="loadingMessages" class="flex items-center justify-center py-8">
        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-neutral-500" />
      </div>

      <div v-else-if="recentMessages.length === 0" class="text-center py-8">
        <p class="text-neutral-500 text-sm">Nenhuma mensagem recente</p>
      </div>

      <div v-else class="space-y-3">
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

    <!-- Template Modal -->
    <Teleport to="body">
      <div
        v-if="showTemplateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="showTemplateModal = false"
      >
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg mx-4 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              {{ editingTemplate ? 'Editar Template' : 'Novo Template' }}
            </h3>
            <button class="p-1.5 rounded-lg hover:bg-neutral-800" @click="showTemplateModal = false">
              <Icon name="lucide:x" class="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Nome</label>
              <input
                v-model="templateForm.name"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="Ex: Confirmacao de Agendamento"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Tipo</label>
              <select
                v-model="templateForm.type"
                class="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Confirmacao">Confirmacao</option>
                <option value="Lembrete">Lembrete</option>
                <option value="Avaliacao">Avaliacao</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Mensagem</label>
              <textarea
                v-model="templateForm.message"
                rows="5"
                class="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Use {nome}, {data}, {horario}, {servico}, {profissional} como variaveis"
              />
              <p class="text-xs text-neutral-500 mt-1">
                Variaveis disponiveis: {nome}, {data}, {horario}, {servico}, {profissional}, {descricao}, {validade}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              class="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              @click="showTemplateModal = false"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
              :disabled="savingTemplate || !templateForm.name || !templateForm.message"
              @click="saveTemplate"
            >
              <span v-if="savingTemplate" class="flex items-center gap-2">
                <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                Salvando...
              </span>
              <span v-else>{{ editingTemplate ? 'Atualizar' : 'Criar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const api = useApi()
const toast = useToast()

// --- State ---
const connected = ref(false)
const togglingBot = ref(false)
const loadingAutomations = ref(true)
const loadingMessages = ref(true)
const savingTemplate = ref(false)
const showTemplateModal = ref(false)
const editingTemplate = ref<any>(null)
const messagesPage = ref(1)

const connectionInfo = ref({
  phone: '',
  lastActivity: ''
})

const stats = ref({
  messagesToday: 0,
  totalSent: 0,
  confirmations: 0,
  reminders: 0,
  responseRate: 0
})

const automations = ref<any[]>([])
const templates = ref<any[]>([])
const recentMessages = ref<any[]>([])

const templateForm = ref({
  name: '',
  type: 'Confirmacao',
  message: ''
})

// --- Type class helper ---
const getTypeClass = (type: string) => {
  const map: Record<string, string> = {
    'Confirmacao': 'bg-emerald-500/20 text-emerald-400',
    'Lembrete': 'bg-amber-500/20 text-amber-400',
    'Avaliacao': 'bg-violet-500/20 text-violet-400',
    'Marketing': 'bg-blue-500/20 text-blue-400'
  }
  return map[type] || 'bg-neutral-500/20 text-neutral-400'
}

// --- Extract variables from message ---
const extractVariables = (message: string): string[] => {
  const matches = message.match(/\{[^}]+\}/g)
  return matches ? [...new Set(matches)] : []
}

// --- Fetch automations from API ---
const fetchAutomations = async () => {
  loadingAutomations.value = true
  try {
    const res = await api.painel.getWhatsAppAutomations() as any
    if (res.success && res.data) {
      automations.value = res.data.automations || res.data || []
      templates.value = (res.data.templates || []).map((t: any) => ({
        ...t,
        typeClass: getTypeClass(t.type),
        variables: t.variables || extractVariables(t.message || '')
      }))

      // Update connection info & stats from response
      if (res.data.connection) {
        connected.value = res.data.connection.connected ?? false
        connectionInfo.value = {
          phone: res.data.connection.phone || '',
          lastActivity: res.data.connection.lastActivity || ''
        }
      }
      if (res.data.stats) {
        stats.value = {
          messagesToday: res.data.stats.messagesToday ?? 0,
          totalSent: res.data.stats.totalSent ?? 0,
          confirmations: res.data.stats.confirmations ?? 0,
          reminders: res.data.stats.reminders ?? 0,
          responseRate: res.data.stats.responseRate ?? 0
        }
      }
    }
  } catch (e) {
    console.error('Erro ao carregar automacoes:', e)
  } finally {
    loadingAutomations.value = false
  }
}

// --- Fetch messages from API ---
const fetchMessages = async (page = 1) => {
  loadingMessages.value = true
  try {
    const res = await api.painel.getWhatsAppMessages({ page, limit: 10 }) as any
    if (res.success && res.data) {
      const msgs = res.data.messages || res.data || []
      recentMessages.value = msgs.map((m: any) => ({
        id: m.id,
        client: m.client_name || m.client || 'Cliente',
        avatar: m.avatar_url || m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.client_name || 'C')}&background=333&color=fff`,
        content: m.content || m.message || '',
        time: m.time || (m.created_at ? new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''),
        direction: m.direction || 'sent'
      }))
    }
  } catch (e) {
    console.error('Erro ao carregar mensagens:', e)
  } finally {
    loadingMessages.value = false
  }
}

const loadMoreMessages = () => {
  messagesPage.value++
  fetchMessages(messagesPage.value)
}

// --- Toggle WhatsApp connection ---
const toggleConnection = async () => {
  togglingBot.value = true
  const newState = !connected.value
  try {
    const res = await api.painel.toggleWhatsAppBot(newState) as any
    if (res.success) {
      connected.value = newState
      if (newState && res.data?.connection) {
        connectionInfo.value = {
          phone: res.data.connection.phone || connectionInfo.value.phone,
          lastActivity: res.data.connection.lastActivity || ''
        }
      }
      toast.add({
        title: newState ? 'WhatsApp conectado!' : 'WhatsApp desconectado',
        icon: newState ? 'i-lucide-check' : 'i-lucide-unplug',
        color: newState ? 'green' : 'red'
      })
    } else {
      toast.add({
        title: res.message || 'Erro ao alterar conexao',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Erro ao alterar conexao',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  } finally {
    togglingBot.value = false
  }
}

// --- Toggle automation active state ---
const toggleAutomation = async (automation: any) => {
  const newState = !automation.active
  automation._toggling = true
  try {
    const res = await api.painel.updateWhatsAppAutomation(automation.id, { active: newState }) as any
    if (res.success) {
      automation.active = newState
      toast.add({
        title: `${automation.name} ${newState ? 'ativada' : 'desativada'}`,
        icon: newState ? 'i-lucide-check' : 'i-lucide-pause',
        color: newState ? 'green' : 'neutral'
      })
    } else {
      toast.add({
        title: 'Erro ao atualizar automacao',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Erro ao atualizar automacao',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  } finally {
    automation._toggling = false
  }
}

// --- Template CRUD ---
const openTemplateModal = (template?: any) => {
  if (template) {
    editingTemplate.value = template
    templateForm.value = {
      name: template.name,
      type: template.type,
      message: template.message
    }
  } else {
    editingTemplate.value = null
    templateForm.value = {
      name: '',
      type: 'Confirmacao',
      message: ''
    }
  }
  showTemplateModal.value = true
}

const saveTemplate = async () => {
  savingTemplate.value = true
  try {
    const payload = {
      name: templateForm.value.name,
      type: templateForm.value.type,
      message: templateForm.value.message,
      variables: extractVariables(templateForm.value.message)
    }

    let res: any
    if (editingTemplate.value) {
      res = await api.painel.updateWhatsAppAutomation(editingTemplate.value.id, payload)
    } else {
      res = await api.painel.saveWhatsAppAutomation(payload)
    }

    if (res.success) {
      toast.add({
        title: editingTemplate.value ? 'Template atualizado!' : 'Template criado!',
        icon: 'i-lucide-check',
        color: 'green'
      })
      showTemplateModal.value = false
      await fetchAutomations()
    } else {
      toast.add({
        title: res.message || 'Erro ao salvar template',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Erro ao salvar template',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  } finally {
    savingTemplate.value = false
  }
}

const deleteTemplate = async (template: any) => {
  if (!confirm(`Deseja excluir o template "${template.name}"?`)) return

  try {
    const res = await api.painel.deleteWhatsAppAutomation(template.id) as any
    if (res.success) {
      templates.value = templates.value.filter(t => t.id !== template.id)
      toast.add({
        title: 'Template excluido!',
        icon: 'i-lucide-trash-2',
        color: 'green'
      })
    } else {
      toast.add({
        title: 'Erro ao excluir template',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Erro ao excluir template',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  }
}

const testTemplate = async (template: any) => {
  try {
    const res = await api.painel.sendWhatsAppMessage({
      templateId: template.id,
      test: true
    }) as any
    if (res.success) {
      toast.add({
        title: 'Mensagem de teste enviada!',
        icon: 'i-lucide-send',
        color: 'green'
      })
    } else {
      toast.add({
        title: res.message || 'Erro ao enviar teste',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Erro ao enviar teste',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  }
}

// --- Init ---
onMounted(() => {
  fetchAutomations()
  fetchMessages()
})

useSeoMeta({
  title: 'WhatsApp Bot - Painel BarberPlus'
})
</script>
