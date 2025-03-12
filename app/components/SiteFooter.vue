<template>
  <footer class="space-y-3 py-2 text-center">
    <div class="flex justify-center gap-3">
      <UButton
        v-for="item of items"
        :key="item.srText"
        :color="item.color"
        size="lg"
        class="transition-transform hover:scale-110"
        @click="item.command"
      >
        <UIcon :name="item.icon" class="size-6" :class="item.class" />
        <span class="sr-only">{{ item.srText }}</span>
      </UButton>
    </div>
    <p class="text-sm">&copy; {{ year }} Framedle.com</p>
    <p class="text-sm">Warframe does not endorse or sponsor this product</p>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { openDialog } = useDialog();

const year = ref(new Date().getFullYear());

const items = [
  {
    srText: "discord invite link",
    icon: "my-icon:discord",
    color: "indigo" as const,
    class: "dark:text-white",
    command: () =>
      navigateTo(runtimeConfig.public.discordInvite, { external: true }),
  },
  {
    srText: "bsky.app page",
    icon: "my-icon:bluesky",
    color: "blue" as const,
    class: "text-white",
    command: () =>
      navigateTo("https://bsky.app/profile/framedle.bsky.social", {
        external: true,
      }),
  },
  {
    srText: "About Game",
    icon: "i-mdi-information-variant",
    color: "neutral" as const,
    class: "",
    command: () => openDialog(dialogOptions.ABOUT),
  },
  {
    srText: "Donate",
    icon: "my-icon:kofi",
    color: "primary" as const,
    class: "-m-2 size-9",
    command: () => navigateTo("https://ko-fi.com/redeemr", { external: true }),
  },
];
</script>
