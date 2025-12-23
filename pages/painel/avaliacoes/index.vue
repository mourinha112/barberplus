<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="lucide:star" class="w-6 h-6 text-amber-400 fill-amber-400" />
        </div>
        <p class="text-3xl font-bold text-amber-400">{{ stats.average }}</p>
        <p class="text-sm text-neutral-500">Nota média</p>
        <div class="flex items-center gap-1 mt-2">
          <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-4 h-4" :class="i <= Math.round(stats.average) ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'" />
        </div>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="lucide:message-square" class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
        <p class="text-sm text-neutral-500">Total de avaliações</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="lucide:trending-up" class="w-6 h-6 text-emerald-500" />
        </div>
        <p class="text-3xl font-bold text-emerald-400">+{{ stats.thisMonth }}</p>
        <p class="text-sm text-neutral-500">Este mês</p>
      </div>
      <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="lucide:reply" class="w-6 h-6 text-violet-500" />
        </div>
        <p class="text-3xl font-bold text-white">{{ stats.responseRate }}%</p>
        <p class="text-sm text-neutral-500">Taxa de resposta</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Reviews List -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">Avaliações Recentes</h3>
          <select class="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none">
            <option>Todas</option>
            <option>5 estrelas</option>
            <option>4 estrelas</option>
            <option>3 estrelas</option>
            <option>Negativas</option>
          </select>
        </div>

        <div class="space-y-4">
          <div 
            v-for="review in reviews" 
            :key="review.id"
            class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img :src="review.avatar" :alt="review.client" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <p class="font-medium text-white">{{ review.client }}</p>
                    <span 
                      v-if="review.verified"
                      class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400"
                    >
                      Verificado
                    </span>
                  </div>
                  <span class="text-xs text-neutral-500">{{ review.date }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex items-center">
                    <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'" />
                  </div>
                  <span class="text-xs text-neutral-500">{{ review.service }} • {{ review.professional }}</span>
                </div>
                <p class="text-sm text-neutral-300">{{ review.comment }}</p>

                <!-- Reply -->
                <div v-if="review.reply" class="mt-4 p-3 rounded-xl bg-neutral-800/50 border-l-2 border-amber-500">
                  <p class="text-xs text-amber-400 mb-1">Resposta da barbearia</p>
                  <p class="text-sm text-neutral-400">{{ review.reply }}</p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 mt-4">
                  <button 
                    v-if="!review.reply"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs hover:bg-amber-500/30 transition-colors"
                    @click="openReplyModal(review)"
                  >
                    <Icon name="lucide:reply" class="w-3.5 h-3.5" />
                    Responder
                  </button>
                  <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-xs hover:bg-neutral-700 transition-colors">
                    <Icon name="lucide:flag" class="w-3.5 h-3.5" />
                    Reportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Rating Breakdown -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Distribuição</h3>
          <div class="space-y-3">
            <div v-for="rating in ratingBreakdown" :key="rating.stars" class="flex items-center gap-3">
              <div class="flex items-center gap-1 w-16">
                <span class="text-sm text-white">{{ rating.stars }}</span>
                <Icon name="lucide:star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </div>
              <div class="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  class="h-full bg-amber-500 rounded-full"
                  :style="{ width: `${(rating.count / stats.total) * 100}%` }"
                />
              </div>
              <span class="text-sm text-neutral-500 w-10 text-right">{{ rating.count }}</span>
            </div>
          </div>
        </div>

        <!-- Professional Ratings -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Por Profissional</h3>
          <div class="space-y-3">
            <div 
              v-for="professional in professionalRatings" 
              :key="professional.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
            >
              <div class="w-10 h-10 rounded-xl overflow-hidden">
                <img :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                <p class="text-xs text-neutral-500">{{ professional.reviews }} avaliações</p>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="text-sm font-semibold text-white">{{ professional.rating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Request Reviews -->
        <div class="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <h3 class="text-lg font-semibold text-white mb-2">Solicitar Avaliações</h3>
          <p class="text-sm text-neutral-400 mb-4">Envie mensagens automáticas pedindo avaliações após os atendimentos.</p>
          <button class="w-full py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
            Configurar
          </button>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <UModal v-model="showReplyModal">
      <div class="p-6" v-if="selectedReview">
        <h2 class="text-xl font-semibold text-white mb-4">Responder Avaliação</h2>
        <div class="p-4 rounded-xl bg-neutral-800/50 mb-4">
          <div class="flex items-center gap-2 mb-2">
            <p class="font-medium text-white">{{ selectedReview.client }}</p>
            <div class="flex items-center">
              <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-3 h-3" :class="i <= selectedReview.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'" />
            </div>
          </div>
          <p class="text-sm text-neutral-400">{{ selectedReview.comment }}</p>
        </div>
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Sua resposta</label>
          <textarea 
            v-model="replyText"
            rows="4"
            placeholder="Escreva sua resposta..."
            class="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
          />
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button 
            class="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            @click="showReplyModal = false"
          >
            Cancelar
          </button>
          <button 
            class="px-6 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
            @click="submitReply"
          >
            Enviar Resposta
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

const showReplyModal = ref(false)
const selectedReview = ref<any>(null)
const replyText = ref('')

const stats = ref({
  average: 4.9,
  total: 127,
  thisMonth: 18,
  responseRate: 92
})

const reviews = ref([
  {
    id: '1',
    client: 'João Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    date: '22/12/2024',
    service: 'Corte + Barba',
    professional: 'Carlos',
    comment: 'Excelente atendimento! O Carlos é muito profissional e o corte ficou perfeito. Ambiente muito agradável e limpo. Super recomendo!',
    verified: true,
    reply: 'Muito obrigado, João! Foi um prazer atendê-lo. Esperamos vê-lo novamente em breve! 🙏'
  },
  {
    id: '2',
    client: 'Pedro Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5,
    date: '21/12/2024',
    service: 'Degradê',
    professional: 'João',
    comment: 'Melhor barbearia da cidade! Atendimento impecável e o resultado sempre supera as expectativas.',
    verified: true,
    reply: null
  },
  {
    id: '3',
    client: 'Lucas Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 4,
    date: '20/12/2024',
    service: 'Barba',
    professional: 'Pedro',
    comment: 'Muito bom! Só demorou um pouquinho mais do que o esperado, mas o resultado ficou ótimo.',
    verified: true,
    reply: null
  },
  {
    id: '4',
    client: 'Rafael Costa',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    rating: 5,
    date: '19/12/2024',
    service: 'Combo Premium',
    professional: 'Carlos',
    comment: 'Serviço premium de verdade! Vale cada centavo. O combo premium inclui tudo que você precisa para sair renovado.',
    verified: true,
    reply: 'Obrigado pela avaliação, Rafael! O Combo Premium é realmente nosso carro-chefe. Volte sempre! 💈'
  }
])

const ratingBreakdown = [
  { stars: 5, count: 98 },
  { stars: 4, count: 22 },
  { stars: 3, count: 5 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 }
]

const professionalRatings = ref([
  { id: '1', name: 'Carlos Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 4.9, reviews: 67 },
  { id: '2', name: 'João Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 4.8, reviews: 38 },
  { id: '3', name: 'Pedro Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', rating: 4.7, reviews: 22 }
])

const openReplyModal = (review: any) => {
  selectedReview.value = review
  replyText.value = ''
  showReplyModal.value = true
}

const submitReply = () => {
  if (selectedReview.value && replyText.value) {
    selectedReview.value.reply = replyText.value
  }
  showReplyModal.value = false
}

useSeoMeta({
  title: 'Avaliações - Painel BarberPlus'
})
</script>

