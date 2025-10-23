<script setup lang="ts">
const { inProgressDaysCount, completedDaysCount, notStartedDaysCount } =
  storeToRefs(useArchiveStore());
</script>
<template>
  <div>
    <p>Played: {{ completedDaysCount }}</p>
    <p>Not Started: {{ notStartedDaysCount }}</p>
    <p>In Progress: {{ inProgressDaysCount }}</p>
  </div>
</template>
