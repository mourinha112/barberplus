<template>
  <div class="space-y-6">
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Preview -->
      <div class="lg:order-2">
        <div class="sticky top-24">
          <p class="text-sm text-neutral-500 mb-4 text-center">Pré-visualização</p>
          <div class="max-w-xs mx-auto">
            <div class="relative">
              <!-- Phone Frame -->
              <div class="bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 rounded-[2.5rem] p-[3px] shadow-2xl">
                <div class="bg-black rounded-[2.3rem] overflow-hidden">
                  <!-- Dynamic Island -->
                  <div class="relative pt-3 pb-2 flex justify-center">
                    <div class="w-24 h-7 bg-black rounded-full" />
                  </div>

                  <!-- Content -->
                  <div class="h-[520px] overflow-y-auto bg-gradient-to-b from-neutral-900 to-black px-4 pb-8">
                    <!-- Header -->
                    <div class="text-center py-6">
                      <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 overflow-hidden">
                        <template v-if="profile.avatarUrl">
                          <img :src="profile.avatarUrl" class="w-full h-full object-cover" />
                        </template>
                        <template v-else>
                          <Icon name="lucide:scissors" class="w-10 h-10 text-black" />
                        </template>
                      </div>
                      <h2 class="text-lg font-bold text-white">{{ profile.name || 'Sua Barbearia' }}</h2>
                      <p class="text-sm text-neutral-400 whitespace-pre-line">{{ profile.bio }}</p>
                      <div v-if="profile.location" class="flex items-center justify-center gap-1 mt-2">
                        <Icon name="lucide:map-pin" class="w-3 h-3 text-amber-500" />
                        <span class="text-xs text-neutral-500">{{ profile.location }}</span>
                      </div>
                    </div>

                    <!-- Links -->
                    <div class="space-y-3">
                      <a
                        v-for="link in activeLinks"
                        :key="link.id"
                        href="#"
                        class="block p-4 rounded-xl text-center transition-transform hover:scale-[1.02]"
                        :style="{ backgroundColor: link.bgColor, color: link.textColor }"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <Icon :name="link.icon" class="w-5 h-5" />
                          <span class="font-medium">{{ link.label }}</span>
                        </div>
                      </a>
                    </div>

                    <!-- Social -->
                    <div v-if="hasSocials" class="flex items-center justify-center gap-4 mt-8">
                      <a v-if="profile.instagram" href="#" class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon name="mdi:instagram" class="w-5 h-5 text-neutral-400" />
                      </a>
                      <a v-if="profile.facebook" href="#" class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon name="mdi:facebook" class="w-5 h-5 text-neutral-400" />
                      </a>
                      <a v-if="profile.tiktok" href="#" class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon name="mdi:tiktok" class="w-5 h-5 text-neutral-400" />
                      </a>
                      <a v-if="profile.youtube" href="#" class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon name="mdi:youtube" class="w-5 h-5 text-neutral-400" />
                      </a>
                    </div>

                    <!-- Powered by -->
                    <p class="text-center mt-6 text-[10px] text-neutral-600">
                      Powered by BarberPlus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div class="space-y-6 lg:order-1">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
        </div>

        <template v-else>
          <!-- Profile Settings -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 class="text-lg font-semibold text-white mb-6">Perfil</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-neutral-400 mb-2">Nome da barbearia</label>
                <input
                  v-model="profile.name"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm text-neutral-400 mb-2">Bio</label>
                <textarea
                  v-model="profile.bio"
                  rows="2"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label class="block text-sm text-neutral-400 mb-2">Localização</label>
                <input
                  v-model="profile.location"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Links -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-white">Links</h3>
              <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
                @click="addLink"
              >
                <Icon name="lucide:plus" class="w-4 h-4" />
                Adicionar
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(link, index) in links"
                :key="link.id"
                class="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <button class="p-1 rounded cursor-grab">
                      <Icon name="lucide:grip-vertical" class="w-4 h-4 text-neutral-500" />
                    </button>
                    <span class="text-sm font-medium text-white">Link {{ index + 1 }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="link.active" class="sr-only peer">
                      <div class="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <button class="p-1 rounded hover:bg-neutral-700" @click="removeLink(index)">
                      <Icon name="lucide:trash" class="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model="link.label"
                    placeholder="Texto do botão"
                    class="px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                  />
                  <input
                    v-model="link.url"
                    placeholder="URL"
                    class="px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                  />
                </div>
                <div class="flex items-center gap-3 mt-3">
                  <div class="flex items-center gap-2">
                    <label class="text-xs text-neutral-500">Cor:</label>
                    <input
                      type="color"
                      v-model="link.bgColor"
                      class="w-8 h-8 rounded cursor-pointer bg-transparent"
                    />
                  </div>
                  <select
                    v-model="link.icon"
                    class="flex-1 px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="lucide:calendar">Agendar</option>
                    <option value="mdi:whatsapp">WhatsApp</option>
                    <option value="mdi:instagram">Instagram</option>
                    <option value="lucide:map-pin">Localização</option>
                    <option value="lucide:star">Avaliações</option>
                    <option value="lucide:link">Link</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 class="text-lg font-semibold text-white mb-6">Redes Sociais</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-neutral-500 mb-2">Instagram</label>
                <input
                  v-model="profile.instagram"
                  placeholder="@usuario"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs text-neutral-500 mb-2">Facebook</label>
                <input
                  v-model="profile.facebook"
                  placeholder="facebook.com/..."
                  class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs text-neutral-500 mb-2">TikTok</label>
                <input
                  v-model="profile.tiktok"
                  placeholder="@usuario"
                  class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs text-neutral-500 mb-2">YouTube</label>
                <input
                  v-model="profile.youtube"
                  placeholder="youtube.com/..."
                  class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Share -->
          <div class="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-white">Seu Link</h3>
                <p class="text-sm text-amber-400">barberplus.com.br/{{ profile.slug || 'seu-slug' }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors" @click="copyLink">
                  <Icon name="lucide:copy" class="w-5 h-5 text-neutral-400" />
                </button>
                <button class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
                  <Icon name="lucide:qr-code" class="w-5 h-5 text-neutral-400" />
                </button>
                <button class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
                  <Icon name="lucide:share-2" class="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <p v-if="saveMessage" class="text-sm text-center" :class="saveError ? 'text-red-400' : 'text-emerald-400'">
            {{ saveMessage }}
          </p>

          <!-- Save Button -->
          <button
            :disabled="saving"
            class="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            @click="saveAll"
          >
            <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const currentBarbershop = inject<Ref<any>>('currentBarbershop')
const { authHeaders } = useAuth()

const loading = ref(true)
const saving = ref(false)
const saveMessage = ref('')
const saveError = ref(false)
const linkBioId = ref<string | null>(null)

const profile = ref({
  name: '',
  bio: '',
  location: '',
  slug: '',
  avatarUrl: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: ''
})

const links = ref<any[]>([])

const activeLinks = computed(() => links.value.filter(l => l.active))
const hasSocials = computed(() => profile.value.instagram || profile.value.facebook || profile.value.tiktok || profile.value.youtube)

// Buscar dados do link bio
const fetchLinkBio = async () => {
  if (!currentBarbershop?.value?.id) return

  loading.value = true
  try {
    const response = await $fetch('/api/painel/link-bio', {
      headers: authHeaders.value,
      params: { barbershopId: currentBarbershop.value.id }
    }) as any

    if (response.success && response.data) {
      const data = response.data
      linkBioId.value = data.id

      profile.value = {
        name: data.title || currentBarbershop.value.name || '',
        bio: data.bio || '',
        location: '',
        slug: data.custom_slug || currentBarbershop.value.slug || '',
        avatarUrl: data.avatar_url || '',
        instagram: data.instagram_url || '',
        facebook: data.facebook_url || '',
        tiktok: data.tiktok_url || '',
        youtube: data.youtube_url || ''
      }

      // Mapear links do banco
      if (data.links && data.links.length > 0) {
        links.value = data.links
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((link: any) => ({
            id: link.id,
            label: link.title,
            url: link.url,
            icon: link.icon || 'lucide:link',
            bgColor: link.style === 'whatsapp' ? '#22c55e' : link.style === 'instagram' ? '#e4405f' : '#f59e0b',
            textColor: '#000',
            active: link.is_active !== false,
            isNew: false
          }))
      } else {
        // Links padrão para nova barbearia
        links.value = [
          { id: 'new-1', label: 'Agendar Horário', url: '', icon: 'lucide:calendar', bgColor: '#f59e0b', textColor: '#000', active: true, isNew: true },
          { id: 'new-2', label: 'WhatsApp', url: '', icon: 'mdi:whatsapp', bgColor: '#22c55e', textColor: '#fff', active: true, isNew: true },
          { id: 'new-3', label: 'Instagram', url: '', icon: 'mdi:instagram', bgColor: '#e4405f', textColor: '#fff', active: true, isNew: true },
          { id: 'new-4', label: 'Como Chegar', url: '', icon: 'lucide:map-pin', bgColor: '#3b82f6', textColor: '#fff', active: true, isNew: true }
        ]
      }
    }
  } catch (error) {
    console.error('Erro ao buscar link bio:', error)
  } finally {
    loading.value = false
  }
}

// Salvar tudo
const saveAll = async () => {
  if (!currentBarbershop?.value?.id) return

  saving.value = true
  saveMessage.value = ''
  saveError.value = false

  try {
    // Salvar perfil
    await $fetch('/api/painel/link-bio', {
      method: 'PATCH',
      headers: authHeaders.value,
      body: {
        barbershopId: currentBarbershop.value.id,
        title: profile.value.name,
        bio: profile.value.bio,
        customSlug: profile.value.slug,
        avatarUrl: profile.value.avatarUrl,
        instagramUrl: profile.value.instagram,
        facebookUrl: profile.value.facebook,
        tiktokUrl: profile.value.tiktok,
        youtubeUrl: profile.value.youtube
      }
    })

    // Salvar links novos
    for (const link of links.value) {
      if (link.isNew && link.url) {
        await $fetch('/api/painel/link-bio/links', {
          method: 'POST',
          headers: authHeaders.value,
          body: {
            barbershopId: currentBarbershop.value.id,
            title: link.label,
            url: link.url,
            icon: link.icon
          }
        })
      } else if (!link.isNew && link.id) {
        await $fetch(`/api/painel/link-bio/links/${link.id}`, {
          method: 'PATCH',
          headers: authHeaders.value,
          body: {
            title: link.label,
            url: link.url,
            icon: link.icon,
            isActive: link.active
          }
        })
      }
    }

    saveMessage.value = 'Salvo com sucesso!'
    saveError.value = false

    // Recarregar dados
    await fetchLinkBio()
  } catch (error: any) {
    saveMessage.value = error.data?.message || 'Erro ao salvar'
    saveError.value = true
  } finally {
    saving.value = false
  }
}

const addLink = () => {
  links.value.push({
    id: 'new-' + Date.now(),
    label: 'Novo Link',
    url: '',
    icon: 'lucide:link',
    bgColor: '#737373',
    textColor: '#fff',
    active: true,
    isNew: true
  })
}

const removeLink = async (index: number) => {
  const link = links.value[index]
  if (!link.isNew && link.id) {
    try {
      await $fetch(`/api/painel/link-bio/links/${link.id}`, {
        method: 'DELETE',
        headers: authHeaders.value
      })
    } catch {
      // Silently fail
    }
  }
  links.value.splice(index, 1)
}

const copyLink = () => {
  const url = `https://barberplus.com.br/${profile.value.slug}`
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url)
    saveMessage.value = 'Link copiado!'
    saveError.value = false
    setTimeout(() => { saveMessage.value = '' }, 2000)
  }
}

// Buscar quando barbearia mudar
watch(currentBarbershop, (barbershop) => {
  if (barbershop?.id) {
    fetchLinkBio()
  }
}, { immediate: true })

useSeoMeta({
  title: 'Link Bio - Painel BarberPlus'
})
</script>
