<template>
  <div>
    <ColorScheme
      ><USelect
        v-model="$colorMode.preference"
        :options="['system', 'light', 'dark']"
    /></ColorScheme>
  </div>
</template>

<script setup lang="ts"></script>
