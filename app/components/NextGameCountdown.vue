<script setup lang="ts">
const props = defineProps<{
  targetDate: Date;
}>();

const router = useRouter();

const { timeUntil, isFinished } = useTimeUntil(props.targetDate);
</script>
<template>
  <div>
    <div
      v-if="isFinished"
      class="flex flex-col items-center justify-center gap-2"
    >
      <p class="text-lg">A new game is available!</p>
      <UButton variant="outline" @click="router.go(0)">Reload</UButton>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-2 text-xl">
      <p class="font-semibold">
        <slot name="title"> New Game in: </slot>
      </p>
      <span class="flex items-center gap-1">
        <slot name="icon">
          <UIcon name="i-mdi-circle-slice-2" class="size-5" />
        </slot>
        <span>{{ timeUntil }}</span>
      </span>
      <small class="text-muted text-sm"
        >Resets at midnight in your local time.</small
      >
    </div>
  </div>
</template>
