<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-md' }">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Icon name="lucide:scissors" class="w-8 h-8 text-black" />
        </div>
        <h2 class="text-2xl font-display font-bold text-white">
          {{ isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta' }}
        </h2>
        <p class="text-neutral-400 text-sm mt-2">
          {{ isLogin ? 'Entre para continuar agendando' : 'Comece a agendar agora mesmo' }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex mb-6 p-1 rounded-xl bg-neutral-800/50">
        <button
          :class="[
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
            isLogin ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'
          ]"
          @click="isLogin = true"
        >
          Entrar
        </button>
        <button
          :class="[
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
            !isLogin ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'
          ]"
          @click="isLogin = false"
        >
          Cadastrar
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
        <p class="text-sm text-red-400 flex items-center gap-2">
          <Icon name="lucide:alert-circle" class="w-4 h-4" />
          {{ errorMessage }}
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p class="text-sm text-emerald-400 flex items-center gap-2">
          <Icon name="lucide:check-circle" class="w-4 h-4" />
          {{ successMessage }}
        </p>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Email</label>
          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="loginForm.email"
              type="email"
              placeholder="seu@email.com"
              required
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Senha</label>
          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
            <span class="text-sm text-neutral-400">Lembrar de mim</span>
          </label>
          <button type="button" class="text-sm text-amber-500 hover:text-amber-400 transition-colors">
            Esqueci a senha
          </button>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Nome completo</label>
          <div class="relative">
            <Icon name="lucide:user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="registerForm.fullName"
              type="text"
              placeholder="Seu nome completo"
              required
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Email</label>
          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="seu@email.com"
              required
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-400 mb-2">WhatsApp</label>
          <div class="relative">
            <Icon name="lucide:phone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="registerForm.phone"
              type="tel"
              placeholder="(79) 99999-9999"
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Senha</label>
          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Tipo de conta -->
        <div>
          <label class="block text-sm text-neutral-400 mb-2">Tipo de conta</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              :class="[
                'p-3 rounded-xl border-2 transition-all text-left',
                registerForm.role === 'client' 
                  ? 'border-amber-500 bg-amber-500/10' 
                  : 'border-neutral-700 hover:border-neutral-600'
              ]"
              @click="registerForm.role = 'client'"
            >
              <Icon name="lucide:user" class="w-6 h-6 mb-2" :class="registerForm.role === 'client' ? 'text-amber-500' : 'text-neutral-400'" />
              <p class="font-medium text-white text-sm">Cliente</p>
              <p class="text-xs text-neutral-500">Agendar serviços</p>
            </button>
            <button
              type="button"
              :class="[
                'p-3 rounded-xl border-2 transition-all text-left',
                registerForm.role === 'manager' 
                  ? 'border-amber-500 bg-amber-500/10' 
                  : 'border-neutral-700 hover:border-neutral-600'
              ]"
              @click="registerForm.role = 'manager'"
            >
              <Icon name="lucide:store" class="w-6 h-6 mb-2" :class="registerForm.role === 'manager' ? 'text-amber-500' : 'text-neutral-400'" />
              <p class="font-medium text-white text-sm">Barbearia</p>
              <p class="text-xs text-neutral-500">Gerenciar negócio</p>
            </button>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <input type="checkbox" v-model="acceptTerms" required class="mt-1 w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
          <span class="text-sm text-neutral-400">
            Concordo com os <button type="button" class="text-amber-500 hover:text-amber-400">Termos de Uso</button> e <button type="button" class="text-amber-500 hover:text-amber-400">Política de Privacidade</button>
          </span>
        </div>
        <button
          type="submit"
          :disabled="isLoading || !acceptTerms"
          class="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
          {{ isLoading ? 'Criando conta...' : 'Criar conta grátis' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-px bg-neutral-800"></div>
        <span class="text-sm text-neutral-500">ou continue com</span>
        <div class="flex-1 h-px bg-neutral-800"></div>
      </div>

      <!-- Social Login -->
      <div class="grid grid-cols-2 gap-3">
        <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <Icon name="logos:google-icon" class="w-5 h-5" />
          <span class="text-sm text-white">Google</span>
        </button>
        <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <Icon name="mdi:apple" class="w-5 h-5 text-white" />
          <span class="text-sm text-white">Apple</span>
        </button>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const { login, register, isLoading: authLoading } = useAuth()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLogin = ref(true)
const showPassword = ref(false)
const rememberMe = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'client' as 'client' | 'manager'
})

const resetForms = () => {
  loginForm.value = { email: '', password: '' }
  registerForm.value = { fullName: '', email: '', phone: '', password: '', role: 'client' }
  errorMessage.value = ''
  successMessage.value = ''
}

watch(isOpen, (newVal) => {
  if (!newVal) {
    resetForms()
  }
})

watch(isLogin, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const result = await login(loginForm.value.email, loginForm.value.password)
    
    if (result.success) {
      successMessage.value = 'Login realizado com sucesso!'
      setTimeout(() => {
        isOpen.value = false
        emit('success')
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Erro ao fazer login'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao fazer login'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const result = await register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      fullName: registerForm.value.fullName,
      phone: registerForm.value.phone || undefined,
      role: registerForm.value.role
    })
    
    if (result.success) {
      successMessage.value = 'Conta criada com sucesso!'
      setTimeout(() => {
        isOpen.value = false
        emit('success')
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Erro ao criar conta'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao criar conta'
  } finally {
    isLoading.value = false
  }
}
</script>
