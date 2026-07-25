<script setup lang="ts">
const { label } = defineProps<{
  label: string;
}>();
</script>
<template>
  <div class="frame">
    <div class="frame__top">
      <div class="frame__top--start" />
      <p class="frame__top--label">{{ label }}</p>
      <div class="frame__top--end" />
    </div>
    <div class="frame__content">
      <slot />
    </div>
    <div class="frame__bottom" />
  </div>
</template>
<style scoped>
.frame {
  --frame-line-height: 3px;

  position: relative;
  display: flex;
  flex-direction: column;
}

.frame__top {
  display: flex;
  gap: 1rem;
  align-items: end;
}

.frame__top--label {
  text-transform: uppercase;
  line-height: 1;
}

.frame__top--start,
.frame__top--end {
  flex: 1;
  height: calc(var(--frame-line-height) * 3);
}

.frame__top--start {
  background:
    /* Main line */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      center / 100% var(--frame-line-height) no-repeat,
    /* top notch */
    linear-gradient(var(--text-color-default), var(--text-color-default)) right
      top / 30px var(--frame-line-height) no-repeat,
    /* Corner prong */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      bottom / calc(var(--frame-line-height) * 2) var(--frame-line-height)
      no-repeat;
}

.frame__top--end {
  background:
    /* Main line */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      center / 100% var(--frame-line-height) no-repeat,
    /* top notch */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      top / 30px var(--frame-line-height) no-repeat,
    /* Corner prong */
    linear-gradient(var(--text-color-default), var(--text-color-default)) right
      bottom / calc(var(--frame-line-height) * 2) var(--frame-line-height)
      no-repeat;
}

.frame__content {
  padding: 0.5rem;
}

.frame__bottom {
  height: calc(var(--frame-line-height) * 3);
  width: 100%;

  background:
    /* Main line */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      center / 100% var(--frame-line-height) no-repeat,
    /* Bottom notch */
    linear-gradient(var(--text-color-default), var(--text-color-default)) center
      bottom / 80px var(--frame-line-height) no-repeat,
    /* Corner prongs */
    linear-gradient(var(--text-color-default), var(--text-color-default)) left
      top / calc(var(--frame-line-height) * 2) var(--frame-line-height)
      no-repeat,
    linear-gradient(var(--text-color-default), var(--text-color-default)) right
      top / calc(var(--frame-line-height) * 2) var(--frame-line-height)
      no-repeat;
}
</style>
