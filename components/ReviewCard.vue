<template>
  <div class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
    <!-- Header -->
    <div class="flex items-start gap-3 mb-3">
      <img 
        :src="review.avatar" 
        :alt="review.author"
        class="w-10 h-10 rounded-xl object-cover"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-white">{{ review.author }}</h4>
          <span class="text-xs text-neutral-500">{{ review.date }}</span>
        </div>
        <div class="flex items-center gap-2 mt-0.5">
          <!-- Stars -->
          <div class="flex items-center gap-0.5">
            <Icon 
              v-for="i in 5" 
              :key="i"
              name="lucide:star" 
              :class="['w-3 h-3', i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700']" 
            />
          </div>
          <!-- Service Tag -->
          <span class="text-xs text-neutral-500">• {{ review.service }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <p class="text-sm text-neutral-300 leading-relaxed">
      {{ review.content }}
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-800">
      <button class="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-amber-500 transition-colors">
        <Icon name="lucide:thumbs-up" class="w-4 h-4" />
        Útil
      </button>
      <button class="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-amber-500 transition-colors">
        <Icon name="lucide:message-circle" class="w-4 h-4" />
        Responder
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  content: string
  service: string
}

defineProps<{
  review: Review
}>()
</script>

