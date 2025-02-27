<template>
  <footer class="space-y-2 py-2 text-center">
    <div class="flex justify-center gap-3">
      <UButton
        v-for="item of items"
        :key="item.srText"
        :color="item.color"
        size="lg"
        class="transition-transform hover:scale-110"
        @click="item.command"
      >
        <UIcon
          :name="item.icon"
          :class="{ '-m-2 size-9': item.srText === items[3]?.srText }"
          class="size-6 text-white dark:text-black"
        />
        <span class="sr-only">{{ item.srText }}</span>
      </UButton>
      <UModal v-model="isOpen">
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <p class="text-center text-xl font-semibold uppercase">About</p>
          </template>
          <ContentAboutGame />
        </UCard>
      </UModal>
    </div>
    <p>&copy; {{ year }} Framedle.com</p>
    <small>Warframe does not endorse or sponsor this product</small>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const isOpen = ref(false);

const year = ref(new Date().getFullYear());

const items = [
  {
    srText: "discord invite link",
    icon: "my-icon:discord",
    color: "indigo" as const,
    command: () =>
      navigateTo(runtimeConfig.public.discordInvite, { external: true }),
  },
  {
    srText: "x.com page",
    icon: "my-icon:x",
    color: "black" as const,
    command: () => navigateTo("https://x.com/framedle", { external: true }),
  },
  {
    srText: "About Game",
    icon: "i-mdi-information-variant",
    color: "black" as const,
    command: () => (isOpen.value = true),
  },
  {
    srText: "Donate",
    icon: "my-icon:kofi",
    color: "primary" as const,
    command: () => navigateTo("https://ko-fi.com/redeemr", { external: true }),
  },
];
</script>
