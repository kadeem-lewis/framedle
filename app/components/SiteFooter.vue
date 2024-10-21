<template>
  <footer class="space-y-2 py-2 text-center">
    <div class="flex justify-center gap-3">
      <UButton
        color="indigo"
        :to="runtimeConfig.public.discordInvite"
        size="xl"
        target="_blank"
        class="text-current transition-transform hover:scale-110"
      >
        <UIcon name="my-icon:discord" class="size-6 text-white" />
        <span class="sr-only">discord invite link</span>
      </UButton>
      <UButton
        size="xl"
        color="black"
        to="https://x.comm/framedle"
        target="_blank"
        class="transition-transform hover:scale-110"
      >
        <span class="sr-only">x.com page</span>
        <UIcon name="my-icon:x" class="size-6 text-white dark:text-black" />
      </UButton>
      <UButton
        icon="i-mdi-information-variant"
        size="xl"
        color="black"
        class="transition-transform hover:scale-110"
        @click="isOpen = true"
      >
        <span class="sr-only">About Game</span>
      </UButton>
      <UButton
        size="xl"
        to="https://ko-fi.com/redeemr"
        :ui="{
          padding: {
            xl: 'p-1.5',
          },
        }"
        target="_blank"
        class="transition-transform hover:scale-110"
      >
        <UIcon name="my-icon:kofi" class="size-9" />
        <span class="sr-only">Donate</span>
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
</script>
