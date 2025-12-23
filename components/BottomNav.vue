<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass border-t border-neutral-800/50 pb-safe">
    <div class="container-app">
      <div class="flex items-center justify-around py-2">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item group"
          :class="{ 'active': isActive(item.path) }"
        >
          <div class="nav-icon-wrapper">
            <div 
              class="nav-icon"
              :class="{ 'nav-icon-active': isActive(item.path) }"
            >
              <Icon :name="item.icon" class="w-6 h-6" />
            </div>
            <div 
              v-if="isActive(item.path)" 
              class="nav-indicator"
            />
          </div>
          <span class="nav-label" :class="{ 'nav-label-active': isActive(item.path) }">
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/', icon: 'lucide:home', label: 'Início' },
  { path: '/buscar', icon: 'lucide:search', label: 'Buscar' },
  { path: '/agendamentos', icon: 'lucide:calendar', label: 'Agenda' },
  { path: '/perfil', icon: 'lucide:user', label: 'Perfil' }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300;
}

.nav-icon-wrapper {
  @apply relative flex flex-col items-center;
}

.nav-icon {
  @apply flex items-center justify-center w-12 h-8 rounded-2xl text-neutral-500 transition-all duration-300;
}

.nav-icon-active {
  @apply bg-amber-500/15 text-amber-500;
}

.nav-indicator {
  @apply absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full;
  animation: scaleIn 0.3s ease forwards;
}

.nav-label {
  @apply text-[11px] font-medium text-neutral-500 transition-colors duration-300;
}

.nav-label-active {
  @apply text-amber-500;
}

.nav-item:hover .nav-icon:not(.nav-icon-active) {
  @apply text-neutral-300 bg-neutral-800/50;
}

.nav-item:hover .nav-label:not(.nav-label-active) {
  @apply text-neutral-300;
}

.pb-safe {
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

