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
      :class="[$colorMode.value === 'dark' ? 'dark' : 'light']"
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
  background-repeat: repeat;
  background-size: 400px 400px;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  z-index: -20;
}

.dark {
  background-image: url("/backgrounds/circuit-board.svg");
}

.light {
  background-image: url("/backgrounds/circuit-board-light.svg");
}
</style>
