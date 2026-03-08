<script setup lang="ts">
const { card, showStats = false } = defineProps<{
  card: {
    label: string;
    route: string;
    source: string;
    background: string;
    description: string;
    streak: number;
  };
  showStats?: boolean;
}>();
</script>
<template>
  <div
    class="animate-border-rotate relative overflow-hidden p-0.5 shadow shadow-black before:absolute before:-inset-[200%] dark:shadow-none"
  >
    <UCard
      class="group relative z-0 ring-0 transition-all"
      :ui="{
        body: 'p-3 sm:p-3',
      }"
    >
      <div
        :style="{ backgroundImage: `url(${card.background})` }"
        class="absolute inset-0 z-0 bg-cover dark:brightness-50 group-hover:dark:brightness-75"
      />
      <div class="relative z-10 flex flex-row items-center gap-8 text-white">
        <NuxtImg
          format="avif"
          :src="card.source"
          :alt="card.label"
          height="48"
          width="48"
          preload
          loading="eager"
          fetch-priority="high"
          class="group-hover:scale-110"
        />
        <div class="brightness-90 group-hover:brightness-100">
          <p class="font-roboto text-xl font-bold text-primary uppercase">
            {{ card.label }}
          </p>
          <p class="font-medium uppercase">{{ card.description }}</p>
        </div>
      </div>
      <ClientOnly>
        <div v-if="showStats && card.streak > 0" class="absolute top-2 right-2">
          <span class="relative inline-block">
            <UIcon
              name="my-icon:flame"
              class="inline-block size-9 text-amber-500 dark:text-amber-600"
            />
            <span
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 align-middle font-bold text-white"
            >
              {{ card.streak }}
            </span>
          </span>
        </div>
      </ClientOnly>
    </UCard>
  </div>
</template>
<style scoped>
.animate-border-rotate::before {
  content: "";
  background: conic-gradient(
    var(--color-amber-500),
    var(--color-amber-200),
    var(--color-amber-600),
    var(--color-amber-500)
  );
  will-change: transform;
  animation: border-rotate 2.5s linear infinite;
  padding: 0.125rem;
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
