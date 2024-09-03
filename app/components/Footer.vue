<template>
  <footer class="py-2 text-center">
    <p>&copy; {{ year }} Framedle.com</p>
  </footer>
</template>

<script setup lang="ts">
const year = ref(new Date().getFullYear());
</script>
