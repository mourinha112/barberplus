<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="lucide:star" class="w-6 h-6 text-amber-400 fill-amber-400" />
        </div>
        <p class="text-3xl font-bold text-amber-400">{{ stats.average.toFixed(1) }}</p>
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
          <select
            v-model="filterRating"
            class="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none"
            @change="fetchReviews"
          >
            <option value="">Todas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="negative">Negativas</option>
          </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-neutral-800" />
              <div class="flex-1">
                <div class="h-4 w-32 bg-neutral-800 rounded mb-2" />
                <div class="h-3 w-48 bg-neutral-800 rounded mb-2" />
                <div class="h-3 w-full bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="reviews.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:message-square" class="w-12 h-12 text-neutral-700 mb-3" />
          <p class="text-neutral-500">Nenhuma avaliação recebida</p>
          <p class="text-sm text-neutral-600 mt-1">As avaliações dos clientes aparecerão aqui</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800">
                <img v-if="review.avatar" :src="review.avatar" :alt="review.client" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-amber-500 font-bold">
                  {{ review.client?.charAt(0) || '?' }}
                </div>
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
                  <span class="text-xs text-neutral-500">{{ review.service }} {{ review.professional ? '• ' + review.professional : '' }}</span>
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
                  <button
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs hover:bg-neutral-700 transition-colors"
                    :class="review.is_visible !== false ? 'text-neutral-400' : 'text-red-400'"
                    @click="toggleVisibility(review)"
                  >
                    <Icon :name="review.is_visible !== false ? 'lucide:eye' : 'lucide:eye-off'" class="w-3.5 h-3.5" />
                    {{ review.is_visible !== false ? 'Visível' : 'Oculto' }}
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
                  :style="{ width: stats.total > 0 ? `${(rating.count / stats.total) * 100}%` : '0%' }"
                />
              </div>
              <span class="text-sm text-neutral-500 w-10 text-right">{{ rating.count }}</span>
            </div>
          </div>
        </div>

        <!-- Professional Ratings -->
        <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <h3 class="text-lg font-semibold text-white mb-4">Por Profissional</h3>

          <div v-if="professionalRatings.length === 0" class="flex flex-col items-center justify-center py-6 text-center">
            <Icon name="lucide:users" class="w-8 h-8 text-neutral-700 mb-2" />
            <p class="text-sm text-neutral-500">Sem avaliações por profissional</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="professional in professionalRatings"
              :key="professional.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50"
            >
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-neutral-700">
                <img v-if="professional.avatar" :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-amber-500 font-bold text-sm">
                  {{ professional.name?.charAt(0) || '?' }}
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ professional.name }}</p>
                <p class="text-xs text-neutral-500">{{ professional.reviews }} avaliações</p>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="text-sm font-semibold text-white">{{ professional.rating?.toFixed(1) }}</span>
              </div>
            </div>
          </div>
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
            :disabled="!replyText.trim() || submittingReply"
            @click="submitReply"
          >
            {{ submittingReply ? 'Enviando...' : 'Enviar Resposta' }}
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  layout: 'painel'
})

const api = useApi()
const toast = useToast()

const loading = ref(true)
const showReplyModal = ref(false)
const selectedReview = ref<any>(null)
const replyText = ref('')
const submittingReply = ref(false)
const filterRating = ref('')

const stats = ref({
  average: 0,
  total: 0,
  thisMonth: 0,
  responseRate: 0
})

const reviews = ref<any[]>([])
const ratingBreakdown = ref([
  { stars: 5, count: 0 },
  { stars: 4, count: 0 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 }
])
const professionalRatings = ref<any[]>([])

const fetchReviews = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filterRating.value === 'negative') {
      params.maxRating = 3
    } else if (filterRating.value) {
      params.rating = filterRating.value
    }

    const response = await api.painel.getReviews(params) as any
    if (response.success) {
      reviews.value = (response.data || []).map((r: any) => ({
        id: r.id,
        client: r.client?.name || r.client_name || 'Cliente',
        avatar: r.client?.avatar_url || '',
        rating: r.rating,
        comment: r.comment || '',
        date: r.created_at ? format(new Date(r.created_at), "d 'de' MMM", { locale: ptBR }) : '',
        service: r.service_name || '',
        professional: r.professional?.name || r.professional_name || '',
        reply: r.reply || '',
        verified: r.is_verified,
        is_visible: r.is_visible
      }))

      // Calculate stats
      if (response.stats) {
        stats.value = {
          average: response.stats.average || 0,
          total: response.stats.total || 0,
          thisMonth: response.stats.thisMonth || 0,
          responseRate: response.stats.responseRate || 0
        }
      } else {
        const total = reviews.value.length
        const sum = reviews.value.reduce((acc: number, r: any) => acc + r.rating, 0)
        const replied = reviews.value.filter((r: any) => r.reply).length
        stats.value = {
          average: total > 0 ? sum / total : 0,
          total,
          thisMonth: reviews.value.filter((r: any) => {
            const d = new Date(r.created_at || Date.now())
            const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).length,
          responseRate: total > 0 ? Math.round((replied / total) * 100) : 0
        }
      }

      // Rating breakdown
      if (response.ratingDistribution) {
        ratingBreakdown.value = [5, 4, 3, 2, 1].map(stars => ({
          stars,
          count: response.ratingDistribution[stars] || 0
        }))
      } else {
        ratingBreakdown.value = [5, 4, 3, 2, 1].map(stars => ({
          stars,
          count: reviews.value.filter((r: any) => r.rating === stars).length
        }))
      }

      // Professional ratings
      if (response.professionalRatings) {
        professionalRatings.value = response.professionalRatings
      }
    }
  } catch {
    // Show empty state
  } finally {
    loading.value = false
  }
}

const openReplyModal = (review: any) => {
  selectedReview.value = review
  replyText.value = ''
  showReplyModal.value = true
}

const submitReply = async () => {
  if (!selectedReview.value || !replyText.value.trim()) return

  submittingReply.value = true
  try {
    await api.painel.replyToReview(selectedReview.value.id, replyText.value)
    selectedReview.value.reply = replyText.value
    toast.add({ title: 'Resposta enviada!', icon: 'i-lucide-check', color: 'green' })
    showReplyModal.value = false
  } catch {
    toast.add({ title: 'Erro ao enviar resposta', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    submittingReply.value = false
  }
}

const toggleVisibility = async (review: any) => {
  const newVisibility = !(review.is_visible !== false)
  try {
    await api.painel.toggleReviewVisibility(review.id, newVisibility)
    review.is_visible = newVisibility
    toast.add({ title: newVisibility ? 'Avaliação visível' : 'Avaliação ocultada', icon: 'i-lucide-check', color: 'green' })
  } catch {
    toast.add({ title: 'Erro ao alterar visibilidade', icon: 'i-lucide-alert-circle', color: 'red' })
  }
}

onMounted(() => {
  fetchReviews()
})

useSeoMeta({
  title: 'Avaliações - Painel BarberPlus'
})
</script>
