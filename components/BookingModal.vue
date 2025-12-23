<template>
  <UModal 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    :ui="{ 
      width: 'max-w-lg',
      background: 'bg-[#121212]',
      ring: 'ring-neutral-800'
    }"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-xl font-semibold text-white">Agendar horário</h2>
          <p class="text-sm text-neutral-500">{{ barbershop.name }}</p>
        </div>
        <button 
          class="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          @click="$emit('update:modelValue', false)"
        >
          <Icon name="lucide:x" class="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <!-- Steps -->
      <div class="flex items-center justify-between mb-8">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex items-center"
        >
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
              currentStep >= index + 1 
                ? 'bg-amber-500 text-black' 
                : 'bg-neutral-800 text-neutral-500'
            ]"
          >
            <Icon v-if="currentStep > index + 1" name="lucide:check" class="w-4 h-4" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div 
            v-if="index < steps.length - 1"
            :class="[
              'w-16 h-0.5 mx-2 transition-colors',
              currentStep > index + 1 ? 'bg-amber-500' : 'bg-neutral-800'
            ]"
          />
        </div>
      </div>

      <!-- Step 1: Select Service -->
      <div v-if="currentStep === 1" class="space-y-3">
        <h3 class="text-sm font-medium text-neutral-400 mb-3">Selecione o serviço</h3>
        <div 
          v-for="service in services" 
          :key="service.id"
          :class="[
            'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
            selectedService?.id === service.id 
              ? 'bg-amber-500/10 border-amber-500/50' 
              : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
          ]"
          @click="selectService(service)"
        >
          <div 
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              selectedService?.id === service.id ? 'border-amber-500 bg-amber-500' : 'border-neutral-600'
            ]"
          >
            <Icon v-if="selectedService?.id === service.id" name="lucide:check" class="w-3 h-3 text-black" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ service.name }}</p>
            <p class="text-xs text-neutral-500">{{ service.duration }} min</p>
          </div>
          <span class="text-sm font-semibold text-amber-500">R$ {{ service.price }}</span>
        </div>
      </div>

      <!-- Step 2: Select Professional -->
      <div v-if="currentStep === 2" class="space-y-3">
        <h3 class="text-sm font-medium text-neutral-400 mb-3">Selecione o profissional</h3>
        <div 
          v-for="pro in professionals" 
          :key="pro.id"
          :class="[
            'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
            selectedProfessional?.id === pro.id 
              ? 'bg-amber-500/10 border-amber-500/50' 
              : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
          ]"
          @click="selectedProfessional = pro"
        >
          <img :src="pro.avatar" :alt="pro.name" class="w-12 h-12 rounded-xl object-cover" />
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ pro.name }}</p>
            <div class="flex items-center gap-1 text-xs text-neutral-500">
              <Icon name="lucide:star" class="w-3 h-3 text-amber-400 fill-amber-400" />
              {{ pro.rating }}
            </div>
          </div>
          <div 
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              selectedProfessional?.id === pro.id ? 'border-amber-500 bg-amber-500' : 'border-neutral-600'
            ]"
          >
            <Icon v-if="selectedProfessional?.id === pro.id" name="lucide:check" class="w-3 h-3 text-black" />
          </div>
        </div>
      </div>

      <!-- Step 3: Select Date & Time -->
      <div v-if="currentStep === 3" class="space-y-4">
        <h3 class="text-sm font-medium text-neutral-400">Selecione a data</h3>
        
        <!-- Date Picker -->
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button 
            v-for="date in availableDates" 
            :key="date.value"
            :class="[
              'flex flex-col items-center p-3 rounded-xl min-w-[70px] transition-all',
              selectedDate === date.value 
                ? 'bg-amber-500 text-black' 
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-amber-500/30'
            ]"
            @click="selectedDate = date.value"
          >
            <span class="text-xs opacity-70">{{ date.weekday }}</span>
            <span class="text-lg font-bold">{{ date.day }}</span>
            <span class="text-xs opacity-70">{{ date.month }}</span>
          </button>
        </div>

        <h3 class="text-sm font-medium text-neutral-400 mt-4">Selecione o horário</h3>
        
        <!-- Time Slots -->
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="time in timeSlots" 
            :key="time"
            :class="[
              'py-2 px-3 rounded-xl text-sm font-medium transition-all',
              selectedTime === time 
                ? 'bg-amber-500 text-black' 
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-amber-500/30'
            ]"
            @click="selectedTime = time"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <!-- Step 4: Confirmation -->
      <div v-if="currentStep === 4" class="space-y-4">
        <h3 class="text-sm font-medium text-neutral-400 mb-3">Confirmar agendamento</h3>
        
        <div class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-500">Serviço</span>
            <span class="text-sm font-medium text-white">{{ selectedService?.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-500">Profissional</span>
            <span class="text-sm font-medium text-white">{{ selectedProfessional?.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-500">Data</span>
            <span class="text-sm font-medium text-white">{{ formattedDate }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-500">Horário</span>
            <span class="text-sm font-medium text-white">{{ selectedTime }}</span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-neutral-800">
            <span class="text-sm font-medium text-white">Total</span>
            <span class="text-lg font-bold text-gold-gradient">R$ {{ selectedService?.price?.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-6">
        <button 
          v-if="currentStep > 1"
          class="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
          @click="currentStep--"
        >
          Voltar
        </button>
        <button 
          class="flex-1 btn-premium"
          :disabled="!canProceed"
          @click="nextStep"
        >
          <span>{{ currentStep === 4 ? 'Confirmar agendamento' : 'Continuar' }}</span>
        </button>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps<{
  modelValue: boolean
  barbershop: any
  services: any[]
  professionals: any[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const currentStep = ref(1)
const selectedService = ref<any>(null)
const selectedProfessional = ref<any>(null)
const selectedDate = ref('')
const selectedTime = ref('')

const steps = [
  { id: 1, name: 'Serviço' },
  { id: 2, name: 'Profissional' },
  { id: 3, name: 'Data e Hora' },
  { id: 4, name: 'Confirmar' }
]

const availableDates = computed(() => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(new Date(), i)
    dates.push({
      value: format(date, 'yyyy-MM-dd'),
      weekday: format(date, 'EEE', { locale: ptBR }),
      day: format(date, 'd'),
      month: format(date, 'MMM', { locale: ptBR })
    })
  }
  return dates
})

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
]

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return format(new Date(selectedDate.value), "d 'de' MMMM", { locale: ptBR })
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return !!selectedService.value
    case 2: return !!selectedProfessional.value
    case 3: return !!selectedDate.value && !!selectedTime.value
    case 4: return true
    default: return false
  }
})

const selectService = (service: any) => {
  selectedService.value = service
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    // Confirm booking
    const toast = useToast()
    toast.add({
      title: 'Agendamento confirmado!',
      description: `Seu horário foi agendado para ${formattedDate.value} às ${selectedTime.value}`,
      icon: 'i-lucide-check-circle',
      color: 'green'
    })
    // Reset and close
    currentStep.value = 1
    selectedService.value = null
    selectedProfessional.value = null
    selectedDate.value = ''
    selectedTime.value = ''
  }
}

// Reset when modal closes
watch(() => props.modelValue, (value) => {
  if (!value) {
    currentStep.value = 1
  }
})
</script>

