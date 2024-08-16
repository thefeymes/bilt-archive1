<script setup>
import '@unocss/reset/tailwind-compat.css'
</script>

<template>
  <div
    un-bg="white dark:gray-900 "
    un-text="black dark:white"
    class="flex-center size-full overflow-hidden"
  >
    <NuxtPage />
  </div>
</template>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
}
* {
  box-sizing: border-box;
}

.flex-center {
  --at-apply: flex items-center justify-center;
}
</style>
