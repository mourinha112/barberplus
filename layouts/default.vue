<template>
  <div class="min-h-screen bg-[#0a0a0a] flex flex-col">
    <!-- Top Navbar -->
    <AppNavbar />
    
    <!-- Main Content -->
    <main class="flex-1 safe-bottom">
      <slot />
    </main>
    
    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const { init, fetchUser, isAuthenticated } = useAuth()

// Initialize auth state from localStorage
onMounted(async () => {
  init()
  
  // If user has token, fetch fresh user data
  if (isAuthenticated.value) {
    await fetchUser()
  }
})
</script>
