<script lang="ts" setup>
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()
</script>

<template>
  <div>test {{ colorMode }}</div>
</template>

<style></style>
