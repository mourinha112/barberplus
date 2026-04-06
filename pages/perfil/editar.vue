<template>
  <div class="min-h-screen">
    <div class="container-app py-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button @click="navigateTo('/perfil')" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <h1 class="font-display text-2xl font-semibold text-white">Editar Perfil</h1>
      </div>

      <!-- Avatar -->
      <div class="flex justify-center mb-8">
        <div class="relative">
          <div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-500/50">
            <img
              :src="form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.fullName) + '&background=f59e0b&color=000&size=200'"
              :alt="form.fullName"
              class="w-full h-full object-cover"
            />
          </div>
          <button
            class="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-lg hover:bg-amber-400 transition-colors"
            @click="$refs.avatarInput?.click()"
          >
            <Icon name="lucide:camera" class="w-5 h-5" />
          </button>
          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveProfile" class="space-y-5">
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Nome completo</label>
          <input
            v-model="form.fullName"
            type="text"
            required
            class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm text-neutral-400 mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm text-neutral-400 mb-2">WhatsApp</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="(79) 99999-9999"
            class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </form>

      <!-- Change Password -->
      <div class="mt-8 pt-6 border-t border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-4">Alterar senha</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Senha atual</label>
            <input
              v-model="passwordForm.current"
              type="password"
              required
              class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Nova senha</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm text-neutral-400 mb-2">Confirmar nova senha</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            :disabled="changingPassword"
            class="w-full py-3 rounded-xl border border-amber-500/50 text-amber-500 font-semibold hover:bg-amber-500/10 transition-colors disabled:opacity-50"
          >
            {{ changingPassword ? 'Alterando...' : 'Alterar senha' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth()
const toast = useToast()

const saving = ref(false)
const changingPassword = ref(false)

const form = ref({
  fullName: user.value?.fullName || user.value?.full_name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  avatar: user.value?.avatarUrl || user.value?.avatar_url || ''
})

const passwordForm = ref({
  current: '',
  newPassword: '',
  confirm: ''
})

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await $fetch('/api/auth/me', {
      method: 'PATCH',
      headers: useAuth().authHeaders.value,
      body: {
        fullName: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone
      }
    })
    await fetchUser()
    toast.add({ title: 'Perfil atualizado!', icon: 'i-lucide-check', color: 'green' })
  } catch {
    toast.add({ title: 'Erro ao salvar', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    toast.add({ title: 'As senhas não coincidem', icon: 'i-lucide-alert-circle', color: 'red' })
    return
  }

  changingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      headers: useAuth().authHeaders.value,
      body: {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.newPassword
      }
    })
    toast.add({ title: 'Senha alterada!', icon: 'i-lucide-check', color: 'green' })
    passwordForm.value = { current: '', newPassword: '', confirm: '' }
  } catch {
    toast.add({ title: 'Erro ao alterar senha', description: 'Verifique sua senha atual', icon: 'i-lucide-alert-circle', color: 'red' })
  } finally {
    changingPassword.value = false
  }
}

watch(user, (newUser) => {
  if (newUser) {
    form.value.fullName = newUser.fullName || newUser.full_name || ''
    form.value.email = newUser.email || ''
    form.value.phone = newUser.phone || ''
    form.value.avatar = newUser.avatarUrl || newUser.avatar_url || ''
  }
}, { immediate: true })

useSeoMeta({
  title: 'Editar Perfil - BarberPlus'
})
</script>
