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
</script>

