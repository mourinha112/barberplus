<template>
  <div class="min-h-screen">
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
          @click="toggleFavorite"
        >
          <Icon name="lucide:heart" :class="barbershop.isFavorite ? 'fill-current' : ''" class="w-5 h-5" />
        </button>
      </div>

      <!-- Gallery Button -->
      <button 
        class="absolute bottom-4 right-4 px-4 py-2 rounded-xl glass flex items-center gap-2 hover:bg-white/10 transition-colors"
        @click="showGallery = true"
      >
        <Icon name="lucide:images" class="w-4 h-4" />
        <span class="text-sm font-medium">Ver fotos</span>
      </button>
    </div>

    <!-- Shop Info -->
    <div class="container-app -mt-16 relative z-10">
      <div class="flex items-end gap-4 mb-6">
        <!-- Logo -->
        <div class="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-[#0a0a0a] overflow-hidden shadow-2xl flex-shrink-0">
          <img :src="barbershop.logo" :alt="barbershop.name" class="w-full h-full object-cover" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0 pb-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="['badge-status', barbershop.isOpen ? 'open' : 'closed']">
              <span class="w-1.5 h-1.5 rounded-full" :class="barbershop.isOpen ? 'bg-emerald-400' : 'bg-red-400'" />
              {{ barbershop.isOpen ? 'Aberto agora' : 'Fechado' }}
            </span>
            <span v-if="barbershop.featured" class="badge-gold">
              <Icon name="lucide:crown" class="w-3 h-3 mr-1" />
              Destaque
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
            <span class="text-xl font-bold text-white">{{ barbershop.rating }}</span>
          </div>
          <p class="text-xs text-neutral-500">{{ barbershop.reviewCount }} avaliações</p>
        </div>
        <div class="text-center p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div class="flex items-center justify-center gap-1 mb-1">
            <Icon name="lucide:map-pin" class="w-5 h-5 text-amber-500" />
            <span class="text-xl font-bold text-white">{{ barbershop.distance }}</span>
          </div>
          <p class="text-xs text-neutral-500">de distância</p>
        </div>
        <div class="text-center p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <div class="flex items-center justify-center gap-1 mb-1">
            <Icon name="lucide:clock" class="w-5 h-5 text-amber-500" />
            <span class="text-xl font-bold text-white">~{{ barbershop.avgWaitTime }}</span>
          </div>
          <p class="text-xs text-neutral-500">tempo médio</p>
        </div>
      </div>

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
        <div v-if="activeTab === 'services'" class="space-y-4">
          <div 
            v-for="category in serviceCategories" 
            :key="category.name"
            class="mb-8"
          >
            <h3 class="font-semibold text-white mb-3 flex items-center gap-2">
              <Icon :name="category.icon" class="w-5 h-5 text-amber-500" />
              {{ category.name }}
            </h3>
            <div class="space-y-3">
              <ServiceCard 
                v-for="service in category.services" 
                :key="service.id"
                :service="service"
                @select="selectService(service)"
              />
            </div>
          </div>
        </div>

        <!-- Professionals Tab -->
        <div v-if="activeTab === 'professionals'" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ProfessionalCard 
            v-for="pro in professionals" 
            :key="pro.id"
            :professional="pro"
            @select="selectProfessional(pro)"
          />
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="space-y-4">
          <!-- Rating Summary -->
          <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 mb-6">
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-5xl font-bold text-white mb-1">{{ barbershop.rating }}</div>
                <div class="flex items-center justify-center gap-0.5 mb-1">
                  <Icon 
                    v-for="i in 5" 
                    :key="i"
                    name="lucide:star" 
                    :class="['w-4 h-4', i <= Math.round(barbershop.rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-600']" 
                  />
                </div>
                <p class="text-xs text-neutral-500">{{ barbershop.reviewCount }} avaliações</p>
              </div>
              <div class="flex-1 space-y-2">
                <div v-for="star in 5" :key="star" class="flex items-center gap-2">
                  <span class="text-xs text-neutral-500 w-3">{{ 6 - star }}</span>
                  <div class="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      class="h-full bg-amber-500 rounded-full"
                      :style="{ width: `${ratingDistribution[6 - star]}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews List -->
          <ReviewCard 
            v-for="review in reviews" 
            :key="review.id"
            :review="review"
          />
        </div>

        <!-- Location Tab -->
        <div v-if="activeTab === 'location'" class="space-y-4">
          <!-- Map Placeholder -->
          <div class="h-64 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <Icon name="lucide:map" class="w-12 h-12 text-neutral-600 mb-2 mx-auto" />
                <p class="text-sm text-neutral-500">Mapa interativo</p>
              </div>
            </div>
          </div>

          <!-- Address Card -->
          <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Icon name="lucide:map-pin" class="w-6 h-6 text-amber-500" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-white mb-1">Endereço</h4>
                <p class="text-sm text-neutral-400">{{ barbershop.fullAddress }}</p>
                <button class="mt-2 text-sm text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Icon name="lucide:navigation" class="w-4 h-4" />
                  Abrir no Google Maps
                </button>
              </div>
            </div>
          </div>

          <!-- Hours Card -->
          <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Icon name="lucide:clock" class="w-6 h-6 text-amber-500" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-white mb-3">Horário de Funcionamento</h4>
                <div class="space-y-2">
                  <div 
                    v-for="day in businessHours" 
                    :key="day.day"
                    class="flex items-center justify-between text-sm"
                  >
                    <span :class="day.isToday ? 'text-amber-500 font-medium' : 'text-neutral-500'">
                      {{ day.day }}
                    </span>
                    <span :class="day.isToday ? 'text-white font-medium' : 'text-neutral-400'">
                      {{ day.hours }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Card -->
          <div class="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h4 class="font-semibold text-white mb-4">Contato</h4>
            <div class="grid grid-cols-2 gap-3">
              <button class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                <Icon name="lucide:phone" class="w-5 h-5 text-amber-500" />
                <span class="text-sm text-neutral-300">Ligar</span>
              </button>
              <button class="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                <Icon name="mdi:whatsapp" class="w-5 h-5 text-emerald-500" />
                <span class="text-sm text-emerald-400">WhatsApp</span>
              </button>
              <button class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                <Icon name="mdi:instagram" class="w-5 h-5 text-pink-500" />
                <span class="text-sm text-neutral-300">Instagram</span>
              </button>
              <button class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                <Icon name="lucide:globe" class="w-5 h-5 text-blue-500" />
                <span class="text-sm text-neutral-300">Site</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Amenities Tab -->
        <div v-if="activeTab === 'amenities'" class="grid grid-cols-2 gap-3">
          <div 
            v-for="amenity in amenities" 
            :key="amenity.name"
            class="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800"
          >
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="amenity.available ? 'bg-emerald-500/10' : 'bg-neutral-800'"
            >
              <Icon 
                :name="amenity.icon" 
                class="w-5 h-5" 
                :class="amenity.available ? 'text-emerald-500' : 'text-neutral-600'"
              />
            </div>
            <div>
              <p :class="amenity.available ? 'text-white' : 'text-neutral-500'">{{ amenity.name }}</p>
              <p class="text-xs" :class="amenity.available ? 'text-emerald-500' : 'text-neutral-600'">
                {{ amenity.available ? 'Disponível' : 'Indisponível' }}
              </p>
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
          @click="openBooking"
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
      :services="allServices"
      :professionals="professionals"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activeTab = ref('services')
const showGallery = ref(false)
const showBooking = ref(false)

const tabs = [
  { id: 'services', label: 'Serviços' },
  { id: 'professionals', label: 'Profissionais' },
  { id: 'reviews', label: 'Avaliações' },
  { id: 'location', label: 'Localização' },
  { id: 'amenities', label: 'Comodidades' }
]

// Mock data
const barbershop = ref({
  id: '1',
  slug: route.params.slug,
  name: 'Barbearia Premium',
  logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=800&fit=crop',
  rating: 4.9,
  reviewCount: 127,
  distance: '1.2km',
  avgWaitTime: '25min',
  isOpen: true,
  isFavorite: false,
  featured: true,
  fullAddress: 'Av. Barão de Maruim, 245 - Centro, Aracaju - SE, 49015-040',
  phone: '(79) 99999-9999',
  whatsapp: '5579999999999'
})

const serviceCategories = [
  {
    name: 'Cortes',
    icon: 'lucide:scissors',
    services: [
      { id: '1', name: 'Corte Masculino', description: 'Corte tradicional com acabamento', price: 45, duration: 30, popular: true },
      { id: '2', name: 'Corte Degradê', description: 'Degradê completo com máquina', price: 55, duration: 40, popular: true },
      { id: '3', name: 'Corte Social', description: 'Corte clássico para ocasiões especiais', price: 50, duration: 35, popular: false },
      { id: '4', name: 'Corte Infantil', description: 'Corte para crianças até 12 anos', price: 35, duration: 25, popular: false }
    ]
  },
  {
    name: 'Barba',
    icon: 'mdi:mustache',
    services: [
      { id: '5', name: 'Barba Completa', description: 'Modelagem e acabamento da barba', price: 35, duration: 25, popular: true },
      { id: '6', name: 'Barba Navalhada', description: 'Barba tradicional com navalha', price: 45, duration: 35, popular: false },
      { id: '7', name: 'Design de Barba', description: 'Desenho e contorno personalizado', price: 40, duration: 30, popular: false }
    ]
  },
  {
    name: 'Combos',
    icon: 'lucide:sparkles',
    services: [
      { id: '8', name: 'Corte + Barba', description: 'Combo completo corte e barba', price: 70, duration: 50, popular: true },
      { id: '9', name: 'Combo Premium', description: 'Corte, barba, sobrancelha e hidratação', price: 120, duration: 90, popular: true }
    ]
  },
  {
    name: 'Tratamentos',
    icon: 'lucide:droplet',
    services: [
      { id: '10', name: 'Hidratação Capilar', description: 'Tratamento hidratante profundo', price: 60, duration: 45, popular: false },
      { id: '11', name: 'Pigmentação', description: 'Pigmentação para cabelo ou barba', price: 80, duration: 60, popular: false },
      { id: '12', name: 'Relaxamento', description: 'Relaxamento capilar masculino', price: 100, duration: 90, popular: false }
    ]
  }
]

const allServices = computed(() => {
  return serviceCategories.flatMap(cat => cat.services)
})

const professionals = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    role: 'Barbeiro Master',
    rating: 4.9,
    reviewCount: 89,
    specialties: ['Degradê', 'Barba Navalhada']
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    role: 'Barbeiro Sênior',
    rating: 4.8,
    reviewCount: 67,
    specialties: ['Corte Social', 'Pigmentação']
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    role: 'Barbeiro',
    rating: 4.7,
    reviewCount: 45,
    specialties: ['Corte Infantil', 'Combo']
  }
]

const reviews = [
  {
    id: '1',
    author: 'Lucas M.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    rating: 5,
    date: '2 dias atrás',
    content: 'Excelente atendimento! O Carlos é muito profissional e o ambiente é super aconchegante. Recomendo demais!',
    service: 'Corte + Barba'
  },
  {
    id: '2',
    author: 'Rafael S.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    rating: 5,
    date: '1 semana atrás',
    content: 'Melhor barbearia da região. Preço justo, ambiente limpo e profissionais qualificados.',
    service: 'Degradê'
  },
  {
    id: '3',
    author: 'Fernando L.',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    rating: 4,
    date: '2 semanas atrás',
    content: 'Muito bom! Só achei o tempo de espera um pouco longo, mas o resultado compensou.',
    service: 'Combo Premium'
  }
]

const ratingDistribution = {
  5: 85,
  4: 10,
  3: 3,
  2: 1,
  1: 1
}

const businessHours = [
  { day: 'Segunda', hours: '09:00 - 20:00', isToday: false },
  { day: 'Terça', hours: '09:00 - 20:00', isToday: false },
  { day: 'Quarta', hours: '09:00 - 20:00', isToday: false },
  { day: 'Quinta', hours: '09:00 - 20:00', isToday: false },
  { day: 'Sexta', hours: '09:00 - 21:00', isToday: false },
  { day: 'Sábado', hours: '09:00 - 18:00', isToday: true },
  { day: 'Domingo', hours: 'Fechado', isToday: false }
]

const amenities = [
  { name: 'Wi-Fi', icon: 'lucide:wifi', available: true },
  { name: 'Ar Condicionado', icon: 'lucide:wind', available: true },
  { name: 'Estacionamento', icon: 'lucide:car', available: true },
  { name: 'TV', icon: 'lucide:tv', available: true },
  { name: 'Café', icon: 'lucide:coffee', available: true },
  { name: 'Cerveja', icon: 'mdi:beer', available: true },
  { name: 'Acessibilidade', icon: 'lucide:accessibility', available: true },
  { name: 'Pagamento por Pix', icon: 'mdi:qrcode', available: true }
]

const toggleFavorite = () => {
  barbershop.value.isFavorite = !barbershop.value.isFavorite
}

const selectService = (service: any) => {
  console.log('Selected service:', service)
  showBooking.value = true
}

const selectProfessional = (professional: any) => {
  console.log('Selected professional:', professional)
}

const openBooking = () => {
  showBooking.value = true
}

// SEO
useSeoMeta({
  title: () => `${barbershop.value.name} - BarberPlus`,
  description: () => `Agende seu horário na ${barbershop.value.name}. ${barbershop.value.fullAddress}`,
})
</script>

