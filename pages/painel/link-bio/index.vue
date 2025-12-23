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
                      <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4">
                        <Icon name="lucide:scissors" class="w-10 h-10 text-black" />
                      </div>
                      <h2 class="text-lg font-bold text-white">{{ profile.name }}</h2>
                      <p class="text-sm text-neutral-400">{{ profile.bio }}</p>
                      <div class="flex items-center justify-center gap-1 mt-2">
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
                    <div class="flex items-center justify-center gap-4 mt-8">
                      <a v-for="social in profile.socials" :key="social.name" href="#" class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon :name="social.icon" class="w-5 h-5 text-neutral-400" />
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
                  <option value="lucide:calendar">📅 Agendar</option>
                  <option value="mdi:whatsapp">💬 WhatsApp</option>
                  <option value="mdi:instagram">📸 Instagram</option>
                  <option value="lucide:map-pin">📍 Localização</option>
                  <option value="lucide:star">⭐ Avaliações</option>
                  <option value="lucide:link">🔗 Link</option>
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
                v-model="profile.socials[0].url"
                placeholder="@usuario"
                class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-2">Facebook</label>
              <input 
                v-model="profile.socials[1].url"
                placeholder="facebook.com/..."
                class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-2">TikTok</label>
              <input 
                v-model="profile.socials[2].url"
                placeholder="@usuario"
                class="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-2">YouTube</label>
              <input 
                v-model="profile.socials[3].url"
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
              <p class="text-sm text-amber-400">barberplus.com.br/{{ profile.slug }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
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

        <!-- Save Button -->
        <button class="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'painel'
})

const profile = ref({
  name: 'Barbearia Premium',
  bio: '💈 A melhor barbearia da cidade\n✂️ Cortes modernos e clássicos',
  location: 'Aracaju, SE',
  slug: 'barbearia-premium',
  socials: [
    { name: 'Instagram', icon: 'mdi:instagram', url: '@barbeariapremium' },
    { name: 'Facebook', icon: 'mdi:facebook', url: '' },
    { name: 'TikTok', icon: 'mdi:tiktok', url: '' },
    { name: 'YouTube', icon: 'mdi:youtube', url: '' }
  ]
})

const links = ref([
  { id: '1', label: '📅 Agendar Horário', url: '/agendar', icon: 'lucide:calendar', bgColor: '#f59e0b', textColor: '#000', active: true },
  { id: '2', label: '💬 WhatsApp', url: 'https://wa.me/5579999991234', icon: 'mdi:whatsapp', bgColor: '#22c55e', textColor: '#fff', active: true },
  { id: '3', label: '📸 Instagram', url: 'https://instagram.com', icon: 'mdi:instagram', bgColor: '#e4405f', textColor: '#fff', active: true },
  { id: '4', label: '📍 Como Chegar', url: 'https://maps.google.com', icon: 'lucide:map-pin', bgColor: '#3b82f6', textColor: '#fff', active: true },
  { id: '5', label: '⭐ Avaliações', url: '/avaliacoes', icon: 'lucide:star', bgColor: '#8b5cf6', textColor: '#fff', active: false }
])

const activeLinks = computed(() => links.value.filter(l => l.active))

const addLink = () => {
  links.value.push({
    id: Date.now().toString(),
    label: 'Novo Link',
    url: '',
    icon: 'lucide:link',
    bgColor: '#737373',
    textColor: '#fff',
    active: true
  })
}

const removeLink = (index: number) => {
  links.value.splice(index, 1)
}

useSeoMeta({
  title: 'Link Bio - Painel BarberPlus'
})
</script>

