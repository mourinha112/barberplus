<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/perfil')" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
            <Icon name="lucide:arrow-left" class="w-5 h-5 text-neutral-400" />
          </button>
          <h1 class="font-display text-2xl font-semibold text-white">Notificações</h1>
        </div>
        <button
          v-if="notifications.length > 0"
          class="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          @click="markAllAsRead"
        >
          Marcar todas como lidas
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-800" />
            <div class="flex-1">
              <div class="h-4 w-48 bg-neutral-800 rounded mb-2" />
              <div class="h-3 w-64 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div v-else-if="notifications.length > 0" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer',
            notification.is_read
              ? 'bg-neutral-900/30 border-neutral-800/50'
              : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="getNotificationStyle(notification.type).bg"
          >
            <Icon :name="getNotificationStyle(notification.type).icon" class="w-5 h-5" :class="getNotificationStyle(notification.type).color" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-sm font-medium" :class="notification.is_read ? 'text-neutral-400' : 'text-white'">
                {{ notification.title }}
              </h3>
              <span v-if="!notification.is_read" class="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p class="text-sm text-neutral-500">{{ notification.message }}</p>
            <p class="text-xs text-neutral-600 mt-1">{{ notification.timeAgo }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <Icon name="lucide:bell-off" class="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Sem notificações</h3>
        <p class="text-sm text-neutral-500">Você receberá notificações sobre seus agendamentos aqui</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { authHeaders } = useAuth()
const toast = useToast()

const loading = ref(true)
const notifications = ref<any[]>([])

const getNotificationStyle = (type: string) => {
  const styles: Record<string, { icon: string; bg: string; color: string }> = {
    appointment: { icon: 'lucide:calendar', bg: 'bg-blue-500/20', color: 'text-blue-500' },
    reminder: { icon: 'lucide:clock', bg: 'bg-amber-500/20', color: 'text-amber-500' },
    review: { icon: 'lucide:star', bg: 'bg-violet-500/20', color: 'text-violet-500' },
    promotion: { icon: 'lucide:tag', bg: 'bg-emerald-500/20', color: 'text-emerald-500' },
    loyalty: { icon: 'lucide:gift', bg: 'bg-pink-500/20', color: 'text-pink-500' },
    system: { icon: 'lucide:info', bg: 'bg-neutral-700/50', color: 'text-neutral-400' }
  }
  return styles[type] || styles.system
}

const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString('pt-BR')
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/user/notifications', {
      headers: authHeaders.value
    }) as any

    if (response.success) {
      notifications.value = (response.data || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type || 'system',
        is_read: n.is_read || false,
        action_url: n.action_url,
        timeAgo: getTimeAgo(n.created_at || new Date().toISOString())
      }))
    }
  } catch {
    // No notifications endpoint yet - show empty
  } finally {
    loading.value = false
  }
}

const markAllAsRead = async () => {
  try {
    await $fetch('/api/user/notifications/read-all', {
      method: 'POST',
      headers: authHeaders.value
    })
    notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
    toast.add({ title: 'Todas marcadas como lidas', icon: 'i-lucide-check', color: 'green' })
  } catch {
    notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
  }
}

const handleNotificationClick = (notification: any) => {
  notification.is_read = true
  if (notification.action_url) {
    navigateTo(notification.action_url)
  }
}

onMounted(() => {
  fetchNotifications()
})

useSeoMeta({
  title: 'Notificações - BarberPlus'
})
</script>
