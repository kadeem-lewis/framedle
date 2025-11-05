<script setup lang="ts">
const { inProgressDaysCount, completedDaysCount, notStartedDaysCount } =
  storeToRefs(useArchiveStore());
</script>
<template>
  <div class="grid grid-cols-2 items-center gap-2">
    <p class="flex shrink-0 items-center">
      <UBadge icon="i-mdi-check-circle" color="primary" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-check-circle" class="text-success size-5" />
        </template>
        {{ completedDaysCount }}
      </UBadge>
      &nbsp;played
    </p>

    <p class="flex shrink-0 items-center">
      <UBadge color="primary" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-play-circle" class="text-partial size-5" />
        </template>
        {{ inProgressDaysCount }}
      </UBadge>
      &nbsp;in progress
    </p>
    <p flex class="col-span-2 flex items-center">
      <UBadge icon="i-mdi-check-circle" color="primary" class="rounded-full">
        <template #leading>
          <UIcon name="i-mdi-check-circle" class="size-5" />
        </template>
        {{ notStartedDaysCount }}
      </UBadge>
      &nbsp;to play
    </p>
  </div>
</template>
