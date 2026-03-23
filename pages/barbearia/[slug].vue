<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="flex flex-col items-center justify-center min-h-screen px-4">
      <Icon name="lucide:store" class="w-16 h-16 text-neutral-600 mb-4" />
      <h2 class="text-xl font-bold text-white mb-2">Barbearia não encontrada</h2>
      <p class="text-neutral-500 text-sm mb-6">{{ errorMsg }}</p>
      <NuxtLink to="/" class="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
        Voltar ao início
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Cover Image -->
      <div class="relative h-64 md:h-80 lg:h-96">
        <img
          :src="barbershop.coverImage"
          :alt="barbershop.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />

        <!-- Back Button -->
        <button
          class="absolute top-4 left-4 w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          @click="$router.back()"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-white" />
        </button>

        <!-- Actions -->
        <div class="absolute top-4 right-4 flex items-center gap-2">
          <button class="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
            <Icon name="lucide:share-2" class="w-5 h-5 text-white" />
          </button>
          <button
            class="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
            :class="{ 'text-red-500': barbershop.isFavorite }"
            @click="barbershop.isFavorite = !barbershop.isFavorite"
          >
            <Icon name="lucide:heart" :class="barbershop.isFavorite ? 'fill-current' : ''" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Shop Info -->
      <div class="container-app -mt-16 relative z-10">
        <div class="flex items-end gap-4 mb-6">
          <!-- Logo -->
          <div class="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-[#0a0a0a] overflow-hidden shadow-2xl flex-shrink-0 bg-neutral-800">
            <img :src="barbershop.logo" :alt="barbershop.name" class="w-full h-full object-cover" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 pb-1">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['badge-status', barbershop.isOpen ? 'open' : 'closed']">
                <span class="w-1.5 h-1.5 rounded-full" :class="barbershop.isOpen ? 'bg-emerald-400' : 'bg-red-400'" />
                {{ barbershop.isOpen ? 'Aberto agora' : 'Fechado' }}
              </span>
            </div>
            <h1 class="font-display text-2xl md:text-3xl font-semibold text-white truncate">
              {{ barbershop.name }}
            </h1>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="text-center p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-center justify-center gap-1 mb-1">
              <Icon name="lucide:star" class="w-5 h-5 text-amber-400 fill-amber-400" />
              <span class="text-xl font-bold text-white">{{ barbershop.rating || '0.0' }}</span>
            </div>
            <p class="text-xs text-neutral-500">{{ barbershop.reviewCount || 0 }} avaliações</p>
          </div>
          <div class="text-center p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-center justify-center gap-1 mb-1">
              <Icon name="lucide:scissors" class="w-5 h-5 text-amber-500" />
              <span class="text-xl font-bold text-white">{{ services.length }}</span>
            </div>
            <p class="text-xs text-neutral-500">serviços</p>
          </div>
          <div class="text-center p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-center justify-center gap-1 mb-1">
              <Icon name="lucide:users" class="w-5 h-5 text-amber-500" />
              <span class="text-xl font-bold text-white">{{ professionals.length }}</span>
            </div>
            <p class="text-xs text-neutral-500">profissionais</p>
          </div>
        </div>

        <!-- Description -->
        <p v-if="barbershop.description" class="text-neutral-400 text-sm mb-6">{{ barbershop.description }}</p>

        <!-- Tabs -->
        <div class="sticky top-16 z-20 -mx-4 px-4 py-3 glass border-b border-neutral-800 mb-6">
          <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-amber-500 text-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="pb-32">
          <!-- Services Tab -->
          <div v-if="activeTab === 'services'" class="space-y-3">
            <div v-if="services.length === 0" class="text-center py-8">
              <Icon name="lucide:scissors" class="w-12 h-12 text-neutral-700 mx-auto mb-2" />
              <p class="text-neutral-500">Nenhum serviço cadastrado ainda</p>
            </div>
            <div
              v-for="service in services"
              :key="service.id"
              class="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-white">{{ service.name }}</h4>
                <p v-if="service.description" class="text-sm text-neutral-500 truncate">{{ service.description }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-xs text-neutral-500 flex items-center gap-1">
                    <Icon name="lucide:clock" class="w-3 h-3" />
                    {{ service.duration_minutes }}min
                  </span>
                </div>
              </div>
              <div class="text-right ml-4">
                <p class="text-lg font-bold text-amber-400">R$ {{ Number(service.price).toFixed(2) }}</p>
                <p v-if="service.promotional_price" class="text-xs text-neutral-500 line-through">R$ {{ Number(service.promotional_price).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Professionals Tab -->
          <div v-if="activeTab === 'professionals'" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-if="professionals.length === 0" class="col-span-full text-center py-8">
              <Icon name="lucide:users" class="w-12 h-12 text-neutral-700 mx-auto mb-2" />
              <p class="text-neutral-500">Nenhum profissional cadastrado ainda</p>
            </div>
            <div
              v-for="pro in professionals"
              :key="pro.id"
              class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center"
            >
              <div class="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-amber-400 to-amber-600 overflow-hidden flex items-center justify-center">
                <template v-if="pro.avatar_url">
                  <img :src="pro.avatar_url" :alt="pro.name" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                  <span class="text-black font-bold text-lg">{{ pro.name[0] }}</span>
                </template>
              </div>
              <h4 class="font-medium text-white text-sm">{{ pro.name }}</h4>
              <p v-if="pro.nickname" class="text-xs text-neutral-500">{{ pro.nickname }}</p>
              <div v-if="pro.rating_average" class="flex items-center justify-center gap-1 mt-2">
                <Icon name="lucide:star" class="w-3 h-3 text-amber-400 fill-amber-400" />
                <span class="text-xs text-white">{{ pro.rating_average }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-4">
            <div v-if="reviews.length === 0" class="text-center py-8">
              <Icon name="lucide:star" class="w-12 h-12 text-neutral-700 mx-auto mb-2" />
              <p class="text-neutral-500">Nenhuma avaliação ainda</p>
            </div>
            <div
              v-for="review in reviews"
              :key="review.id"
              class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800"
            >
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{ (review.client?.name || 'A')[0] }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ review.client?.name || 'Anônimo' }}</p>
                  <div class="flex items-center gap-1">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      name="lucide:star"
                      :class="['w-3 h-3', i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-600']"
                    />
                  </div>
                </div>
              </div>
              <p v-if="review.comment" class="text-sm text-neutral-400">{{ review.comment }}</p>
              <div v-if="review.reply" class="mt-3 pl-4 border-l-2 border-amber-500/30">
                <p class="text-xs text-amber-500 mb-1">Resposta da barbearia</p>
                <p class="text-sm text-neutral-400">{{ review.reply }}</p>
              </div>
            </div>
          </div>

          <!-- Location Tab -->
          <div v-if="activeTab === 'location'" class="space-y-4">
            <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="lucide:map-pin" class="w-6 h-6 text-amber-500" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white mb-1">Endereço</h4>
                  <p class="text-sm text-neutral-400">{{ barbershop.fullAddress || 'Endereço não informado' }}</p>
                </div>
              </div>
            </div>

            <div v-if="barbershop.phone || barbershop.whatsapp" class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <h4 class="font-semibold text-white mb-4">Contato</h4>
              <div class="grid grid-cols-2 gap-3">
                <a v-if="barbershop.phone" :href="'tel:' + barbershop.phone" class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                  <Icon name="lucide:phone" class="w-5 h-5 text-amber-500" />
                  <span class="text-sm text-neutral-300">Ligar</span>
                </a>
                <a v-if="barbershop.whatsapp" :href="'https://wa.me/' + barbershop.whatsapp" target="_blank" class="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                  <Icon name="mdi:whatsapp" class="w-5 h-5 text-emerald-500" />
                  <span class="text-sm text-emerald-400">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed CTA -->
      <div class="fixed bottom-[88px] left-0 right-0 p-4 z-30">
        <div class="container-app">
          <button
            class="w-full btn-premium py-4 text-lg glow-gold-subtle"
            @click="showBooking = true"
          >
            <span class="flex items-center justify-center gap-2">
              <Icon name="lucide:calendar-plus" class="w-5 h-5" />
              Agendar horário
            </span>
          </button>
        </div>
      </div>

      <!-- Booking Modal -->
      <BookingModal
        v-model="showBooking"
        :barbershop="barbershop"
        :services="services"
        :professionals="professionals"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activeTab = ref('services')
const showBooking = ref(false)
const loading = ref(true)
const errorMsg = ref('')

const barbershop = ref<any>({})
const services = ref<any[]>([])
const professionals = ref<any[]>([])
const reviews = ref<any[]>([])

const tabs = [
  { id: 'services', label: 'Serviços' },
  { id: 'professionals', label: 'Profissionais' },
  { id: 'reviews', label: 'Avaliações' },
  { id: 'location', label: 'Localização' }
]

// Buscar dados da barbearia
const fetchBarbershop = async () => {
  const slug = route.params.slug as string
  if (!slug) {
    errorMsg.value = 'Slug não informado'
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await $fetch(`/api/barbershops/${slug}`) as any

    if (response.success && response.data) {
      const data = response.data

      barbershop.value = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        logo: data.logo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name) + '&background=f59e0b&color=000&size=200',
        coverImage: data.cover_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=800&fit=crop',
        rating: Number(data.rating_average) || 0,
        reviewCount: data.rating_count || 0,
        isOpen: data.isOpen || false,
        isFavorite: false,
        phone: data.phone,
        whatsapp: data.whatsapp,
        fullAddress: [data.address_street, data.address_number, data.address_neighborhood, data.address_city, data.address_state].filter(Boolean).join(', ') || ''
      }

      services.value = data.services || []
      professionals.value = data.professionals || []
      reviews.value = data.reviews || []
    } else {
      errorMsg.value = 'Barbearia não encontrada'
    }
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Barbearia não encontrada'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBarbershop()
})

// SEO
useSeoMeta({
  title: () => barbershop.value.name ? `${barbershop.value.name} - BarberPlus` : 'BarberPlus',
  description: () => barbershop.value.name ? `Agende seu horário na ${barbershop.value.name}` : ''
})
</script>
