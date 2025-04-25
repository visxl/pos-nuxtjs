<template>
  <div class="flex flex-col w-full bg-muted/40 pt-14">
    <header class="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-4 border-b h-14 bg-background">
      <nav class="flex items-center gap-4">
        <div>
          <a href="/" class="text-lg font-bold text-blue-800">Raksmey Kampuchea Bookstore</a>
        </div>
      </nav>
      
      <nav class="flex items-center gap-4">
        <div class="flex items-center justify-start gap-4">
          <span class="text-blue-700">{{ currentTime }}</span>
          <Button size="icon" class="w-auto h-8 px-2 bg-blue-200 hover:bg-blue-100">
            <NuxtLink class="flex items-center gap-2 text-blue-800" href="/inventory">
              <PackageOpen class="w-4 h-4" />
              <span>Inventory</span>
            </NuxtLink>
          </Button>

          <Button size="icon" class="w-auto h-8 px-2 bg-blue-200 hover:bg-blue-100">
            <NuxtLink class="flex items-center gap-2 text-blue-800" href="/pos">
              <LayoutDashboard class="w-4 h-4" />
              <span>POS</span>
            </NuxtLink>
          </Button>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">

import {
  LayoutDashboard,
  PackageOpen
} from "lucide-vue-next";
import { ref, onMounted } from 'vue'

const currentTime = ref(new Date().toLocaleString())

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})
</script>
