<template>
  <UTooltip
    :text="tooltipText"
    :delay-duration="0"
    :content="{
      side: 'top',
    }"
    :ui="tooltipStyles"
  >
    <div
      tabindex="0"
      :class="[
        'relative z-0 min-h-12 w-full border-2 font-semibold text-white shadow-inner transition-colors',
        {
          'border-neutral-500 bg-white/75 dark:border-neutral-700 dark:bg-neutral-900/75':
            isCorrect === null,
          'border-border-success bg-success hover:shadow-inner hover:brightness-110':
            isCorrect === true,
          'border-border-error bg-error hover:shadow-inner hover:brightness-110':
            isCorrect === false,
          'arrow-up': difference && difference > 0,
          'arrow-down': difference && difference < 0,
        },
      ]"
    >
      <div
        class="relative z-auto flex h-full items-center justify-center pt-2 text-center"
      >
        <slot />
      </div>
    </div>
  </UTooltip>
</template>

<script setup lang="ts">
const {
  isCorrect = null,
  difference,
  fieldLabel,
  fieldValue,
} = defineProps<{
  isCorrect?: boolean;
  difference?: number;
  fieldLabel: string;
  fieldValue?: string | number;
}>();

const tooltipText = computed(() => {
  if (fieldLabel === "Warframe") return `${fieldValue}`;
  if (isCorrect) return `Correct ${fieldLabel} (${fieldValue})`;
  if (isCorrect === false) return `Incorrect ${fieldLabel} (${fieldValue})`;
  return fieldLabel;
});

const tooltipStyles = computed(() => {
  const baseStyles = "text-md rounded-none py-2 px-3";

  if (isCorrect) {
    return {
      content: `${baseStyles} bg-success`,
    };
  } else if (isCorrect === false) {
    return { content: `${baseStyles} bg-error` };
  }
  return { content: `${baseStyles}` };
});
</script>

<style scoped>
.arrow-down {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -10;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    clip-path: polygon(
      0 50%,
      20% 50%,
      20% 0,
      80% 0,
      80% 50%,
      100% 50%,
      50% 100%
    );
  }

  &:hover::after {
    background: rgba(0, 0, 0, 0.7);
  }

  &::before {
    content: "";
    display: block;
  }
}

.arrow-up {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -10;
    clip-path: polygon(
      50% 0,
      100% 50%,
      80% 50%,
      80% 100%,
      20% 100%,
      20% 50%,
      0 50%
    );
  }
  &:hover::after {
    background: rgba(0, 0, 0, 0.7);
  }

  &::before {
    content: "";
    display: block;
  }
}
</style>
