<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { openDialog } = useDialog();
const { proxy } = useScriptUmamiAnalytics();

const year = ref(new Date().getFullYear());

const items = [
  {
    srText: "discord invite link",
    icon: "my-icon:discord",
    color: "discord" as const,
    class: "dark:text-white",
    command: () => {
      proxy.track("clicked footer button", { name: "Discord" });
      navigateTo(runtimeConfig.public.discordInvite, { external: true });
    },
  },
  {
    srText: "bsky.app page",
    icon: "my-icon:bluesky",
    color: "bluesky" as const,
    class: "text-white",
    command: () => {
      proxy.track("clicked footer button", { name: "Bluesky" });
      navigateTo("https://bsky.app/profile/framedle.bsky.social", {
        external: true,
      });
    },
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
    command: () => {
      proxy.track("clicked footer button", { name: "Ko-fi" });
      navigateTo("https://ko-fi.com/redeemr", { external: true });
    },
  },
];
</script>
<template>
  <footer class="flex flex-col gap-3 py-2 text-center">
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
    <div class="flex flex-col gap-2 text-sm">
      <p>&copy; {{ year }} Framedle.com</p>
      <p>Warframe does not endorse or sponsor this product</p>
      <ULink
        to="/privacy"
        class="text-sm text-(--ui-primary) underline hover:text-(--ui-primary)/70"
        >Privacy Policy</ULink
      >
    </div>
  </footer>
</template>
