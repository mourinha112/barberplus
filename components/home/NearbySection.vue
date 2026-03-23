<template>
  <section class="py-6">
    <div class="container-app">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-display text-xl font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:map-pin" class="w-5 h-5 text-amber-500" />
            Barbearias
          </h2>
          <p class="text-sm text-neutral-500 mt-0.5">Cadastradas na plataforma</p>
        </div>
        <NuxtLink
          to="/buscar"
          class="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Ver todas
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-2xl bg-neutral-800 animate-pulse" />
      </div>

      <!-- Empty -->
      <div v-else-if="shops.length === 0" class="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center">
        <Icon name="lucide:store" class="w-10 h-10 text-neutral-600 mx-auto mb-2" />
        <p class="text-neutral-500 text-sm">Nenhuma barbearia encontrada</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3 lg:hidden">
        <BarbershopCardCompact
          v-for="(shop, index) in shops.slice(0, visibleCount)"
          :key="shop.id"
          :barbershop="shop"
          class="fade-in-up animate-hidden"
          :style="{ animationDelay: `${index * 100}ms` }"
        />
      </div>

      <!-- Load More -->
      <button
        v-if="!loading && shops.length > visibleCount"
        class="w-full mt-4 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:border-amber-500/30 transition-all flex items-center justify-center gap-2 lg:hidden"
        @click="visibleCount += 4"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Carregar mais
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  shops: any[]
  loading?: boolean
}>()

const visibleCount = ref(4)
</script>
