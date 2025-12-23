<template>
  <div class="min-h-screen bg-[#050505] overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[150px] animate-pulse" />
        <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[200px]" />
        
        <!-- Grid Pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <!-- Navbar -->
      <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Icon name="lucide:scissors" class="w-5 h-5 text-black" />
              </div>
              <span class="font-display text-xl font-semibold text-white">
                Barber<span class="text-gold-gradient">Plus</span>
              </span>
            </div>
            <div class="hidden md:flex items-center gap-8">
              <a href="#beneficios" class="text-sm text-neutral-400 hover:text-white transition-colors">Benefícios</a>
              <a href="#recursos" class="text-sm text-neutral-400 hover:text-white transition-colors">Recursos</a>
              <a href="#depoimentos" class="text-sm text-neutral-400 hover:text-white transition-colors">Depoimentos</a>
              <a href="#precos" class="text-sm text-neutral-400 hover:text-white transition-colors">Preços</a>
            </div>
            <button class="btn-premium px-6 py-2.5 text-sm">
              <span>Cadastrar Barbearia</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span class="text-sm text-amber-400">🚀 +500 barbearias já cadastradas</span>
            </div>
            
            <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Sua barbearia no
              <span class="text-gold-gradient"> maior marketplace</span>
              do Brasil
            </h1>
            
            <p class="text-lg text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Aumente seus clientes em até <span class="text-white font-semibold">300%</span> com nossa plataforma. 
              Sistema de agendamento inteligente, IA para gestão e divulgação semanal gratuita.
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
              <button class="w-full sm:w-auto btn-premium px-8 py-4 text-lg glow-gold group">
                <span class="flex items-center justify-center gap-2">
                  Cadastrar Grátis
                  <Icon name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-neutral-700 text-neutral-300 hover:border-amber-500/50 hover:text-white transition-all">
                <Icon name="lucide:play-circle" class="w-5 h-5" />
                Ver demonstração
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="flex items-center gap-6 justify-center lg:justify-start">
              <div class="flex items-center gap-2">
                <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-500" />
                <span class="text-sm text-neutral-400">100% Seguro</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:credit-card" class="w-5 h-5 text-emerald-500" />
                <span class="text-sm text-neutral-400">Sem taxa de adesão</span>
              </div>
            </div>
          </div>

          <!-- Phone Mockup - Barbershop Profile Preview -->
          <div class="relative flex justify-center lg:justify-end">
            <div class="relative phone-container">
              <!-- Glow Effect -->
              <div class="absolute -inset-8 bg-gradient-to-r from-amber-500/30 to-amber-600/20 rounded-[4rem] blur-3xl animate-pulse" />
              <div class="absolute -inset-4 bg-amber-500/10 rounded-[3.5rem] blur-xl" />
              
              <!-- Phone Device Frame -->
              <div class="relative">
                <!-- Phone Outer Frame (Metal Band) -->
                <div class="relative w-[280px] md:w-[300px] bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 rounded-[3rem] p-[3px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_30px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  
                  <!-- Side Buttons -->
                  <div class="absolute -left-[2px] top-28 w-[3px] h-8 bg-neutral-700 rounded-l-sm" />
                  <div class="absolute -left-[2px] top-40 w-[3px] h-12 bg-neutral-700 rounded-l-sm" />
                  <div class="absolute -left-[2px] top-56 w-[3px] h-12 bg-neutral-700 rounded-l-sm" />
                  <div class="absolute -right-[2px] top-36 w-[3px] h-16 bg-neutral-700 rounded-r-sm" />
                  
                  <!-- Phone Inner Frame -->
                  <div class="bg-black rounded-[2.8rem] p-[2px]">
                    <!-- Screen Bezel -->
                    <div class="bg-black rounded-[2.6rem] overflow-hidden">
                      <!-- Screen Content -->
                      <div class="relative bg-[#0a0a0a] h-[580px] md:h-[620px] overflow-hidden">
                        
                        <!-- Dynamic Island -->
                        <div class="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                          <div class="w-28 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <div class="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-800 mr-8" />
                          </div>
                        </div>
                        
                        <!-- Status Bar -->
                        <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4 pb-2">
                          <span class="text-[11px] text-white font-semibold">9:41</span>
                          <div class="w-28" /> <!-- Space for Dynamic Island -->
                          <div class="flex items-center gap-1">
                            <Icon name="lucide:signal" class="w-4 h-4 text-white" />
                            <Icon name="lucide:wifi" class="w-4 h-4 text-white" />
                            <div class="flex items-center">
                              <span class="text-[10px] text-white font-medium mr-0.5">100</span>
                              <Icon name="lucide:battery-full" class="w-6 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                  
                  <!-- Cover Image -->
                  <div class="relative h-36">
                    <div class="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-neutral-900 to-black" />
                    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=200&fit=crop')] bg-cover bg-center opacity-60" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    
                    <!-- Back & Actions -->
                    <div class="absolute top-10 left-3 right-3 flex items-center justify-between">
                      <div class="w-8 h-8 rounded-lg bg-black/40 backdrop-blur flex items-center justify-center">
                        <Icon name="lucide:arrow-left" class="w-4 h-4 text-white" />
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-black/40 backdrop-blur flex items-center justify-center">
                          <Icon name="lucide:share-2" class="w-4 h-4 text-white" />
                        </div>
                        <div class="w-8 h-8 rounded-lg bg-black/40 backdrop-blur flex items-center justify-center">
                          <Icon name="lucide:heart" class="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Profile Info -->
                  <div class="relative px-3 -mt-8">
                    <div class="flex items-end gap-3">
                      <!-- Logo -->
                      <div class="w-16 h-16 rounded-xl border-3 border-[#0a0a0a] overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl">
                        <Icon name="lucide:scissors" class="w-8 h-8 text-black" />
                      </div>
                      <div class="flex-1 pb-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                          <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ABERTO</span>
                          <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500 text-black">⭐ DESTAQUE</span>
                        </div>
                        <h2 class="text-sm font-bold text-white">Barbearia Premium</h2>
                      </div>
                    </div>

                    <!-- Stats Row -->
                    <div class="flex items-center gap-2 mt-3">
                      <div class="flex-1 text-center p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
                        <div class="flex items-center justify-center gap-1">
                          <Icon name="lucide:star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span class="text-sm font-bold text-white">4.9</span>
                        </div>
                        <p class="text-[8px] text-neutral-500">127 avaliações</p>
                      </div>
                      <div class="flex-1 text-center p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
                        <div class="flex items-center justify-center gap-1">
                          <Icon name="lucide:map-pin" class="w-3.5 h-3.5 text-amber-500" />
                          <span class="text-sm font-bold text-white">1.2km</span>
                        </div>
                        <p class="text-[8px] text-neutral-500">de distância</p>
                      </div>
                      <div class="flex-1 text-center p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
                        <div class="flex items-center justify-center gap-1">
                          <Icon name="lucide:clock" class="w-3.5 h-3.5 text-amber-500" />
                          <span class="text-sm font-bold text-white">~25min</span>
                        </div>
                        <p class="text-[8px] text-neutral-500">tempo médio</p>
                      </div>
                    </div>

                    <!-- Tabs -->
                    <div class="flex items-center gap-1 mt-3 p-1 rounded-lg bg-neutral-900/50">
                      <div class="flex-1 text-center py-1.5 rounded-md bg-amber-500 text-black text-[10px] font-semibold">Serviços</div>
                      <div class="flex-1 text-center py-1.5 text-[10px] text-neutral-500">Equipe</div>
                      <div class="flex-1 text-center py-1.5 text-[10px] text-neutral-500">Avaliações</div>
                    </div>

                    <!-- Services List -->
                    <div class="mt-3 space-y-2">
                      <p class="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
                        <Icon name="lucide:scissors" class="w-3 h-3 text-amber-500" />
                        CORTES
                      </p>
                      
                      <!-- Service Item 1 -->
                      <div class="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/50">
                        <div class="flex-1">
                          <div class="flex items-center gap-1.5">
                            <p class="text-[11px] font-medium text-white">Corte Degradê</p>
                            <span class="px-1 py-0.5 rounded text-[7px] font-bold bg-amber-500 text-black">POPULAR</span>
                          </div>
                          <p class="text-[9px] text-neutral-500">Degradê completo com máquina</p>
                          <p class="text-[8px] text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Icon name="lucide:clock" class="w-2.5 h-2.5" /> 40 min
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs font-bold text-amber-400">R$ 55</p>
                          <div class="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center mt-1">
                            <Icon name="lucide:plus" class="w-3.5 h-3.5 text-amber-500" />
                          </div>
                        </div>
                      </div>

                      <!-- Service Item 2 -->
                      <div class="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/50">
                        <div class="flex-1">
                          <p class="text-[11px] font-medium text-white">Corte + Barba</p>
                          <p class="text-[9px] text-neutral-500">Combo completo</p>
                          <p class="text-[8px] text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Icon name="lucide:clock" class="w-2.5 h-2.5" /> 50 min
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs font-bold text-amber-400">R$ 70</p>
                          <div class="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center mt-1">
                            <Icon name="lucide:plus" class="w-3.5 h-3.5 text-amber-500" />
                          </div>
                        </div>
                      </div>

                      <!-- Service Item 3 -->
                      <div class="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/50">
                        <div class="flex-1">
                          <div class="flex items-center gap-1.5">
                            <p class="text-[11px] font-medium text-white">Combo Premium</p>
                            <span class="px-1 py-0.5 rounded text-[7px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">VIP</span>
                          </div>
                          <p class="text-[9px] text-neutral-500">Corte, barba, sobrancelha e hidratação</p>
                          <p class="text-[8px] text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Icon name="lucide:clock" class="w-2.5 h-2.5" /> 90 min
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs font-bold text-amber-400">R$ 120</p>
                          <div class="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center mt-1">
                            <Icon name="lucide:plus" class="w-3.5 h-3.5 text-amber-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- CTA Button -->
                    <div class="mt-3 mb-2">
                      <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25">
                        <Icon name="lucide:calendar-plus" class="w-4 h-4" />
                        Agendar horário
                      </button>
                    </div>
                  </div>

                        <!-- Bottom Nav -->
                        <div class="absolute bottom-0 left-0 right-0 flex items-center justify-around py-3 pb-6 bg-black/90 backdrop-blur-xl border-t border-neutral-800/50">
                          <div class="flex flex-col items-center gap-0.5">
                            <Icon name="lucide:home" class="w-5 h-5 text-neutral-500" />
                            <span class="text-[9px] text-neutral-500">Início</span>
                          </div>
                          <div class="flex flex-col items-center gap-0.5">
                            <Icon name="lucide:search" class="w-5 h-5 text-neutral-500" />
                            <span class="text-[9px] text-neutral-500">Buscar</span>
                          </div>
                          <div class="flex flex-col items-center gap-0.5">
                            <div class="relative">
                              <Icon name="lucide:calendar" class="w-5 h-5 text-amber-500" />
                              <span class="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                            </div>
                            <span class="text-[9px] text-amber-500">Agenda</span>
                          </div>
                          <div class="flex flex-col items-center gap-0.5">
                            <Icon name="lucide:user" class="w-5 h-5 text-neutral-500" />
                            <span class="text-[9px] text-neutral-500">Perfil</span>
                          </div>
                        </div>
                        
                        <!-- Home Indicator Bar -->
                        <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                        
                      </div><!-- End Screen Content -->
                    </div><!-- End Screen Bezel -->
                  </div><!-- End Phone Inner Frame -->
                </div><!-- End Phone Outer Frame -->
              </div><!-- End Phone Device Frame -->

              <!-- Floating Elements -->
              <div class="absolute -top-2 -right-6 px-3 py-1.5 rounded-xl glass-gold border border-amber-500/30 animate-float shadow-lg">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:bell-ring" class="w-4 h-4 text-amber-500" />
                  <span class="text-xs font-semibold text-white">Novo agendamento!</span>
                </div>
              </div>

              <div class="absolute top-32 -left-10 px-3 py-1.5 rounded-xl glass-gold border border-amber-500/30 animate-float shadow-lg" style="animation-delay: 0.3s">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:trending-up" class="w-4 h-4 text-emerald-500" />
                  <span class="text-xs font-semibold text-white">+127 clientes/mês</span>
                </div>
              </div>

              <div class="absolute -bottom-2 -left-6 px-3 py-1.5 rounded-xl glass-gold border border-amber-500/30 animate-float shadow-lg" style="animation-delay: 0.6s">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:wallet" class="w-4 h-4 text-emerald-500" />
                  <span class="text-xs font-semibold text-white">+R$ 8.500/mês</span>
                </div>
              </div>

              <div class="absolute bottom-24 -right-8 px-3 py-1.5 rounded-xl glass-gold border border-amber-500/30 animate-float shadow-lg" style="animation-delay: 0.9s">
                <div class="flex items-center gap-2">
                  <div class="flex -space-x-1">
                    <div class="w-4 h-4 rounded-full bg-amber-500 border border-black" />
                    <div class="w-4 h-4 rounded-full bg-emerald-500 border border-black" />
                    <div class="w-4 h-4 rounded-full bg-blue-500 border border-black" />
                  </div>
                  <span class="text-xs font-semibold text-white">+3 avaliações 5★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span class="text-xs text-neutral-500">Role para ver mais</span>
        <Icon name="lucide:chevron-down" class="w-5 h-5 text-amber-500" />
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative py-20 border-y border-neutral-800/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">{{ stat.value }}</div>
            <p class="text-sm text-neutral-400">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="beneficios" class="relative py-24">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]" />
      
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            Por que nos escolher
          </span>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Benefícios exclusivos para sua barbearia
          </h2>
          <p class="text-neutral-400 max-w-2xl mx-auto">
            Oferecemos tudo que você precisa para crescer e se destacar no mercado
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="benefit in benefits" 
            :key="benefit.title"
            class="group p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/50 hover:border-amber-500/30 transition-all duration-500"
          >
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              :class="benefit.iconBg"
            >
              <Icon :name="benefit.icon" class="w-7 h-7" :class="benefit.iconColor" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {{ benefit.title }}
            </h3>
            <p class="text-neutral-400 text-sm leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- KILLER FEATURES Section -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
      <div class="absolute top-1/2 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
      
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            🔥 Diferenciais Exclusivos
          </span>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Funcionalidades que <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">ninguém mais tem</span>
          </h2>
          <p class="text-neutral-400 max-w-2xl mx-auto">
            Recursos criados por quem entende de barbearia. Cada função resolve um problema REAL do seu dia a dia.
          </p>
        </div>

        <!-- Killer Feature 1: Anti-Falta -->
        <div class="grid lg:grid-cols-2 gap-8 mb-8">
          <div class="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 via-transparent to-transparent border border-red-500/20 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all" />
            <div class="relative">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Icon name="lucide:shield-ban" class="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <span class="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">NOVO</span>
                  <h3 class="text-2xl font-bold text-white mt-1">Sistema Anti-Falta</h3>
                </div>
              </div>
              <p class="text-neutral-400 mb-6">
                Chega de cliente marcar e não aparecer! Nosso sistema cobra um <span class="text-white font-semibold">sinal de R$10-20</span> para reservar o horário. 
                Se ele faltar, <span class="text-red-400 font-semibold">você não perde dinheiro</span>.
              </p>
              <div class="flex items-center gap-6">
                <div class="text-center">
                  <p class="text-3xl font-bold text-red-400">-60%</p>
                  <p class="text-xs text-neutral-500">de faltas</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-emerald-400">+R$800</p>
                  <p class="text-xs text-neutral-500">salvos/mês</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-amber-400">98%</p>
                  <p class="text-xs text-neutral-500">comparecem</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Killer Feature 2: Repetir Último Corte -->
          <div class="p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-transparent border border-violet-500/20 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all" />
            <div class="relative">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Icon name="lucide:camera" class="w-8 h-8 text-violet-500" />
                </div>
                <div>
                  <span class="px-2 py-1 rounded-full bg-violet-500 text-white text-xs font-bold">IA</span>
                  <h3 class="text-2xl font-bold text-white mt-1">"Repetir Último Corte"</h3>
                </div>
              </div>
              <p class="text-neutral-400 mb-6">
                Salva <span class="text-white font-semibold">foto + anotações</span> de cada corte. Quando o cliente voltar, você abre e vê: 
                <span class="text-violet-400 italic">"Degradê 1 lateral, tesoura em cima, barba contornada"</span>
              </p>
              <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <p class="text-xs text-neutral-500 mb-2">Último corte de João Silva:</p>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Icon name="lucide:image" class="w-6 h-6 text-neutral-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-white">Degradê médio + Barba</p>
                    <p class="text-xs text-neutral-500">15/12/2024 • Carlos atendeu</p>
                  </div>
                  <Icon name="lucide:chevron-right" class="w-5 h-5 text-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- More Killer Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Dashboard de Ganhos -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-emerald-500/30 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-emerald-500" />
            </div>
            <h4 class="text-lg font-semibold text-white mb-2">Quanto Ganhei?</h4>
            <p class="text-sm text-neutral-400 mb-4">Veja em tempo real seus ganhos do dia, semana e mês.</p>
            <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p class="text-xs text-emerald-400">Hoje</p>
              <p class="text-2xl font-bold text-white">R$ 485<span class="text-sm text-emerald-400 ml-2">↑ 12%</span></p>
            </div>
          </div>

          <!-- Comissão Automática -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:calculator" class="w-6 h-6 text-amber-500" />
            </div>
            <h4 class="text-lg font-semibold text-white mb-2">Comissão Automática</h4>
            <p class="text-sm text-neutral-400 mb-4">Sistema calcula a comissão de cada barbeiro automaticamente.</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-400">Carlos (50%)</span>
                <span class="text-white font-medium">R$ 225</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-400">João (45%)</span>
                <span class="text-white font-medium">R$ 180</span>
              </div>
            </div>
          </div>

          <!-- Fila Virtual -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/30 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:users" class="w-6 h-6 text-blue-500" />
            </div>
            <h4 class="text-lg font-semibold text-white mb-2">Fila Virtual</h4>
            <p class="text-sm text-neutral-400 mb-4">Cliente vê a fila em tempo real, sem precisar ligar.</p>
            <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <div class="w-6 h-6 rounded-full bg-neutral-700 border-2 border-neutral-900" />
                  <div class="w-6 h-6 rounded-full bg-neutral-600 border-2 border-neutral-900" />
                  <div class="w-6 h-6 rounded-full bg-neutral-500 border-2 border-neutral-900" />
                </div>
                <span class="text-sm text-white">3 na frente • ~45min</span>
              </div>
            </div>
          </div>

          <!-- WhatsApp Bot -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-green-500/30 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="mdi:whatsapp" class="w-6 h-6 text-green-500" />
            </div>
            <h4 class="text-lg font-semibold text-white mb-2">WhatsApp 24h</h4>
            <p class="text-sm text-neutral-400 mb-4">Bot responde e agenda clientes automaticamente.</p>
            <div class="space-y-2">
              <div class="flex gap-2">
                <div class="px-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-neutral-300">Quero agendar</div>
              </div>
              <div class="flex gap-2 justify-end">
                <div class="px-3 py-1.5 rounded-xl bg-green-500/20 text-xs text-green-400">Claro! Escolha o dia 📅</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fidelidade + Link Bio Row -->
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <!-- Fidelidade Digital -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center gap-6">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:gift" class="w-8 h-8 text-amber-500" />
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-white mb-1">Cartão Fidelidade Digital</h4>
              <p class="text-sm text-neutral-400">A cada 10 cortes, o 11º é <span class="text-amber-400 font-bold">GRÁTIS</span>. Cliente volta sempre!</p>
            </div>
            <div class="text-center px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <p class="text-2xl font-bold text-amber-400">8/10</p>
              <p class="text-xs text-amber-400/70">cortes</p>
            </div>
          </div>

          <!-- Link Bio -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center gap-6">
            <div class="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:link" class="w-8 h-8 text-pink-500" />
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-white mb-1">Link Bio Inteligente</h4>
              <p class="text-sm text-neutral-400">Um link pro Instagram com <span class="text-pink-400 font-bold">TUDO</span>: agenda, preços, portfólio, WhatsApp.</p>
            </div>
            <div class="px-4 py-3 rounded-xl bg-pink-500/20 border border-pink-500/30">
              <p class="text-xs text-pink-400 font-mono">barberplus.app/</p>
              <p class="text-sm text-white font-bold font-mono">suabarbearia</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-12">
          <p class="text-neutral-400 mb-4">E muito mais funcionalidades exclusivas...</p>
          <button class="btn-premium px-8 py-4 text-lg">
            <span class="flex items-center gap-2">
              Quero todas essas funcionalidades
              <Icon name="lucide:arrow-right" class="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Marketing Section -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
      
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
              🎯 Marketing Gratuito
            </span>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Divulgação semanal <span class="text-gold-gradient">sem custo adicional</span>
            </h2>
            <p class="text-neutral-400 mb-8">
              Toda semana divulgamos as barbearias parceiras em nossas redes sociais, 
              newsletters e campanhas de marketing. Alcance milhares de potenciais clientes 
              sem gastar nada a mais.
            </p>

            <div class="space-y-4">
              <div v-for="marketing in marketingFeatures" :key="marketing" class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-500" />
                </div>
                <span class="text-neutral-300">{{ marketing }}</span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-3xl blur-2xl" />
            <div class="relative grid grid-cols-2 gap-4">
              <div class="space-y-4">
                <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Icon name="mdi:instagram" class="w-8 h-8 text-pink-500 mb-3" />
                  <p class="text-2xl font-bold text-white">50K+</p>
                  <p class="text-sm text-neutral-500">Seguidores</p>
                </div>
                <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Icon name="lucide:mail" class="w-8 h-8 text-blue-500 mb-3" />
                  <p class="text-2xl font-bold text-white">15K+</p>
                  <p class="text-sm text-neutral-500">Newsletter</p>
                </div>
              </div>
              <div class="space-y-4 mt-8">
                <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Icon name="mdi:facebook" class="w-8 h-8 text-blue-600 mb-3" />
                  <p class="text-2xl font-bold text-white">30K+</p>
                  <p class="text-sm text-neutral-500">Curtidas</p>
                </div>
                <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Icon name="mdi:google" class="w-8 h-8 text-red-500 mb-3" />
                  <p class="text-2xl font-bold text-white">Ads</p>
                  <p class="text-sm text-neutral-500">Campanhas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Section -->
    <section id="recursos" class="relative py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- AI Visualization -->
          <div class="relative order-2 lg:order-1">
            <div class="absolute -inset-4 bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-3xl blur-2xl" />
            <div class="relative p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800">
              <!-- AI Brain Animation -->
              <div class="flex justify-center mb-8">
                <div class="relative w-32 h-32">
                  <div class="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div class="relative w-full h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                    <Icon name="lucide:brain" class="w-16 h-16 text-white" />
                  </div>
                  <!-- Orbiting dots -->
                  <div class="absolute inset-0 animate-spin" style="animation-duration: 8s">
                    <div class="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500" />
                  </div>
                  <div class="absolute inset-0 animate-spin" style="animation-duration: 6s; animation-direction: reverse">
                    <div class="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              <!-- AI Features -->
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50">
                  <Icon name="lucide:calendar-check" class="w-5 h-5 text-violet-400" />
                  <span class="text-sm text-neutral-300">Agendamento inteligente automático</span>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50">
                  <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-violet-400" />
                  <span class="text-sm text-neutral-300">Previsão de demanda e horários</span>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50">
                  <Icon name="lucide:message-square" class="w-5 h-5 text-violet-400" />
                  <span class="text-sm text-neutral-300">Respostas automáticas personalizadas</span>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50">
                  <Icon name="lucide:lightbulb" class="w-5 h-5 text-violet-400" />
                  <span class="text-sm text-neutral-300">Sugestões de melhorias do negócio</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="order-1 lg:order-2">
            <span class="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4">
              🤖 Inteligência Artificial
            </span>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              IA que trabalha <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">24 horas</span> por você
            </h2>
            <p class="text-neutral-400 mb-8">
              Nossa inteligência artificial analisa padrões, otimiza agendamentos e 
              responde clientes automaticamente. Você foca no que sabe fazer de melhor: 
              atender seus clientes.
            </p>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <p class="text-3xl font-bold text-violet-400 mb-1">98%</p>
                <p class="text-sm text-neutral-500">Precisão nos agendamentos</p>
              </div>
              <div class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <p class="text-3xl font-bold text-violet-400 mb-1">-40%</p>
                <p class="text-sm text-neutral-500">Menos faltas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="depoimentos" class="relative py-24 bg-neutral-900/30">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            Depoimentos
          </span>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            O que nossos parceiros dizem
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.name"
            class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800"
          >
            <div class="flex items-center gap-1 mb-4">
              <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p class="text-neutral-300 mb-6 italic">
              "{{ testimonial.content }}"
            </p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
                {{ testimonial.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-white">{{ testimonial.name }}</p>
                <p class="text-sm text-neutral-500">{{ testimonial.shop }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="precos" class="relative py-24">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
      
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            Planos
          </span>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Escolha o plano ideal
          </h2>
          <p class="text-neutral-400">Comece grátis e evolua conforme cresce</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <!-- Free Plan -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 class="text-xl font-semibold text-white mb-2">Starter</h3>
            <p class="text-neutral-500 text-sm mb-6">Para começar</p>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">Grátis</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in starterFeatures" :key="feature" class="flex items-center gap-2 text-sm text-neutral-400">
                <Icon name="lucide:check" class="w-4 h-4 text-emerald-500" />
                {{ feature }}
              </li>
            </ul>
            <button class="w-full py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:border-amber-500/50 transition-colors">
              Começar grátis
            </button>
          </div>

          <!-- Pro Plan -->
          <div class="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 relative">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
              POPULAR
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Pro</h3>
            <p class="text-neutral-500 text-sm mb-6">Para crescer</p>
            <div class="mb-6">
              <span class="text-4xl font-bold text-gold-gradient">R$ 99</span>
              <span class="text-neutral-500">/mês</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in proFeatures" :key="feature" class="flex items-center gap-2 text-sm text-neutral-300">
                <Icon name="lucide:check" class="w-4 h-4 text-amber-500" />
                {{ feature }}
              </li>
            </ul>
            <button class="w-full btn-premium py-3">
              <span>Assinar agora</span>
            </button>
          </div>

          <!-- Enterprise Plan -->
          <div class="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
            <h3 class="text-xl font-semibold text-white mb-2">Enterprise</h3>
            <p class="text-neutral-500 text-sm mb-6">Para redes</p>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">Sob consulta</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in enterpriseFeatures" :key="feature" class="flex items-center gap-2 text-sm text-neutral-400">
                <Icon name="lucide:check" class="w-4 h-4 text-emerald-500" />
                {{ feature }}
              </li>
            </ul>
            <button class="w-full py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:border-amber-500/50 transition-colors">
              Falar com vendas
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-24">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <div class="p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-500/10 border border-amber-500/20">
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para revolucionar sua barbearia?
          </h2>
          <p class="text-neutral-400 mb-8 max-w-xl mx-auto">
            Junte-se a mais de 500 barbearias que já estão crescendo com o BarberPlus. 
            Cadastro gratuito, sem cartão de crédito.
          </p>
          <button class="btn-premium px-12 py-4 text-lg glow-gold">
            <span class="flex items-center gap-2">
              Cadastrar minha barbearia
              <Icon name="lucide:arrow-right" class="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-neutral-800/50 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Icon name="lucide:scissors" class="w-5 h-5 text-black" />
            </div>
            <span class="font-display text-xl font-semibold text-white">
              Barber<span class="text-gold-gradient">Plus</span>
            </span>
          </div>
          
          <div class="flex items-center gap-6">
            <a href="#" class="text-neutral-500 hover:text-white transition-colors">
              <Icon name="mdi:instagram" class="w-6 h-6" />
            </a>
            <a href="#" class="text-neutral-500 hover:text-white transition-colors">
              <Icon name="mdi:facebook" class="w-6 h-6" />
            </a>
            <a href="#" class="text-neutral-500 hover:text-white transition-colors">
              <Icon name="mdi:linkedin" class="w-6 h-6" />
            </a>
            <a href="#" class="text-neutral-500 hover:text-white transition-colors">
              <Icon name="mdi:youtube" class="w-6 h-6" />
            </a>
          </div>
          
          <p class="text-sm text-neutral-500">
            © 2025 BarberPlus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const stats = [
  { value: '500+', label: 'Barbearias parceiras' },
  { value: '50K+', label: 'Agendamentos/mês' },
  { value: '4.9', label: 'Avaliação média' },
  { value: '98%', label: 'Satisfação' }
]

const benefits = [
  {
    icon: 'lucide:megaphone',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    title: 'Divulgação Semanal',
    description: 'Sua barbearia aparece nas nossas campanhas de marketing toda semana. Instagram, Facebook, Google Ads e newsletter.'
  },
  {
    icon: 'lucide:calendar-check',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    title: 'Agendamento Online',
    description: 'Sistema completo de agendamentos 24h. Seus clientes marcam horário a qualquer momento, você só atende.'
  },
  {
    icon: 'lucide:brain',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    title: 'Inteligência Artificial',
    description: 'IA que otimiza sua agenda, responde clientes automaticamente e prevê demanda para maximizar lucros.'
  },
  {
    icon: 'lucide:smartphone',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    title: 'App Exclusivo',
    description: 'Aplicativo premium onde seus clientes encontram você facilmente. Interface moderna e intuitiva.'
  },
  {
    icon: 'lucide:bar-chart-2',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    title: 'Dashboard Completo',
    description: 'Relatórios detalhados de vendas, clientes, serviços mais pedidos e horários de pico.'
  },
  {
    icon: 'lucide:credit-card',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    title: 'Pagamento Integrado',
    description: 'Aceite Pix, cartões e dinheiro. Receba pagamentos antecipados e reduza faltas.'
  }
]

const marketingFeatures = [
  'Posts semanais no Instagram com sua barbearia',
  'Destaque em campanhas de Google Ads',
  'Inclusão na newsletter com 15K+ inscritos',
  'Stories e Reels promovendo seus serviços',
  'SEO otimizado para aparecer no Google',
  'Programa de indicação entre clientes'
]

const testimonials = [
  {
    name: 'Carlos Silva',
    shop: 'Barbearia Premium',
    content: 'Em 3 meses aumentamos nosso faturamento em 250%. A divulgação que o BarberPlus faz é incrível, sempre lotamos.'
  },
  {
    name: 'Ricardo Santos',
    shop: 'Barber Kings',
    content: 'A IA de agendamento é genial. Reduzi as faltas em 60% e minha agenda está sempre otimizada.'
  },
  {
    name: 'Fernando Costa',
    shop: 'Classic Cuts',
    content: 'Melhor investimento que fiz. O sistema é completo e o suporte é excepcional. Recomendo demais!'
  }
]

const starterFeatures = [
  'Perfil no marketplace',
  'Até 50 agendamentos/mês',
  'Divulgação mensal',
  'Dashboard básico',
  'Suporte por email'
]

const proFeatures = [
  'Tudo do Starter',
  'Agendamentos ilimitados',
  'Divulgação semanal',
  'IA de agendamento',
  'Dashboard completo',
  'Pagamento integrado',
  'Suporte prioritário'
]

const enterpriseFeatures = [
  'Tudo do Pro',
  'Múltiplas unidades',
  'API personalizada',
  'Gerente de conta dedicado',
  'Campanhas exclusivas',
  'Treinamento da equipe'
]

useSeoMeta({
  title: 'BarberPlus para Barbearias - Aumente seus clientes em 300%',
  description: 'Cadastre sua barbearia no maior marketplace do Brasil. Sistema de agendamento, IA, marketing semanal gratuito e muito mais.',
  ogTitle: 'BarberPlus para Barbearias',
  ogDescription: 'Aumente seus clientes em 300% com nossa plataforma.',
  ogImage: '/og-lp.png'
})
</script>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Phone Mockup Styles */
.phone-container {
  perspective: 1000px;
}

.phone-container::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
  z-index: -1;
}

/* Screen Reflection */
.phone-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
  border-radius: 2.8rem 2.8rem 0 0;
  pointer-events: none;
  z-index: 10;
  margin: 3px;
}

/* Floating animation with slight rotation */
.phone-container:hover {
  animation: phoneHover 0.3s ease forwards;
}

@keyframes phoneHover {
  to {
    transform: translateY(-5px) rotateX(2deg);
  }
}
</style>

