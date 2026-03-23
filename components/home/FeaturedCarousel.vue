<template>
  <section class="py-6">
    <div class="container-app">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-display text-xl font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:crown" class="w-5 h-5 text-amber-500" />
            Barbearias em Destaque
          </h2>
          <p class="text-sm text-neutral-500 mt-0.5">As melhores da sua região</p>
        </div>
        <NuxtLink
          to="/buscar?filter=featured"
          class="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Ver todas
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex gap-4 px-4 md:px-8 lg:px-16">
      <div v-for="i in 3" :key="i" class="flex-shrink-0 w-72 md:w-80 h-72 rounded-2xl bg-neutral-800 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="shops.length === 0" class="px-4 md:px-8 lg:px-16">
      <div class="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center">
        <Icon name="lucide:store" class="w-10 h-10 text-neutral-600 mx-auto mb-2" />
        <p class="text-neutral-500 text-sm">Nenhuma barbearia em destaque ainda</p>
      </div>
    </div>

    <!-- Carousel -->
    <div v-else class="relative">
      <div
        ref="carouselRef"
        class="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-16 snap-x snap-mandatory"
        @scroll="onScroll"
      >
        <div
          v-for="(shop, index) in shops"
          :key="shop.id"
          class="flex-shrink-0 w-72 md:w-80 snap-start"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <NuxtLink
            :to="`/barbearia/${shop.slug}`"
            class="block rounded-2xl overflow-hidden group relative h-72"
          >
            <!-- Background Image -->
            <img
              :src="shop.coverImage"
              :alt="shop.name"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <!-- Golden Border on Hover -->
            <div class="absolute inset-0 border-2 border-amber-500/0 rounded-2xl group-hover:border-amber-500/50 transition-all duration-300" />

            <!-- Content -->
            <div class="absolute inset-x-0 bottom-0 p-5">
              <!-- Badge -->
              <div class="flex items-center gap-2 mb-3">
                <span class="badge-gold">
                  <Icon name="lucide:award" class="w-3 h-3 mr-1" />
                  Top {{ index + 1 }}
                </span>
                <span :class="['badge-status', shop.isOpen ? 'open' : 'closed']">
                  <span class="w-1.5 h-1.5 rounded-full" :class="shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'" />
                  {{ shop.isOpen ? 'Aberto' : 'Fechado' }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex items-end gap-3">
                <div class="w-14 h-14 rounded-xl border-2 border-white/20 overflow-hidden flex-shrink-0">
                  <img :src="shop.logo" :alt="shop.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-white text-lg truncate group-hover:text-amber-400 transition-colors">
                    {{ shop.name }}
                  </h3>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="flex items-center gap-1">
                      <Icon name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span class="text-white font-medium">{{ shop.rating || '0.0' }}</span>
                    </div>
                    <div v-if="shop.distance" class="flex items-center gap-1 text-amber-500">
                      <Icon name="lucide:map-pin" class="w-3.5 h-3.5" />
                      <span>{{ shop.distance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shine Effect -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Navigation Dots -->
      <div v-if="shops.length > 1" class="flex justify-center gap-2 mt-4">
        <button
          v-for="(_, index) in shops"
          :key="index"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            currentIndex === index ? 'w-6 bg-amber-500' : 'bg-neutral-700 hover:bg-neutral-600'
          ]"
          @click="scrollTo(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  shops: any[]
  loading?: boolean
}>()

const carouselRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

const onScroll = () => {
  if (!carouselRef.value) return
  const scrollLeft = carouselRef.value.scrollLeft
  const itemWidth = 320
  currentIndex.value = Math.round(scrollLeft / itemWidth)
}

const scrollTo = (index: number) => {
  if (!carouselRef.value) return
  const itemWidth = 320
  carouselRef.value.scrollTo({
    left: index * itemWidth,
    behavior: 'smooth'
  })
}
</script>
