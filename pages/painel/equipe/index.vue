<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <div>
        <p class="text-sm text-neutral-500">Gerencie sua equipe e comissões</p>
      </div>
      <button
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        @click="openAddModal"
      >
        <Icon name="lucide:user-plus" class="w-4 h-4" />
        Adicionar Profissional
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <template v-else>
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
          <p class="text-2xl font-bold text-emerald-400">{{ team.length }} profissionais</p>
          <p class="text-xs text-neutral-500">Na equipe</p>
        </div>
        <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Icon name="lucide:wallet" class="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p class="text-2xl font-bold text-amber-400">{{ averageCommission }}%</p>
          <p class="text-xs text-neutral-500">Comissão média</p>
        </div>
        <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Icon name="lucide:scissors" class="w-5 h-5 text-violet-500" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ totalServices }}</p>
          <p class="text-xs text-neutral-500">Serviços vinculados</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="team.length === 0" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-800 flex items-center justify-center">
          <Icon name="lucide:users" class="w-10 h-10 text-neutral-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Nenhum profissional cadastrado</h3>
        <p class="text-neutral-500 mb-6">Adicione sua equipe para começar a gerenciar agendamentos.</p>
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          @click="openAddModal"
        >
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          Adicionar primeiro profissional
        </button>
      </div>

      <!-- Team Members -->
      <div v-else class="grid md:grid-cols-2 gap-6">
        <div
          v-for="member in team"
          :key="member.id"
          class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <div class="flex items-start gap-4 mb-6">
            <div class="relative">
              <div class="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800">
                <img v-if="member.avatar_url" :src="member.avatar_url" :alt="member.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="lucide:user" class="w-8 h-8 text-neutral-500" />
                </div>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white">{{ member.name }}</h3>
              <p v-if="member.nickname" class="text-sm text-neutral-500">{{ member.nickname }}</p>
              <p v-if="member.phone" class="text-xs text-neutral-500 mt-1">{{ member.phone }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                @click="openEditModal(member)"
              >
                <Icon name="lucide:edit" class="w-4 h-4 text-neutral-400" />
              </button>
              <button
                class="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                @click="confirmDelete(member)"
              >
                <Icon name="lucide:trash" class="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>

          <!-- Commission Info -->
          <div class="p-4 rounded-xl bg-neutral-800/50 mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-neutral-400">Taxa de comissão</span>
              <span class="text-sm font-bold text-amber-400">{{ member.commission_percentage || 0 }}%</span>
            </div>
          </div>

          <!-- Bio -->
          <p v-if="member.bio" class="text-sm text-neutral-400 mb-4">{{ member.bio }}</p>

          <!-- Services -->
          <div v-if="member.services?.length">
            <p class="text-xs text-neutral-500 mb-2">Serviços</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="svc in member.services"
                :key="svc.service?.id || svc.id"
                class="px-2 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300"
              >
                {{ svc.service?.name || svc.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Add/Edit Professional Modal -->
    <UModal v-model="showAddModal">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-6">
          {{ editingMember ? 'Editar Profissional' : 'Novo Profissional' }}
        </h2>
        <form @submit.prevent="saveProfessional" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nome completo *</label>
            <input
              v-model="professionalForm.name"
              type="text"
              placeholder="Ex: Carlos Silva"
              required
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Apelido</label>
              <input
                v-model="professionalForm.nickname"
                type="text"
                placeholder="Ex: Carlão"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Comissão (%)</label>
              <input
                v-model="professionalForm.commissionPercentage"
                type="number"
                min="0"
                max="100"
                placeholder="50"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Telefone</label>
              <input
                v-model="professionalForm.phone"
                type="tel"
                placeholder="(79) 99999-9999"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-neutral-400 mb-2">Email</label>
              <input
                v-model="professionalForm.email"
                type="email"
                placeholder="email@exemplo.com"
                class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Bio / Especialidades</label>
            <textarea
              v-model="professionalForm.bio"
              rows="2"
              placeholder="Descreva as especialidades do profissional..."
              class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Serviços que realiza</label>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="s in availableServices"
                :key="s.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="s.id"
                  v-model="professionalForm.services"
                  class="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500"
                />
                <span class="text-sm text-neutral-300">{{ s.name }}</span>
                <span class="text-xs text-amber-400">R$ {{ Number(s.price).toFixed(2).replace('.', ',') }}</span>
              </label>
            </div>
            <p v-if="availableServices.length === 0" class="text-sm text-neutral-500">Nenhum serviço cadastrado</p>
          </div>

          <div v-if="formError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-sm text-red-400">{{ formError }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
              @click="showAddModal = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Salvando...' : (editingMember ? 'Salvar' : 'Adicionar') }}
            </button>
          </div>
        </form>
      </div>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Remover profissional?</h3>
        <p class="text-neutral-400 mb-6">
          Tem certeza que deseja remover <strong>{{ deletingMember?.name }}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-center gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors flex items-center gap-2"
            :disabled="deleting"
            @click="deleteProfessional"
          >
            <Icon v-if="deleting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            {{ deleting ? 'Removendo...' : 'Remover' }}
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const { currentBarbershop, authHeaders } = useAuth()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const formError = ref('')

const team = ref<any[]>([])
const availableServices = ref<any[]>([])
const editingMember = ref<any>(null)
const deletingMember = ref<any>(null)

const professionalForm = ref({
  name: '',
  nickname: '',
  bio: '',
  phone: '',
  email: '',
  commissionPercentage: 50,
  services: [] as string[]
})

const averageCommission = computed(() => {
  if (team.value.length === 0) return 0
  const total = team.value.reduce((acc, m) => acc + (m.commission_percentage || 0), 0)
  return Math.round(total / team.value.length)
})

const totalServices = computed(() => {
  return team.value.reduce((acc, m) => acc + (m.services?.length || 0), 0)
})

// Fetch team
const fetchTeam = async () => {
  if (!currentBarbershop.value?.id) return

  loading.value = true
  try {
    const response = await $fetch<any>('/api/painel/professionals', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })

    if (response.success) {
      team.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar equipe:', error)
    team.value = []
  } finally {
    loading.value = false
  }
}

// Fetch services for the form
const fetchServices = async () => {
  if (!currentBarbershop.value?.id) return
  try {
    const response = await $fetch<any>('/api/painel/services', {
      query: { barbershopId: currentBarbershop.value.id },
      headers: authHeaders.value
    })
    if (response.success) {
      availableServices.value = response.data || []
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
  }
}

// Open add modal
const openAddModal = () => {
  editingMember.value = null
  professionalForm.value = {
    name: '',
    nickname: '',
    bio: '',
    phone: '',
    email: '',
    commissionPercentage: 50,
    services: []
  }
  formError.value = ''
  showAddModal.value = true
}

// Open edit modal
const openEditModal = (member: any) => {
  editingMember.value = member
  professionalForm.value = {
    name: member.name || '',
    nickname: member.nickname || '',
    bio: member.bio || '',
    phone: member.phone || '',
    email: member.email || '',
    commissionPercentage: member.commission_percentage || 50,
    services: (member.services || []).map((s: any) => s.service?.id || s.service_id).filter(Boolean)
  }
  formError.value = ''
  showAddModal.value = true
}

// Save professional
const saveProfessional = async () => {
  if (!currentBarbershop.value?.id) return

  if (!professionalForm.value.name.trim()) {
    formError.value = 'Nome é obrigatório'
    return
  }

  formError.value = ''
  saving.value = true

  try {
    const payload = {
      barbershopId: currentBarbershop.value.id,
      name: professionalForm.value.name,
      nickname: professionalForm.value.nickname || null,
      bio: professionalForm.value.bio || null,
      phone: professionalForm.value.phone || null,
      email: professionalForm.value.email || null,
      commissionPercentage: professionalForm.value.commissionPercentage,
      services: professionalForm.value.services
    }

    if (editingMember.value) {
      await $fetch(`/api/painel/professionals/${editingMember.value.id}`, {
        method: 'PATCH',
        body: payload,
        headers: authHeaders.value
      })
    } else {
      await $fetch('/api/painel/professionals', {
        method: 'POST',
        body: payload,
        headers: authHeaders.value
      })
    }

    showAddModal.value = false
    await fetchTeam()
  } catch (error: any) {
    formError.value = error.data?.message || 'Erro ao salvar profissional'
  } finally {
    saving.value = false
  }
}

// Confirm delete
const confirmDelete = (member: any) => {
  deletingMember.value = member
  showDeleteModal.value = true
}

// Delete professional
const deleteProfessional = async () => {
  if (!deletingMember.value) return

  deleting.value = true
  try {
    await $fetch(`/api/painel/professionals/${deletingMember.value.id}`, {
      method: 'DELETE',
      headers: authHeaders.value
    })

    showDeleteModal.value = false
    deletingMember.value = null
    await fetchTeam()
  } catch (error: any) {
    console.error('Erro ao remover:', error)
  } finally {
    deleting.value = false
  }
}

// Watch barbershop changes
watch(() => currentBarbershop.value?.id, async (id) => {
  if (id) {
    await Promise.all([fetchTeam(), fetchServices()])
  }
}, { immediate: true })

useSeoMeta({
  title: 'Equipe - Painel BarberPlus'
})
</script>
