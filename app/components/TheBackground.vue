<template>
  <div class="background-pattern" />
</template>
<style scoped>
:global(:root) {
  --dot-base: oklch(0.2 0.05 108/0.06);
  --dot-highlight: oklch(0.25 0.07 108/0.09);
}

:global(.dark) {
  --dot-base: oklch(0.72 0.05 var(--text-hue)/0.1);
  --dot-highlight: oklch(0.78 0.07 var(--text-hue)/0.2);
}

.background-pattern {
  position: fixed;
  inset: -24px;
  pointer-events: none;
  z-index: -1;
  background-image:
    radial-gradient(circle, var(--dot-base) 0 2px, transparent 2.2px)
      /* Smaller, more subtle dots */,
    radial-gradient(circle, var(--dot-highlight) 0 2.2px, transparent 2.5px);
  background-size:
    8px 8px /* Distance between smaller dots */,
    40px 40px;
  background-position:
    0 0,
    12px 12px;
  background-repeat: repeat, repeat;
}
</style>
