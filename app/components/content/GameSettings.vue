<template>
  <div class="flex items-center justify-between py-2">
    <p class="text-lg font-medium">Colorblind Mode</p>
    <USwitch v-model="$colorblindMode" @click="$toggleColorblindMode" />
  </div>
  <USeparator />
</template>

<script setup lang="ts">
//colorblind mode
const { $colorblindMode } = useNuxtApp();

//eventually localizations
//data transfer
</script>
