<script setup lang="ts">
const {
  fieldLabel,
  fieldValue = "",
  tooltipDisabled = false,
  showVisualAssist = false,
  variant = "neutral",
} = defineProps<{
  fieldLabel: string;
  fieldValue?: string | number | string[];
  tooltipDisabled?: boolean;
  showVisualAssist?: boolean;
  variant?: Result;
}>();

const tooltipText = computed(() => {
  if (fieldLabel === "Warframe") return `${fieldValue}`;
  if (variant === "correct") {
    return `Correct ${fieldLabel} (${fieldValue})`;
  } else if (variant === "partial") {
    return `Partially Correct ${fieldLabel}`;
  } else {
    return `Incorrect ${fieldLabel} (${fieldValue})`;
  }
});

// I might need to make some of these the default styles for all tooltips
const tooltipStyles = computed(() => {
  const baseStyles = "text-md rounded-none py-2 px-3";

  if (variant === "correct") {
    return {
      content: `${baseStyles} bg-success`,
    };
  } else if (variant === "partial") {
    return { content: `${baseStyles} bg-partial` };
  } else if (variant === "neutral") {
    return { content: `${baseStyles}` };
  }
  return { content: `${baseStyles} bg-error` };
});
</script>
<template>
  <UTooltip
    :text="tooltipText"
    :delay-duration="0"
    :content="{
      side: 'top',
    }"
    :ui="tooltipStyles"
    :disabled="tooltipDisabled"
  >
    <div
      tabindex="0"
      :class="[
        'relative z-0 min-h-12 w-full border-2 font-medium wrap-break-word text-white shadow-inner transition-colors',
        {
          'border-neutral-500 bg-white/75 dark:border-neutral-700 dark:bg-neutral-900/75':
            variant === 'neutral',
          'border-border-success bg-success hover:shadow-inner hover:brightness-110':
            variant === 'correct',
          'border-border-partial bg-partial hover:shadow-inner hover:brightness-110':
            variant === 'partial',
          'border-border-error bg-error hover:shadow-inner hover:brightness-110':
            variant !== 'correct' && variant !== 'neutral',
          'arrow-up': variant === 'higher',
          'arrow-down': variant === 'lower',
        },
      ]"
    >
      <UiFeedbackTileStateIndicator
        v-if="showVisualAssist"
        :variant="variant"
      />
      <div
        class="relative z-auto flex h-full items-center justify-center pt-1 text-center text-shadow-md"
      >
        <slot />
      </div>
    </div>
  </UTooltip>
</template>
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
