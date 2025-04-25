<template>
  <aside class="relative border w-[200px] h-screen bg-background overflow-hidden">
    <nav class="grid items-start px-2 py-2 text-sm font-medium">
      <Collapsible v-model:open="isOpenInventory">
        <CollapsibleTrigger class="flex items-center justify-start w-full gap-4 p-2 font-medium text-blue-700 rounded-md hover:bg-blue-100">
          <PackageOpen class="w-4 h-4" />
          <span>Inventory</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            class="overflow-hidden transition-all duration-1000 ease-in-out"
            :class="isOpenInventory ? 'opacity-100' : 'max-h-0 opacity-0'"
          >
            <NuxtLink href="/inventory/product" class="flex items-center gap-4 p-2 pl-4 text-blue-700 rounded-md hover:bg-blue-100">
              <Package class="w-4 h-4" />
              <span class="text-sm">List Product</span>
            </NuxtLink>
            <NuxtLink href="/inventory/product/create" class="flex items-center gap-4 p-2 pl-4 text-blue-700 rounded-md hover:bg-blue-100">
              <CirclePlus class="w-4 h-4" />
              <span class="text-sm">Add Product</span>
            </NuxtLink>
            <NuxtLink href="/inventory/product/adjustment" class="flex items-center gap-4 p-2 pl-4 text-blue-700 rounded-md hover:bg-blue-100">
              <PlusSquare class="w-4 h-4" />
              <span class="text-sm">Add Adjustment</span>
            </NuxtLink>
            <NuxtLink class="flex items-center gap-4 p-2 pl-4 text-red-500 rounded-md hover:bg-blue-100" href="/inventory/category">
              <ChartBarStacked class="w-4 h-4" />
              <span>Categories</span>
            </NuxtLink>
            <NuxtLink class="flex items-center gap-4 p-2 pl-4 text-red-500 rounded-md hover:bg-blue-100" href="/inventory/category/create">
              <CirclePlus class="w-4 h-4" />
              <span>Add Category</span>
            </NuxtLink>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <NuxtLink class="flex items-center justify-start w-full gap-4 p-2 font-medium text-green-700 bg-transparent rounded-md hover:text-green-700 hover:bg-blue-100" href="/report">
        <ClipboardList class="w-4 h-4" />
        <span>Sales</span>
      </NuxtLink>
      
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { PlusSquare, ChartBarStacked, ClipboardList, Package, PackageOpen, CirclePlus } from 'lucide-vue-next'
  import { ref } from "vue";

  const isOpenInventory = ref(false)
</script>
