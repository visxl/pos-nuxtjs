<template>
    <div class="flex flex-col h-screen">
      <div class="flex-1 overflow-y-auto">
        <HeaderMenu />
        <slot />
    </div>
  </div>
</template>

<script>
definePageMeta({
  colorMode: 'light',
})
</script>
