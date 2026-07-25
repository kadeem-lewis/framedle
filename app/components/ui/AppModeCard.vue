<script setup lang="ts">
const { card } = defineProps<{
  card: {
    label: string;
    route: string;
    source: string;
    background: string;
    description: string;
  };
}>();
</script>
<template>
  <div
    class="animate-border-rotate relative overflow-hidden p-0.5 shadow shadow-black before:absolute before:inset-[-250%] dark:shadow-none"
  >
    <UCard
      class="group relative z-0 ring-0"
      :ui="{
        body: 'p-3 sm:p-3',
      }"
    >
      <NuxtImg
        :src="card.background"
        :alt="`${card.label} background`"
        class="absolute inset-0 z-0"
        width="1920"
        sizes="sm:412px md:396px lg:380px"
        height="1080"
        :preload="{ fetchPriority: 'high' }"
        loading="eager"
      />
      <div
        class="absolute inset-0 z-0 bg-linear-to-tr from-black to-transparent to-65%"
      />
      <div class="relative z-10 flex flex-row items-center gap-5 text-white">
        <NuxtImg
          :src="card.source"
          :alt="card.label"
          height="48"
          width="48"
          :preload="{ fetchPriority: 'high' }"
          loading="eager"
          class="transition-transform duration-100 ease-in group-hover:scale-110"
        />
        <div class="text-shadow-xs">
          <p class="font-roboto text-xl font-bold text-primary uppercase">
            {{ card.label }}
          </p>
          <p class="font-medium uppercase">{{ card.description }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
<style scoped>
.animate-border-rotate::before {
  content: "";
  background: conic-gradient(
    var(--color-white),
    var(--color-pink-500),
    var(--color-sky-500),
    var(--color-amber-900),
    var(--color-red-500),
    var(--color-orange-500),
    var(--color-yellow-500),
    var(--color-green-500),
    var(--color-blue-500),
    var(--color-violet-500),
    var(--color-white)
  );
  will-change: transform;
  animation: border-rotate 5s linear infinite;
  padding: 0.25rem;
}

@keyframes border-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
