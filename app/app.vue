<script setup lang="ts">
useHead({
  title: "Framedle",
  meta: [
    {
      name: "description",
      content: "Daily Guess a Warframe",
    },
  ],
});

const backgroundRef = useTemplateRef("background");
const parallax = reactive(useParallax(backgroundRef));
</script>

<template>
  <div>
    <div
      ref="background"
      class="background"
      :style="{
        backgroundPosition: `calc(50% + ${parallax.tilt * 30}px) calc(50% + ${parallax.roll * 30}px)`,
      }"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style scoped>
.background {
  background-image: url("/backgrounds/circuit-board.svg");
  background-repeat: repeat;
  background-size: 400px 400px;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  z-index: -20;
}
</style>
