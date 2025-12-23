<template>
  <section class="py-6">
    <div class="container-app">
      <!-- Promo Card -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/20">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px]" />
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-600 rounded-full blur-[80px]" />
        </div>

        <!-- Content -->
        <div class="relative p-6 md:p-8 flex items-center gap-6">
          <!-- Icon -->
          <div class="hidden md:flex flex-shrink-0 w-24 h-24 rounded-2xl bg-amber-500/20 items-center justify-center">
            <Icon name="lucide:percent" class="w-12 h-12 text-amber-400" />
          </div>

          <!-- Text -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge-gold">Exclusivo</span>
              <span class="text-xs text-amber-400">Válido até 31/01</span>
            </div>
            <h3 class="font-display text-xl md:text-2xl font-semibold text-white mb-1">
              Primeira reserva com <span class="text-gold-gradient">20% OFF</span>
            </h3>
            <p class="text-sm text-neutral-400">
              Use o código <span class="font-mono text-amber-400 font-semibold">PRIMEIRO20</span> na sua primeira reserva
            </p>
          </div>

          <!-- CTA -->
          <div class="hidden sm:block flex-shrink-0">
            <button class="btn-premium">
              <span class="flex items-center gap-2">
                Usar cupom
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        <!-- Mobile CTA -->
        <div class="sm:hidden px-6 pb-6">
          <button class="btn-premium w-full">
            <span class="flex items-center justify-center gap-2">
              Usar cupom
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

