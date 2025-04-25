<template>
  <div class="flex flex-col h-screen">
    <HeaderMenu />
    <div class="flex overflow-hidden ">
      <SidebarMenu class=""/>
      <div class="flex-1 px-4 py-4 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  colorMode: 'light',
})
</script>
