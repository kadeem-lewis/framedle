<template>
  <div class="background-pattern" />
  <div class="pointer-events-none fixed inset-0 -z-1">
    <EntratiEye class="absolute top-1/5 left-1/3 size-52 text-(--eye-color)" />
    <EntratiEye class="absolute inset-2/3 size-50 text-(--eye-color)" />
    <EntratiEye
      class="absolute bottom-1/15 left-1/8 hidden size-50 text-(--eye-color) lg:block"
    />
    <EntratiEye
      class="absolute top-1/8 right-1/12 hidden size-52 text-(--eye-color) lg:block"
    />
  </div>
</template>
<style scoped>
:global(:root) {
  --dot-base: oklch(0.2 0.05 108/0.06);
  --dot-highlight: oklch(0.25 0.07 108/0.09);
  --eye-color: oklch(0.2 0.05 108/0.06);
}

:global(.dark) {
  --dot-base: oklch(0.72 0.05 var(--text-hue)/0.1);
  --dot-highlight: oklch(0.78 0.07 var(--text-hue)/0.2);
  --eye-color: oklch(0.72 0.12 255/0.1);
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
