<script setup lang="ts">
const { inProgressDaysCount, completedDaysCount, notStartedDaysCount } =
  storeToRefs(useArchiveStore());
</script>
<template>
  <div class="flex items-center justify-between">
    <p class="flex items-center">
      <UBadge icon="i-mdi-check-circle" color="neutral" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-check-circle" class="text-success size-4" />
        </template>
        {{ completedDaysCount }}
      </UBadge>
      &nbsp;played
    </p>

    <p class="flex items-center">
      <UBadge color="neutral" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-play-circle" class="text-partial size-4" />
        </template>
        {{ inProgressDaysCount }}
      </UBadge>
      &nbsp;in progress
    </p>
    <p flex class="flex items-center">
      <UBadge icon="i-mdi-check-circle" color="neutral" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-check-circle" class="size-4" />
        </template>
        {{ notStartedDaysCount }}
      </UBadge>
      &nbsp;to play
    </p>
  </div>
</template>
