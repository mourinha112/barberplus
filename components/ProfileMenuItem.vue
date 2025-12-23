<template>
  <button 
    class="w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-500/30 transition-all group"
    @click="$emit('click')"
  >
    <div class="w-10 h-10 rounded-xl bg-neutral-800 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
      <Icon :name="icon" class="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
    </div>
    <span class="flex-1 text-left text-neutral-300 group-hover:text-white transition-colors">
      {{ label }}
    </span>
    <span 
      v-if="badge" 
      class="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-semibold"
    >
      {{ badge }}
    </span>
    <Icon name="lucide:chevron-right" class="w-5 h-5 text-neutral-600 group-hover:text-amber-500 transition-colors" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  badge?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

