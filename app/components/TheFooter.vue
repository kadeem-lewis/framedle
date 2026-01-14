<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { openDialog } = useDialog();
const { proxy } = useScriptUmamiAnalytics();

const START_YEAR = 2024 as const;
const year = ref(new Date().getFullYear());

const items = [
  {
    srText: "discord invite link",
    icon: "my-icon-discord",
    color: "discord" as const,
    class: "dark:text-white",
    to: runtimeConfig.public.discordInvite,
    external: true,
    command: () => {
      proxy.track("clicked footer button", { name: "Discord" });
    },
  },
  {
    srText: "bsky.app page",
    icon: "my-icon-bluesky",
    color: "bluesky" as const,
    class: "text-white",
    to: "https://bsky.app/profile/framedle.bsky.social",
    external: true,
    command: () => {
      proxy.track("clicked footer button", { name: "Bluesky" });
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
    srText: "framedle subreddit",
    icon: "my-icon-reddit",
    color: "reddit" as const,
    class: "text-white",
    to: "https://www.reddit.com/r/framedle/",
    external: true,
    command: () => {
      proxy.track("clicked footer button", { name: "Reddit" });
    },
  },
];
</script>
<template>
  <footer class="flex flex-col gap-3 py-2 text-center">
    <div class="flex justify-center gap-3">
      <NuxtLink
        :href="runtimeConfig.public.kofiUrl"
        target="_blank"
        external
        @click="proxy.track('clicked footer button', { name: 'Ko-fi' })"
        ><NuxtImg
          height="40"
          class="h-10 border-0 hover:brightness-75"
          src="/KofiBadge.png"
          alt="Buy Me a Coffee at ko-fi.com"
      /></NuxtLink>
      <NuxtLink href="/android"
        ><NuxtImg
          height="40"
          class="h-10 border-0 hover:brightness-75"
          src="/PreRegisterOnGooglePlayBadge.png"
          alt="Pre-register on Google Play"
          @click="
            proxy.track('clicked footer button', { name: 'Google Play' })
          "
      /></NuxtLink>
    </div>
    <div class="flex justify-center gap-3">
      <UButton
        v-for="item of items"
        :key="item.srText"
        :color="item.color"
        size="lg"
        class="transition-transform hover:scale-110"
        :to="item.to"
        :external="item.external"
        @click="item.command"
      >
        <UIcon :name="item.icon" class="size-6" :class="item.class" />
        <span class="sr-only">{{ item.srText }}</span>
      </UButton>
    </div>

    <div class="flex flex-col gap-2 text-sm">
      <p>&copy; {{ START_YEAR }} - {{ year }} Framedle.com</p>
      <p>Warframe does not endorse or sponsor this product</p>
      <ULink
        to="/privacy"
        class="text-primary hover:text-primary/70 text-sm underline"
        >Privacy Policy</ULink
      >
    </div>
  </footer>
</template>
